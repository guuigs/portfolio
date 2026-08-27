/* ============================================================
   Content model — the whole site is data.
   Nothing in the views is hard-coded; the Ctrl+A admin layer
   edits this shape and persists it to localStorage.
   Seeded with the real copy, images and links from the site.
   ============================================================ */

// --- Case-study imagery -------------------------------------------------
import imgElapsioLogo from "@/assets/images/Experiences/Design graphique/Elapsio1.png";
import imgElapsioPack from "@/assets/images/Experiences/Design graphique/Elapsio 2.png";
import imgLKL from "@/assets/images/Experiences/Design graphique/LKL.png";
import imgArtsingSite from "@/assets/images/Experiences/Design graphique/Artsing.png";
import imgArtsingStack from "@/assets/images/Experiences/Developpement web/Artsing.png";
import imgWakeyStack from "@/assets/images/Experiences/Developpement web/Wakey.png";
import imgWakeyScreens from "@/assets/images/Experiences/Experience utilisateur/Wakey.png";
import imgMemoireThumb from "@/assets/images/Experiences/Experience utilisateur/memoire-thumb.png";
import imgMemoireNumeros from "@/assets/images/Experiences/Experience utilisateur/memoire-maquette-numeros.png";
import imgMemoireQR from "@/assets/images/Experiences/Experience utilisateur/memoire-maquette-qr.png";
import imgC2RMF from "@/assets/images/Experiences/Gestion de projet/C2RMF.png";
import imgHome from "@/assets/images/home-image.png";

// --- Coups de cœur imagery ---------------------------------------------
import imgNotreDame from "@/assets/images/likes/Notre dame de paris.jpg";
import imgPiliers from "@/assets/images/likes/Les piliers de la terre.jpg";
import imgSorceleur from "@/assets/images/likes/le sorceleur.jpg";
import imgBelAmi from "@/assets/images/likes/bel ami.jpg";
import imgMoonfleet from "@/assets/images/likes/moonfleet.jpg";
import imgSeigneur from "@/assets/images/likes/le seigneur des anneaux.jpg";
import imgOnePiece from "@/assets/images/likes/one piece.jpg";
import imgRevolution from "@/assets/images/likes/révolution.jpg";
import imgAsterix from "@/assets/images/likes/astérix le gaulois.jpg";
import imgKingdom from "@/assets/images/likes/kingdom.jpg";
import imgMaitres from "@/assets/images/likes/les maitres de l'orge.jpg";
import imgHorde from "@/assets/images/likes/la horde de contrevent.jpg";
import imgLaLaLand from "@/assets/images/likes/la la land.jpg";
import imgPorco from "@/assets/images/likes/porco rosso.jpg";
import imgBabylon from "@/assets/images/likes/babylon.jpg";
import imgCowboy from "@/assets/images/likes/cowboy bebop.jpg";
import imgBudapest from "@/assets/images/likes/the grand budapest hotel.jpg";
import imgPulp from "@/assets/images/likes/pulp fiction.jpg";
import imgSoleilPluvieux from "@/assets/images/likes/soleil pluvieux.jpg";
import imgAllLights from "@/assets/images/likes/all of the lights.jpg";
import imgIWillSurvive from "@/assets/images/likes/i will survive.jpg";
import img20000 from "@/assets/images/likes/20.000.jpg";
import imgWakeMeUp from "@/assets/images/likes/wake me up.jpg";
import imgPairWings from "@/assets/images/likes/pair of wings.jpg";
import imgHistoireEtrange from "@/assets/images/likes/Une histoire étrange.jpg";
import imgSoleilVie from "@/assets/images/likes/Soleil de ma vie.jpg";

// ---------------------------------------------------------------- types

/**
 * Bumped whenever the shape of `Content` changes, or whenever the seeded copy
 * is rewritten deeply enough that a previously published payload should no
 * longer win over what ships in this file. The store compares it against the
 * saved draft and against the published row, and falls back to the defaults
 * when they disagree — see `lib/store.tsx`.
 */
export const CONTENT_VERSION = 3;

/** One measured outcome. A figure and a label — a case study that needs a
 *  sentence to explain its number does not really have one. */
export interface Figure {
  value: string;
  label: string;
  /** English translation of `label`, edited from the CMS like everything
   *  else here. Falls back to a bundled translation, then to `label`
   *  itself — see `lib/content.en.ts`. */
  labelEn?: string;
}

export interface CaseImage {
  value: string;
  caption: string;
  captionEn?: string;
  /** Natural ratio, so a screenshot is shown whole rather than cropped to 4:3. */
  ratio?: string;
}

/**
 * A case study, as named sections rather than a free sequence of blocks.
 *
 * The previous model was a `Block[]` with free headings, and every article
 * invented its own shape: six to sixteen blocks, and six different sets of
 * section titles across six cases. Fixed fields make the structure a property
 * of the type — a new case cannot be written in another order, nor shipped
 * without stating its problem.
 *
 * The arc is the standard one: context, problem, approach, result.
 */
export interface CaseStudy {
  id: string;
  title: string;
  /** Short label for carousel thumbnails and skill rails. */
  shortTitle: string;
  date: string;
  thumb: string;

  /** Standfirst under the title, for someone scanning the page. */
  summary: string;

  /* ---- fiche ---- */
  role: string;
  /** Client, employer or framing of the project. */
  client: string;
  /** What was handed over, as short noun phrases. */
  deliverables: string[];

  /* ---- récit ---- */
  context: string;
  problem: string;
  /** What was actually done, one action per line. */
  approach: string[];
  result: string;

  /** Measured outcomes. Omitted rather than invented. */
  figures?: Figure[];
  images: CaseImage[];
  links?: { href: string; label: string; labelEn?: string }[];

  /* ---- english translations ----
     Every field above has an optional English counterpart, edited from the
     CMS exactly like the French one and published to Supabase the same way.
     Empty/absent falls back to a bundled translation and then to the French
     text — see `localizeContent` in `lib/content.en.ts`. Nothing here is
     ever overridden by that bundled fallback once a real value is set. */
  titleEn?: string;
  shortTitleEn?: string;
  summaryEn?: string;
  roleEn?: string;
  clientEn?: string;
  deliverablesEn?: string[];
  contextEn?: string;
  problemEn?: string;
  approachEn?: string[];
  resultEn?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  stack: string[];
  /** CaseStudy ids surfaced in this skill's rail. */
  cases: string[];
  titleEn?: string;
  descriptionEn?: string;
  stackEn?: string[];
}

