/* ============================================================
   Traduction FR → EN du contenu du portfolio.

   Pourquoi une fonction Edge plutôt qu'un appel depuis le navigateur :
   la clé Anthropic ne doit jamais partir dans le bundle. Contrairement à
   la clé anon de Supabase — inoffensive, puisque les politiques RLS la
   bordent — une clé d'API en clair dans le JavaScript est une clé volée.
   Elle vit donc ici, en secret côté serveur.

   L'appelant est vérifié deux fois : Supabase valide le JWT en amont
   (`verify_jwt`), puis on exige que ce soit bien l'adresse admin — la même
   règle que celle des politiques d'écriture dans schema.sql. Un compte
   authentifié quelconque ne doit pas pouvoir dépenser la clé.

   Secrets à renseigner sur le projet :
     supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ============================================================ */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.121.0";
import { createClient } from "npm:@supabase/supabase-js@2";

/** Doit rester en phase avec les politiques de schema.sql. */
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "guilhemterrier58@gmail.com";

/* La fonction exige un JWT admin valide : c'est là qu'est la frontière de
   sécurité, pas dans l'origine. Autoriser toutes les origines évite de
   casser le site à chaque changement de domaine sans rien relâcher. */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

interface Item {
  id: string;
  label: string;
  text: string;
  list?: boolean;
}

const SYSTEM = `Tu traduis le contenu d'un portfolio personnel du français vers l'anglais.

L'auteur est un designer et développeur français. Sa voix est directe, concrète,
sans jargon promotionnel : elle affirme, elle nuance, elle reconnaît les limites
d'un projet. Restitue ce ton plutôt que de le lisser en prose corporate.

RÈGLES DE FIDÉLITÉ — elles priment sur l'élégance :

1. Anglais britannique (favourites, organisation, realise, programme).
2. Traduis le SENS, pas les mots. Une tournure calquée sur le français est une
   erreur, même si elle est compréhensible.
3. Préserve exactement les liens markdown [libellé](url) : traduis le libellé,
   et recopie l'URL caractère pour caractère, sans jamais la modifier.
4. Préserve exactement les espaces et les caractères invisibles ou inhabituels
   en début, en fin et à l'intérieur du texte — sauts de ligne, espaces
   insécables, caractères de calage. Ils servent la mise en page : les
   supprimer casse l'affichage.
5. Ne traduis pas les noms propres, marques, produits, écoles, institutions ni
   noms d'outils : Inrap, C2RMF, Wakey, Elapsio, ArtSing, Figma, Supabase,
   Next.js, Cité de l'Architecture et du Patrimoine, etc. Un intitulé de
   diplôme ou d'institution peut être glosé s'il est opaque, jamais remplacé.
6. Respecte le registre typographique de la source. Un libellé d'interface en
   minuscules reste en minuscules ; une phrase reste une phrase, avec sa
   ponctuation finale ou son absence.
7. Les guillemets français « » deviennent des guillemets anglais " ".
8. Si le champ est marqué list:true, la traduction doit compter EXACTEMENT le
   même nombre de lignes, dans le même ordre, une entrée par ligne.
9. Les chiffres, unités et pourcentages sont recopiés tels quels.

Renvoie une entrée par identifiant reçu, avec le même identifiant. N'invente
aucun identifiant. Si un texte n'a pas à être traduit (une marque seule, par
exemple), renvoie-le inchangé plutôt que de l'omettre.`;

const SCHEMA = {
  type: "object",
  properties: {
    translations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          text: { type: "string" },
        },
        required: ["id", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["translations"],
  additionalProperties: false,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return json(
      { error: "ANTHROPIC_API_KEY n’est pas renseignée sur le projet Supabase." },
      500,
    );
  }

  /* ---- l'appelant est-il bien l'admin ? ---- */
  const authorization = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authorization } } },
  );

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || auth.user?.email !== ADMIN_EMAIL) {
    return json({ error: "Accès refusé." }, 403);
  }

  /* ---- entrée ---- */
  let items: Item[];
  try {
    const body = await req.json();
    items = Array.isArray(body?.items) ? body.items : [];
  } catch {
    return json({ error: "Corps de requête illisible." }, 400);
  }

  const usable = items.filter(
    (item) => item && typeof item.id === "string" && typeof item.text === "string" && item.text.trim(),
  );
  if (usable.length === 0) return json({ translations: [] });
  // Garde-fou : le client découpe déjà en lots, ceci borne un appel direct.
  if (usable.length > 60) return json({ error: "Trop de champs en une fois (max 60)." }, 400);

  /* ---- traduction ---- */
  try {
    const client = new Anthropic({ apiKey });

    // En flux : traduire tout le contenu d'un coup produit une réponse longue,
    // et un POST classique expirerait avant la fin.
    const stream = client.messages.stream({
      model: "claude-opus-5",
      max_tokens: 32000,
      system: SYSTEM,
      thinking: { type: "adaptive" },
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [
        {
          role: "user",
          content:
            "Traduis chacun de ces champs.\n\n" +
            JSON.stringify(
              usable.map((item) => ({
                id: item.id,
                champ: item.label,
                list: item.list === true,
                texte: item.text,
              })),
              null,
              2,
            ),
        },
      ],
    });

    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
      return json({ error: "La traduction a été refusée par le modèle." }, 502);
    }

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    const parsed = JSON.parse(text) as { translations?: { id: string; text: string }[] };
    const allowed = new Set(usable.map((item) => item.id));

    return json({
      // Un identifiant que nous n'avons pas envoyé n'a rien à faire dans la
      // réponse : il écrirait dans un champ que personne n'a demandé.
      translations: (parsed.translations ?? []).filter((entry) => allowed.has(entry.id)),
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return json({ error: `Traduction impossible : ${detail}` }, 502);
  }
});