export interface Like {
  id: string;
  title: string;
  author: string;
  date: string;
  kind: string;
  link: string;
  image: string;
  ratio: string;
  kindEn?: string;
}

export interface Profile {
  name: string;
  role: string;
  heroTitle: string;
  heroIntro: string;
  heroImage: string;
  /**
   * Optional replacement for the SVG wordmark in the header — a GIF, typically.
   * Left empty the vector logo is used, so this stays a reversible experiment
   * rather than a one-way swap. Optional on purpose: making it required would
   * bump CONTENT_VERSION and throw away the payload already published.
   */
  logo?: string;
  footerName: string;
  footerLine: string;
  /** The paragraph under the footer heading. Supports [texte](url) links. */
  footerBody: string;
  heroTitleEn?: string;
  heroIntroEn?: string;
  footerNameEn?: string;
  footerLineEn?: string;
  footerBodyEn?: string;
}

export interface Socials {
  cv: string;
  linkedin: string;
  mail: string;
  github: string;
}

export interface Content {
  version: number;
  profile: Profile;
  socials: Socials;
  skills: Skill[];
  cases: CaseStudy[];
  likes: Like[];

  /**
   * Provenance of the machine-translated `*En` fields.
   *
   * Maps the dotted path of a French field to the exact text that was sent for
   * translation. It is what lets the CMS tell a translation that is still true
   * of its source from one whose French has since been rewritten — the drift
   * that made the English side quietly wrong before. Nothing reads it at render
   * time: a published `*En` is the author's, and always wins.
   *
   * Absent for anything typed by hand, which is the point: only a translation
   * this app produced can be said to have gone stale.
   */
  translations?: { source: Record<string, string> };
}

// ------------------------------------------------------------- defaults

export const DEFAULT_CONTENT: Content = {
  version: CONTENT_VERSION,

  profile: {
    name: "Guilhem Terrier",
    role: "design · ux · développement",
    heroTitle: "Créer et être heureux",
    heroIntro:
      "Je conçois des marques, des interfaces et des expériences. Un visuel se pense d’abord par son message et par la personne à qui il s’adresse.",
    heroImage: imgHome,
    footerName: "Je m’appelle Guilhem",
    footerLine: "et je fais de yummy experiments.",
    footerBody:
      "Designer et développeur, je travaille la marque, l’interface et le code sur le même " +
      "établi. J’aime les projets où l’on peut encore décider de tout : le message, la forme, " +
      "et la manière dont ça se tient à l’écran. Si quelque chose ici vous parle, " +
      "[écrivez-moi](mailto:guilhemterrier58@gmail.com) — je réponds toujours.",
  },

  socials: {
    cv: "/pdf/cv.pdf",
    linkedin: "https://www.linkedin.com/in/guilhem-terrier-838928240/",
    mail: "mailto:guilhemtr@proton.me",
    github: "https://github.com/guuigs",
  },

  skills: [
    {
      id: "ux",
      title: "Expérience utilisateur & conception produit",
      description:
        "Mes études et mes expériences m’ont montré à quel point l’étude du comportement réel est cruciale au succès d’un produit — et à quel point, paradoxalement, elle est peu pratiquée. Je pars donc de l’usage : entretiens, questionnaires, corpus, tests en situation. Mon mémoire est allé jusqu’à contester ma propre discipline, en restant ouvert à l’hypothèse que le design n’était pas la solution.",
      stack: [
        "Recherche utilisateur",
        "Entretiens semi-directifs",
        "Questionnaires",
        "Analyse de corpus",
        "Personas",
        "Wireframes",
        "Prototypage Figma",
        "Design system",
        "Tests en situation",
        "Accessibilité",
      ],
      cases: ["memoire", "frenchbook", "megacarte", "wakey"],
    },
    {
      id: "design",
      title: "Design graphique & identité",
      description:
        "Un visuel se pense d’abord par le message qu’il porte et par la personne à qui il s’adresse. J’ai forgé cette pratique en freelance et sur des projets annexes, jusqu’à la contrainte physique : un système d’identité ne vaut que s’il survit à la sérigraphie sur sachet, à la compression d’un flux vidéo ou à l’imposition d’un livret A5.",
      stack: [
        "Identité visuelle",
        "Typographie",
        "Direction artistique",
        "Packaging",
        "Pré-presse CMJN",
        "Illustrator",
        "Photoshop",
        "InDesign",
        "Figma",
        "Mise en page éditoriale",
      ],
      cases: ["elapsio", "lkl", "artsing"],
    },
    {
      id: "web",
      title: "Développement produit",
      description:
        "Je code mes propres conceptions, de la maquette au déploiement. Je le présente pour ce que c’est : une compétence de développeur produit en autonomie, très assistée par l’IA, sans revue de code par des pairs ni formation d’ingénierie formelle. C’est un atout de handoff et de QA design — je parle la langue des développeurs et je livre ce que je dessine — plutôt qu’une expérience de front-end en équipe.",
      stack: [
        "TypeScript",
        "React",
        "React Native",
        "Next.js",
        "Tailwind CSS",
        "Zustand",
        "IndexedDB",
        "Expo",
        "p5.js",
        "Git",
        "Claude Code",
      ],
      cases: ["frenchbook", "thebookclub", "wakey", "artsing"],
    },
    {
      id: "infra",
      title: "Back-end, infrastructure & conformité",
      description:
        "Modéliser une base, poser les bonnes règles d’accès, et ne jamais exposer ce qui ne doit pas l’être. Sur Megacarte, le RGPD et le RGAA ont été traités comme des contraintes de conception dès le départ plutôt que comme un correctif : consentement explicite à la cession de droits, empreinte d’IP comme preuve légale au lieu de l’IP en clair, hébergement européen par principe.",
      stack: [
        "Supabase",
        "PostgreSQL",
        "Row Level Security",
        "API REST",
        "Mistral",
        "Perplexity",
        "VPS Linux",
        "GitHub Actions",
        "Bunny.net",
        "RGPD",
        "RGAA",
      ],
      cases: ["megacarte", "frenchbook", "thebookclub"],
    },
    {
      id: "ia",
      title: "IA & architecture agentique",
      description:
        "Concevoir des chaînes de travail où l’IA a un périmètre écrit, pas un rôle vague. Pour mon mémoire, six sous-agents aux permissions distinctes — un seul autorisé à écrire la prose finale, un autre chargé de contester mes propres thèses — et un journal des contributions de l’IA versé à la méthodologie. C’est une compétence d’architecture de workflow, et je la démontre par le dépôt public plutôt que par un mot-clé sur un CV.",
      stack: [
        "Claude Code",
        "Sous-agents",
        "Skills & hooks",
        "MCP",
        "Prompt engineering",
        "Anthropic API",
        "Mistral OCR",
        "MiniMax TTS",
        "ElevenLabs Music",
        "Logs de contribution",
      ],
      cases: ["memoire", "capa", "frenchbook"],
    },
    {
      id: "project",
      title: "Gestion de projet & éditorial",
      description:
        "Trois ans d’alternance au C2RMF puis à l’Inrap, à faire le lien entre des départements qui ne parlent pas la même langue : scientifiques, techniques, prestataires. Dans une institution, un site souffre rarement d’un problème technique — il souffre d’un problème de production, et c’est là que se joue le travail.",
      stack: [
        "Pilotage de prestataires",
        "Ateliers de co-conception",
        "Recueil de besoins",
        "Drupal",
        "SEO institutionnel",
        "Analytics",
        "Rédaction web",
        "Obsidian",
        "Zotero",
      ],
      cases: ["c2rmf", "megacarte", "memoire"],
    },
  ],

  cases: [
    /* ---------------------------------------------------- french book */
    {
      id: "frenchbook",
      shortTitle: "FrenchBook Scan",
      title: "FrenchBook Scan — contrôler la réception d’un carton de livres",
      date: "2026",
      thumb: "",
      summary:
        "Une application web qui photographie le bordereau papier, l’OCRise avec deux moteurs en parallèle, fait arbitrer les cas douteux, puis fait scanner les livres un à un. Pensée pour une main, debout, en entrepôt.",
      role: "Conception produit, UX et développement, en solo",
      client: "FrenchBook Distribution — mission freelance, en production",
      deliverables: [
        "Application web Next.js déployée",
        "Double lecture OCR croisée et arbitrage",
        "Scan code-barres en flux continu",
        "Export PDF du contrôle",
      ],
      context:
        "À l’export, chaque carton arrive avec son bon de commande papier — bordereau SODIS/Gallimard ou CDL Hachette. Avant l’expédition, il faut confirmer que le contenu physique correspond ligne pour ligne à ce bordereau. C’est le maillon qui conditionne la suite : tant qu’un carton n’est pas contrôlé, il ne part pas.",
      problem:
        "Le contrôle se fait au papier et à l’œil, référence après référence. C’est lent, et la vigilance baisse exactement là où l’erreur coûte le plus cher : un ISBN mal lu ne reste pas une faute de frappe, il devient un litige fournisseur. Le contexte n’aide pas — on tient le téléphone d’une main, on manipule les livres de l’autre, debout, dans un entrepôt.",
      approach: [
        "Observer l’étape sur le terrain pour modéliser les erreurs réelles des bordereaux plutôt qu’un cas d’école : décalage d’un bloc de deux lignes, compléments de titre pris pour des articles, intertitres qui sortent du décompte, doublons d’ISBN.",
        "Faire lire chaque page par deux moteurs Mistral en parallèle — endpoint documentaire et modèle vision — avec un schéma JSON strict imposé aux deux, pour rendre leurs sorties comparables champ à champ.",
        "Trancher les divergences par la clé de contrôle de l’ISBN : l’EAN-13 se valide tout seul, donc la machine arbitre sans demander à personne de recalculer une clé de tête.",
        "Séparer strictement ce qui bloque l’opérateur — ISBN cassé, deux ISBN valides concurrents, quantité incohérente — de ce qui reste une simple mention affichée, qui n’interrompt jamais le flux.",
        "Scanner en flux continu avec ZXing, Safari n’implémentant pas BarcodeDetector, et poser un anti-rebond : pause de 900 ms après validation, double lecture exigée pour tout ce qui n’est pas un code Bookland.",
        "Compenser par le design ce que l’iOS ne permet pas — ni vibration ni contrôle de la torche : la confirmation passe par un voile plein écran coloré, visible sans regarder.",
        "Garder les clés d’API côté serveur, protéger l’accès par un cookie signé HMAC, et ne rien stocker : le carton clos, tout est effacé.",
      ],
      result:
        "L’opérateur ne recopie plus rien. Il valide un scan, arbitre les quelques cas signalés, puis passe les livres devant la caméra ; le contrôle ligne à ligne laisse place à une liste d’écarts, beaucoup plus courte à traiter. L’application est en usage réel par l’équipe de réception, et l’étape gagne 35 % d’efficacité. Le parti pris assumé : préférer bloquer à tort, rarement, plutôt que laisser passer une erreur silencieuse.",
      figures: [
        { value: "+35 %", label: "d’efficacité sur l’étape de contrôle" },
        { value: "2", label: "moteurs OCR croisés, arbitrés par la clé ISBN" },
      ],
      images: [],
    },
    /* ---------------------------------------------------------- mémoire */
    {
      id: "memoire",
      shortTitle: "Mémoire M2",
      title: "Mémoire — pourquoi les audioguides sur smartphone ne prennent pas",
      date: "2024 — 2026",
      thumb: imgMemoireThumb,
      summary:
        "117 pages, quatre entretiens, 70 répondants, six audioguides analysés et un prototype testé en salle. Je cherchais un problème de design ; le terrain m’a répondu autre chose.",
      role: "Recherche, terrain, prototype",
      client:
        "Master Design d’Interface Multimédia et Internet, Université Sorbonne Paris Nord — direction Benoît Berthou",
      deliverables: [
        "Mémoire de 117 pages",
        "Entretiens visiteurs et institutions",
        "Corpus de six audioguides analysés",
        "Prototype testé à la Cité de l’Architecture et du Patrimoine",
      ],
      context:
        "En dix ans, le nombre d’applications muséales a doublé en France : 398 en 2015, 530 en 2021. Pendant ce temps, l’audioguide dédié reste utilisé par 75 % des visiteurs quand l’application sur smartphone personnel plafonne autour de 50 % (baromètre Gece, 2025). On produit de plus en plus d’un outil de moins en moins utilisé.",
      problem:
        "Entre la promesse d’une médiation accessible et la réalité d’un outil marginalement adopté, qu’est-ce qui empêche l’audioguide mobile de tenir son rôle ? L’analyse du corpus donne une première piste : la quasi-totalité des interfaces force le regard vers l’écran — cartes, menus, listes de parcours — au détriment de ce que le visiteur est venu voir. Or le regard est la ressource rare dans un musée.",
      approach: [
        "Poser cinq hypothèses — conception, économique, organisationnelle, contextuelle, et le support lui-même — puis les mettre à l’épreuve d’un dispositif qualitatif.",
        "Mener quatre entretiens semi-directifs : deux côté visiteurs, deux côté institutions — un musée avec audioguide, un musée sans.",
        "Passer un questionnaire, 70 répondants.",
        "Analyser un corpus de six audioguides selon une grille commune.",
        "Concevoir l’inverse de ce que fait le corpus : un déclenchement simple, l’audio au centre, l’écran en périphérie, et pour idéal que le téléphone puisse rester dans la poche.",
        "Tester deux maquettes auprès de cinq visiteurs dans la Galerie des moulages — même interface de lecture, seule l’entrée change : saisie d’un numéro contre scan d’un QR code.",
      ],
      result:
        "Quatre visiteurs sur cinq ont préféré le QR code : moins d’étapes, un geste plus familier. Mais la préférence est arrivée avec une réserve qui dit l’essentiel — « Quand je suis dans un musée, j’ai pas forcément envie d’être sur mon téléphone. » Je suis parti en cherchant un défaut de conception, et j’ai trouvé une chaîne de production : entre la conservation qui valide, la médiation qui écrit sous surveillance et le prestataire qui standardise, l’audioguide finit sans auteur identifiable. On peut concevoir la meilleure interface du monde, elle se heurtera toujours à une question de gouvernance et non de conception : qui paie pour la développer, et qui garantit qu’elle sera maintenue ? Ce mémoire est aussi l’endroit où j’ai dû reconnaître mon propre biais — je pensais en termes d’outil, pas en termes de visiteur, exactement le reproche que je faisais aux institutions. Soutenu en juin 2026, major de promotion, meilleure note de mémoire de la promotion.",
      figures: [
        { value: "4 sur 5", label: "visiteurs ont préféré le QR code au numéro" },
        { value: "70", label: "répondants au questionnaire, 6 audioguides analysés" },
      ],
      images: [
        {
          value: imgMemoireNumeros,
          caption: "Maquette 1 — la logique des numéros, héritée du boîtier.",
          ratio: "1100 / 577",
        },
        {
          value: imgMemoireQR,
          caption:
            "Maquette 2 — la logique du QR code, précédée d’un module d’accueil en quatre écrans.",
          ratio: "952 / 557",
        },
      ],
      links: [
        { href: "/pdf/memoire-m2-dimi.pdf", label: "Lire le mémoire (M2, 117 pages)" },
        { href: "/pdf/memoire-m1-dimi.pdf", label: "Lire l’état de l’art (M1, 34 pages)" },
      ],
    },

    /* -------------------------------------------------------- megacarte */
    {
      id: "megacarte",
      shortTitle: "Megacarte",
      title: "Megacarte — cartographier le patrimoine mégalithique avec ses habitants",
      date: "2026",
      thumb: "",
      summary:
        "Une plateforme cartographique contributive en contexte public, où le RGPD et l’accessibilité ont été traités comme des contraintes de conception dès la première maquette.",
      role: "Recherche, conception et développement",
      client: "Inrap — Institut national de recherches en archéologie préventive",
      deliverables: [
        "Recherche utilisateur et personas",
        "Prototypage Figma mobile-first",
        "Plateforme Next.js déployée",
        "Back-office de modération",
      ],
      context:
        "Le patrimoine mégalithique est dispersé, souvent hors des circuits balisés, et ceux qui le connaissent le mieux sont rarement des institutions : ce sont des habitants, des marcheurs, des passionnés. Une plateforme contributive était le bon geste — encore fallait-il la tenir dans un cadre public exigeant sur la sécurité, la souveraineté des données et la conformité.",
      problem:
        "Une contribution ouverte pose deux problèmes qu’on traite d’ordinaire trop tard. Le premier est humain : une validation a priori bloque tout et décourage les contributeurs, une publication libre expose l’institution. Le second est légal — collecter une contribution, c’est collecter une donnée personnelle et une cession de droits, et un correctif RGPD ajouté après coup se voit toujours.",
      approach: [
        "Partir de la recherche utilisateur : personas, cadrage fonctionnel, puis prototypage Figma en mobile d’abord — on contribue sur le terrain, pas au bureau.",
        "Choisir la modération différée : publication directe assortie d’un signalement, plutôt qu’une validation a priori qui aurait étouffé les contributions.",
        "Modéliser la base sur Supabase avec des politiques Row Level Security, plutôt que de filtrer côté application.",
        "Demander un consentement explicite à la cession de droits, et stocker une empreinte d’IP et d’user-agent comme preuve légale au lieu de l’adresse en clair.",
        "Ne stocker aucune donnée personnelle qui ne serve pas, et viser la conformité RGAA sur l’ensemble des parcours.",
        "Héberger en Europe par principe de souveraineté — Bunny.net pour le stockage et la diffusion.",
      ],
      result:
        "Une plateforme où la conformité n’est pas une couche ajoutée : elle a décidé du modèle de données et du parcours de contribution. C’est aussi le projet où j’ai eu à défendre des choix techniques devant une institution publique, ce qui relève autant de la posture que de la technique.",
      images: [],
    },

    /* -------------------------------------------------------------- capa */
    {
      id: "capa",
      shortTitle: "Bot audioguide CAPa",
      title: "Bot audioguide — écrire pour une voix qui n’existe pas",
      date: "2026",
      thumb: "",
      summary:
        "Un pipeline qui produit, à partir d’un sujet, un script narratif calibré pour la synthèse vocale et sa musique d’ambiance. Testé en conditions réelles à la Cité de l’Architecture et du Patrimoine.",
      role: "Conception du pipeline, prompt engineering, test terrain",
      client: "Cité de l’Architecture et du Patrimoine — lié à l’alternance et au mémoire",
      deliverables: [
        "Pipeline de génération de scripts",
        "Prompts de musique d’ambiance",
        "Chaîne de mixage automatisée",
        "Prototype testé au CAPa",
      ],
      context:
        "Mon mémoire avait établi que le coût de production est l’un des vrais freins à l’audioguide : écrire, faire valider, enregistrer et mixer un parcours mobilise une chaîne entière, et c’est ce qui décide si un contenu existe ou non. Restait à savoir si l’on pouvait déplacer ce coût sans sacrifier la qualité de médiation.",
      problem:
        "Une IA générique écrit pour être lue, pas pour être entendue : phrases longues, ponctuation décorative, aucune pause respiratoire. Et surtout, elle produit spontanément le modèle du déficit — un savoir descendu vers un public supposé ignorant — quand la médiation muséale contemporaine défend l’inverse, un modèle dialogique. Le problème n’était donc pas technique, il était de transposer un cadre théorique en règles opérationnelles.",
      approach: [
        "Traduire le cadre théorique de la médiation — modèles dialogique contre déficit, d’après Bensaude-Vincent et Jacobi — en contraintes d’écriture automatisables.",
        "Calibrer le texte pour la voix de synthèse : rythme, ponctuation, balises de pause inline propres à MiniMax TTS.",
        "Produire en parallèle un prompt de musique en anglais, borné à 15-25 mots et contraint « background-friendly », pour ElevenLabs Music.",
        "Choisir deux moteurs distincts plutôt qu’un outil tout-en-un, chacun sur ce qu’il fait le mieux.",
        "Mixer en post-production avec ffmpeg et pydub, en appliquant un ducking sur le canal vocal.",
        "Tester en conditions réelles au CAPa et itérer sur les retours.",
      ],
      result:
        "Un pont direct entre la partie recherche du mémoire et un prototype qui tourne : le cadre théorique n’est pas resté un chapitre, il est devenu une contrainte de génération. Le test terrain reste à l’échelle d’un prototype, pas d’un déploiement.",
      images: [],
    },

    /* -------------------------------------------------------- bookclub */
    {
      id: "thebookclub",
      shortTitle: "TheBookClub",
      title: "TheBookClub.cafe — un Letterboxd pour les livres",
      date: "2026",
      thumb: "",
      summary:
        "Bibliothèque personnelle, critiques, suivi de lecteurs. Une plateforme sociale complète menée seul, avec sa base construite livre par livre et son pipeline de diffusion auto-hébergé.",
      role: "Conception, développement et exploitation",
      client: "Projet personnel",
      deliverables: [
        "Plateforme Next.js en production",
        "Base relationnelle œuvres / éditions / critiques",
        "Pipeline de diffusion auto-hébergé",
        "Audits de sécurité successifs",
      ],
      context:
        "Il existe un Letterboxd pour les films et rien d’équivalent pour les livres : une bibliothèque personnelle, des notes, des critiques, et surtout des lecteurs qu’on suit parce qu’on aime ce qu’ils lisent. J’ai voulu construire cet objet-là, et l’opérer, pas seulement le maquetter.",
      problem:
        "Une plateforme de livres bute d’abord sur son catalogue. Importer une base entière donne des millions d’entrées mortes, des doublons et des métadonnées fausses ; ne rien importer laisse un service vide au premier utilisateur. Ma première idée — extraire les données depuis une URL Google Books — s’est révélée fragile dès qu’on sortait du cas nominal.",
      approach: [
        "Construire la base de façon organique : un livre absent entre dans le catalogue quand un lecteur le cherche et le renseigne.",
        "Trancher l’arbitrage saisie d’URL contre saisie d’ISBN en faveur de l’ISBN, pour son universalité et parce qu’il se valide seul.",
        "Modéliser proprement la relation œuvres / éditions / utilisateurs / critiques / listes, plutôt que d’aplatir un livre en une ligne.",
        "Auto-héberger le pipeline de diffusion — un bot de génération de contenu vers Postiz, sur un VPS suisse.",
        "Mener des audits de sécurité et de production datés, et écrire les scripts de nettoyage et de migration que la base réclamait.",
      ],
      result:
        "Une plateforme sociale complète en service — authentification, contenu utilisateur, modération, diffusion — construite et opérée seul. Le choix de l’ISBN contre ma propre première idée est celui dont je suis le plus content : il a rendu générique ce qui aurait été bricolé.",
      images: [],
      links: [{ href: "https://thebookclub.cafe", label: "Ouvrir TheBookClub" }],
    },
    /* ------------------------------------------------------------ wakey */
    {
      id: "wakey",
      shortTitle: "Wakey",
      title: "Wakey — une application d’actualité qui sait s’arrêter",
      date: "2024",
      thumb: imgWakeyScreens,
      summary:
        "Un agrégateur d’actualité par IA, mené seul de la première ligne de code jusqu’à la publication sur l’App Store. Ce qu’il fait de mieux, c’est ce qu’il ne montre pas.",
      role: "Conception, UX, développement, publication",
      client: "Projet personnel",
      deliverables: [
        "Application iOS publiée sur l’App Store",
        "Design system mobile complet",
        "Chaîne de collecte et de synthèse",
        "Abonnement Wakey+",
      ],
      context:
        "Wakey est mon projet le plus abouti. Je voulais apprendre à travailler avec les API d’IA, et je ne voulais pas l’apprendre sur un exercice : j’ai donc appris React, Git et GitHub en cours de route, et je suis allé jusqu’au bout — revue de l’App Store comprise.",
      problem:
        "Un agrégateur ne vaut que par ce qu’il retire, et c’est précisément ce qu’aucun ne fait : tous ajoutent un flux de plus. La difficulté n’était donc pas de collecter, mais de décider ce qu’on n’affiche pas — et de tenir cette décision écran après écran, quand la tentation d’ajouter « et aussi » revient à chaque fois.",
      approach: [
        "Fixer une dose plutôt qu’un flux : trois actualités par jour, deux centres d’intérêt, un résumé qui se termine. Quand la pile est vide, l’application le dit et s’arrête là.",
        "Tenir la même règle sur l’écran d’article — un contexte, une info, rien d’autre. Chaque écran ne fait qu’une chose.",
        "Construire un design system mobile dédié — composants, variantes, états — sans framework d’interface tiers.",
        "Faire porter l’abonnement Wakey+ sur du volume et non sur des fonctionnalités : six actualités au lieu de trois, autant de catégories que voulu, trois euros par mois — un freemium à niveaux d’accès différenciés, pas une démo bridée.",
        "Brancher l’API Perplexity pour la collecte et la synthèse, et Supabase pour la base, l’authentification et le chargement quotidien.",
        "Ajouter Stripe pour la vérification des statuts d’abonnement, développer en React mobile via Expo, et travailler dans Cursor.",
        "Aller jusqu’à la publication sur l’App Store, revue comprise.",
      ],
      result:
        "Le message « vous venez de finir » est une fonctionnalité, pas un message d’erreur. C’est la décision de conception dont je suis le plus content, et c’est aussi celle qui a été la plus difficile à tenir — mais c’est elle qui distingue Wakey d’un flux de plus.",
      images: [
        {
          value: imgWakeyScreens,
          caption:
            "Un article, la fin du résumé du jour, le profil. Le message « vous venez de finir » est une fonctionnalité, pas un message d’erreur.",
        },
        {
          value: imgWakeyStack,
          caption: "La chaîne complète, de la collecte au téléchargement.",
        },
      ],
    },

    /* ---------------------------------------------------------- artsing */
    {
      id: "artsing",
      shortTitle: "ArtSing",
      title: "ArtSing — faire chanter des tableaux",
      date: "2023",
      thumb: imgArtsingSite,
      summary:
        "Trois tableaux animés par IA qui chantent, et un karaoké pour reprendre avec eux. Un projet de 2023, entièrement réécrit deux ans plus tard, remis en ligne aujourd’hui.",
      role: "Concept, identité, développement",
      client: "Projet personnel",
      deliverables: [
        "Trois pages de morceau",
        "Karaoké synchronisé à la main",
        "Identité et interface",
        "Remise en ligne 2025",
      ],
      context:
        "En 2023, la génération de vidéo par IA sortait tout juste des laboratoires et tout le monde cherchait à quoi ça pouvait bien servir. J’ai voulu m’en servir pour quelque chose de bête et de joyeux : faire chanter des tableaux. Trois toiles, trois morceaux — l’autoportrait de Van Gogh sur Tainted Love, la Joconde sur Sunny, le portrait de Chopin sur Un peu de haine. Le titre dit le programme : « the art of singing together ».",
      problem:
        "Le tableau ouvre la bouche, les paroles défilent, et à ce moment-là le visiteur a le choix — regarder, ou chanter avec. Rien ne doit l’y obliger, sinon l’effet tombe. La première version, elle, en faisait trop : un curseur remplacé par une traînée, deux spectres qui écoutaient le micro. L’idée était bonne, l’exécution beaucoup moins — les paroles se décalaient, et la moitié des pages ne tenait pas la route.",
      approach: [
        "Porter le contraste entre le peintre et la chanson par la typographie plutôt que par un décor : rose poudré et orange brûlé, Instrument Serif en italique pour les noms propres, Inter pour le reste.",
        "Aligner les trois toiles comme des pochettes de disque sur l’accueil, avec un léger basculement en 3D qui suit la souris — juste assez pour donner envie de cliquer.",
        "Réduire une page de morceau à quatre choses : la toile qui chante, la phrase en cours, la suivante en dessous plus pâle, une barre qui avance. Un bouton play, un bouton mute.",
        "Écrire les timecodes du karaoké à la main, morceau par morceau — c’est artisanal, et c’est ce qui fait que ça tombe juste.",
        "Développer en HTML, CSS et JavaScript à la main, sans framework ni étape de build, avec p5.js pour le fond animé de l’accueil.",
        "Réécrire le tout en 2025 en enlevant tout sauf l’essentiel, puis remettre le projet en ligne : bibliothèque p5 embarquée plutôt que servie par un CDN, chemin d’image corrigé, media queries ajoutées.",
      ],
      result:
        "La version en ligne aujourd’hui est celle de 2025. Le code dormait dans un dossier depuis deux ans ; je n’ai corrigé que ce qui l’empêchait d’être consultable, le reste est tel quel. Les toiles ont été animées par des modèles vidéo, le code écrit avec ChatGPT et Cursor pour compagnons.",
      images: [
        { value: imgArtsingSite, caption: "La page Chopin, telle qu’elle est en ligne aujourd’hui." },
        {
          value: imgArtsingStack,
          caption:
            "La chaîne de production : des IA pour donner vie aux tableaux, Cursor pour le code, O2switch pour l’hébergement.",
        },
      ],
      links: [{ href: "/artsing/", label: "Ouvrir ArtSing" }],
    },

    /* ---------------------------------------------------------- elapsio */
    {
      id: "elapsio",
      shortTitle: "Elapsio",
      title: "Elapsio — l’identité et les packagings d’une marque de randonnée",
      date: "2024",
      thumb: imgElapsioLogo,
      summary:
        "Une marque de kits alimentaires pour la randonnée, du logotype aux sachets. Un même système devait tenir sur une bannière et sur dix centimètres de packaging.",
      role: "Identité, direction artistique, packaging",
      client: "Mission freelance",
      deliverables: ["Logotype et déclinaisons", "Gamme de packagings", "Règles d’application"],
      context:
        "Elapsio conçoit des kits alimentaires pour la randonnée. Je les ai accompagnés depuis la création de l’identité jusqu’à ses déclinaisons, packagings compris.",
      problem:
        "La marque devait tenir dans deux mondes qui ne se ressemblent pas : le rayon d’un magasin, où elle est comparée à dix autres, et le fond d’un sac à dos, où elle est seule et froissée. S’ajoute une contrainte de fabrication qui décide de tout — broderie, tampon, sérigraphie sur sachet : rien ne passe en dégradé.",
      approach: [
        "Chercher une marque chaleureuse et lisible, réductible à une seule forme.",
        "Dessiner un symbole qui se lit comme une coquille de pèlerin autant que comme un sommet, avec des rayons qui redescendent — la marche et ce qu’on regarde en marchant.",
        "Le tenir en aplat monochrome, puisque c’était la vraie contrainte.",
        "Sur le sachet, assumer une hiérarchie brutale : le nom de la recette d’abord, tout le reste ensuite.",
        "Partir du terrain pour la palette plutôt que de la marque : les verts de la forêt, l’orange d’un soleil bas.",
      ],
      result:
        "Un système qui passe de la bannière au sachet sans se déliter, et qui survit aux procédés d’impression les plus pauvres. Le format ne pardonne rien — dix centimètres de haut, une main gantée, une lumière de fin de journée — et c’est là qu’il est jugé.",
      images: [
        {
          value: imgElapsioLogo,
          caption: "Le logotype en aplat : une coquille, un sommet, et des rayons qui redescendent.",
        },
        {
          value: imgElapsioPack,
          caption:
            "Un sachet Essentielle Boost à l’étape, entre le réchaud et les chaussures. Le seul test qui compte.",
        },
      ],
    },

    /* ------------------------------------------------------------ c2rmf */
    {
      id: "c2rmf",
      shortTitle: "C2RMF & Inrap",
      title: "C2RMF puis Inrap — piloter des sites d’institution",
      date: "2022 — 2024",
      thumb: imgC2RMF,
      summary:
        "Trois ans d’alternance dans deux institutions culturelles publiques, à faire vivre des sites, à piloter des refontes et à négocier avec des prestataires. Trafic doublé en deux ans.",
      role: "Chargé de projet web et éditorial",
      client: "Alternance — C2RMF (Ministère de la Culture), puis Inrap",
      deliverables: [
        "Pilotage éditorial et technique",
        "Refonte d’arborescence",
        "Suivi de deux refontes à l’Inrap",
        "Ateliers CMS avec le prestataire",
      ],
      context:
        "Le Centre de Recherche et de Restauration des Musées de France produit un savoir considérable et le publie peu. À l’Institut national de recherches en archéologie préventive ensuite, le poste bascule vers le pilotage : deux refontes menées en parallèle, la direction d’un côté, le prestataire de l’autre.",
      problem:
        "Dans une institution, un site souffre rarement d’un problème technique : il souffre d’un problème de production. La matière existe, dispersée dans les départements, mais rien ne la fait remonter — et la chaîne de validation est plus longue que l’écriture elle-même. Mon travail a donc moins consisté à écrire qu’à débloquer.",
      approach: [
        "Aller chercher la matière département par département, et raccourcir la chaîne de validation.",
        "Revoir le processus de création de contenus avec chaque département, pour augmenter la fréquence de publication.",
        "Analyser le trafic et le comportement des utilisateurs, puis refondre l’arborescence sur cette base.",
        "Optimiser le référencement et l’accessibilité des pages.",
        "Mener les ateliers d’amélioration du CMS Drupal avec l’institution et le prestataire.",
        "À l’Inrap : suivre la refonte du site portail puis de l’iconothèque — conseil à la direction, ateliers, back-office.",
        "À l’Inrap : piloter la participation de l’institution au bicentenaire de la photographie.",
      ],
      result:
        "Le trafic web a plus que doublé en deux ans, sans campagne d’acquisition : uniquement par la remise en ordre de l’arborescence, du référencement et du rythme de publication. Le site a cessé d’être un goulot d’étranglement.",
      figures: [{ value: "+100 %", label: "de trafic web en deux ans" }],
      images: [{ value: imgC2RMF, caption: "Le site vitrine du centre." }],
    },

    /* -------------------------------------------------------------- lkl */
    {
      id: "lkl",
      shortTitle: "LKL",
      title: "LKL — l’identité d’une ligue esport amateur",
      date: "2023",
      thumb: imgLKL,
      summary:
        "Une marque qui doit claquer en stream et rester déclinable par des bénévoles, sans direction artistique derrière eux pour rattraper les écarts.",
      role: "Identité, direction artistique",
      client: "LKL — ligue esport amateur",
      deliverables: ["Logotype", "Déclinaisons de diffusion", "Gabarits réutilisables"],
      context:
        "LKL est une ligue esport amateur. Le vrai commanditaire n’est pas une équipe marketing : ce sont des bénévoles qui vont produire eux-mêmes leurs visuels de match, chaque semaine, avec les outils qu’ils ont sous la main.",
      problem:
        "Deux contraintes se répondent. Une image de stream est compressée, redimensionnée, incrustée sur un fond de jeu : ce qui est fin disparaît. Et une charte de quarante pages n’aurait servi à personne — un système trop délicat se dégrade dès la première déclinaison faite sans moi.",
      approach: [
        "Réduire la marque à trois éléments : une forme, un mot, un fond.",
        "Dessiner une étoile éclatée qui fonctionne comme un impact, un lettrage massif et sans détail, et pousser le contraste au maximum.",
        "Ajouter du grain sur l’aplat, qui sans lui se serait délité en bandes à la compression.",
        "Livrer des gabarits plutôt que des fichiers, pour que les bénévoles déclinent sans se tromper.",
      ],
      result:
        "Une identité que la ligue produit elle-même, semaine après semaine, sans que le système ne se délite. Ce qui est plein survit à la diffusion — c’est une réponse à la contrainte technique autant qu’un choix esthétique.",
      images: [{ value: imgLKL, caption: "Le lockup principal sur son aplat grainé." }],
    },
  ],

  likes: [
    // Littérature
    { id: "notre-dame", title: "Notre-Dame de Paris", author: "Victor Hugo", date: "1831", kind: "littérature", link: "https://www.amazon.fr/NOTRE-DAME-PARIS-VERSION-ABREGEE-Victor/dp/2070663892", image: imgNotreDame, ratio: "2 / 3" },
    { id: "piliers", title: "Les piliers de la terre", author: "Ken Follett", date: "1989", kind: "littérature", link: "https://www.amazon.fr/Piliers-Terre-Ken-Follett/dp/2253059536", image: imgPiliers, ratio: "2 / 3" },
    { id: "sorceleur", title: "Le sorceleur", author: "Andrzej Sapkowski", date: "1993", kind: "littérature", link: "https://www.amazon.fr/Sorceleur-Livre-dernier-livre-providence/dp/2298151911", image: imgSorceleur, ratio: "2 / 3" },
    { id: "bel-ami", title: "Bel-Ami", author: "Guy de Maupassant", date: "1885", kind: "littérature", link: "https://www.amazon.fr/Bel-Ami-Guy-Maupassant/dp/207040935X", image: imgBelAmi, ratio: "2 / 3" },
    { id: "moonfleet", title: "Moonfleet", author: "John Meade Falkner", date: "1898", kind: "littérature", link: "https://www.amazon.fr/Moonfleet-John-Meade-Falkner/dp/2369147334", image: imgMoonfleet, ratio: "2 / 3" },
    { id: "seigneur", title: "Le seigneur des anneaux", author: "J. R. R. Tolkien", date: "1954", kind: "littérature", link: "https://www.amazon.fr/Seigneur-Anneaux-%C3%A9dition-illustr%C3%A9e-Fraternit%C3%A9/dp/226705485X", image: imgSeigneur, ratio: "2 / 3" },

    // Bande dessinée / manga
    { id: "one-piece", title: "One Piece", author: "Eiichiro Oda", date: "1997", kind: "bd / manga", link: "https://www.amazon.fr/One-Piece-originale-Eiichiro-Oda/dp/2344065660", image: imgOnePiece, ratio: "2 / 3" },
    { id: "revolution", title: "Révolution", author: "Florent Grouazel", date: "2019", kind: "bd / manga", link: "https://www.amazon.fr/R%C3%A9volution-1-Libert%C3%A9-Florent-Grouazel/dp/233011737X", image: imgRevolution, ratio: "2 / 3" },
    { id: "asterix", title: "Astérix le Gaulois", author: "René Goscinny", date: "1961", kind: "bd / manga", link: "https://www.amazon.fr/Ast%C3%A9rix-gaulois-n%C2%B01-Ren%C3%A9-Goscinny/dp/201210133X", image: imgAsterix, ratio: "2 / 3" },
    { id: "kingdom", title: "Kingdom", author: "Yasuhisa Hara", date: "2006", kind: "bd / manga", link: "https://www.amazon.fr/Kingdom-1-Fran%C3%A7ais-Yasuhisa-Hara/dp/2368778055", image: imgKingdom, ratio: "2 / 3" },
    { id: "maitres-orge", title: "Les maîtres de l’orge", author: "Jean Van Hamme", date: "1992", kind: "bd / manga", link: "https://www.amazon.fr/Ma%C3%AEtres-lorge-01-Charles-1854/dp/234400453X", image: imgMaitres, ratio: "2 / 3" },
    { id: "horde", title: "La horde du contrevent", author: "Alain Damasio", date: "2004", kind: "bd / manga", link: "https://www.amazon.fr/Horde-Contrevent-T01-cosmos-campement/dp/2756067261", image: imgHorde, ratio: "2 / 3" },

    // Cinéma
    { id: "la-la-land", title: "La La Land", author: "Damien Chazelle", date: "2016", kind: "cinéma", link: "https://letterboxd.com/film/la-la-land/", image: imgLaLaLand, ratio: "2 / 3" },
    { id: "porco-rosso", title: "Porco Rosso", author: "Hayao Miyazaki", date: "1992", kind: "cinéma", link: "https://letterboxd.com/film/porco-rosso/", image: imgPorco, ratio: "2 / 3" },
    { id: "babylon", title: "Babylon", author: "Damien Chazelle", date: "2022", kind: "cinéma", link: "https://letterboxd.com/film/babylon-2022/", image: imgBabylon, ratio: "2 / 3" },
    { id: "cowboy-bebop", title: "Cowboy Bebop", author: "Shinichirō Watanabe", date: "1998", kind: "cinéma", link: "https://letterboxd.com/film/cowboy-bebop/", image: imgCowboy, ratio: "2 / 3" },
    { id: "budapest", title: "The Grand Budapest Hotel", author: "Wes Anderson", date: "2014", kind: "cinéma", link: "https://letterboxd.com/film/the-grand-budapest-hotel/", image: imgBudapest, ratio: "2 / 3" },
    { id: "pulp-fiction", title: "Pulp Fiction", author: "Quentin Tarantino", date: "1994", kind: "cinéma", link: "https://letterboxd.com/film/pulp-fiction/", image: imgPulp, ratio: "2 / 3" },

    // Musique
    { id: "soleil-pluvieux", title: "Soleil Pluvieux", author: "Yvnnis", date: "2023", kind: "musique", link: "https://link.deezer.com/s/31QSjEd1nchhywfUDzaFs", image: imgSoleilPluvieux, ratio: "1 / 1" },
    { id: "all-of-the-lights", title: "All of the Lights", author: "Kanye West", date: "2010", kind: "musique", link: "https://link.deezer.com/s/31QSiQiC1lKD0bJ5E6chJ", image: imgAllLights, ratio: "1 / 1" },
    { id: "i-will-survive", title: "I Will Survive", author: "Gloria Gaynor", date: "1978", kind: "musique", link: "https://link.deezer.com/s/31QSht5ukDwlikFrkyfzM", image: imgIWillSurvive, ratio: "1 / 1" },
    { id: "20000", title: "20.000", author: "EDGE feat. Alpha Wann", date: "2022", kind: "musique", link: "https://link.deezer.com/s/31QSg1lIgwIwnzT0IYsN7", image: img20000, ratio: "1 / 1" },
    { id: "wake-me-up", title: "Wake Me Up", author: "The Weeknd", date: "2025", kind: "musique", link: "https://link.deezer.com/s/31QSgqKH6R2X4fnAPKnY4", image: imgWakeMeUp, ratio: "1 / 1" },
    { id: "pair-of-wings", title: "Pair of Wings", author: "Frankie Rose", date: "2012", kind: "musique", link: "https://link.deezer.com/s/31QSitu594i1usLuHCw2F", image: imgPairWings, ratio: "1 / 1" },
    { id: "histoire-etrange", title: "Une histoire étrange", author: "Laylow", date: "2021", kind: "musique", link: "https://link.deezer.com/s/31QSf0hoEcltTt0SN8vCS", image: imgHistoireEtrange, ratio: "1 / 1" },
    { id: "soleil-de-ma-vie", title: "Soleil de ma vie", author: "Zamdane", date: "2022", kind: "musique", link: "https://link.deezer.com/s/31QSenS9oQVE1er3ZUjCT", image: imgSoleilVie, ratio: "1 / 1" },
  ],
};
