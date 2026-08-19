# Portfolio — Guilhem Terrier

Site personnel : une seule page qui se décline en quatre sections (Accueil,
Compétences, Cas d’études, Coups de cœur), avec un CMS local accessible au
clavier.

## Lancer le projet

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # génère ./build
npm run typecheck  # tsc --noEmit
```

## Direction artistique

L’UI suit les [Web Interface Guidelines de Vercel](https://github.com/vercel-labs/web-interface-guidelines)
et les [agent-skills](https://github.com/vercel-labs/agent-skills) associées.
En pratique :

- **Quasi-monochrome.** Une rampe de gris très légèrement chaude (teinte ~40°)
  du blanc papier `#fcfcfb` au noir `#1a1917`. Le bleu `#1823ee` — celui du
  logo — est la seule couleur chromatique, et reste rare.
- **Geist / Geist Mono** partout, sans serif. Titres très resserrés
  (`-0.045em` sur le hero). Les deux faces sont volontairement croisées par
  rapport à l’usage attendu : le chapô d’accueil est en mono, tandis que les
  libellés `STACK TECHNIQUE` / `CAS D’ÉTUDES` sont en sans (`.overline-sans`).
- **Chrome pleine largeur.** Header, footer et carrousel des cas d’études vont
  bord à bord ; le texte courant garde une mesure lisible via des conteneurs
  centrés (`max-w-3xl` / `max-w-5xl`).
- **La bordure fait le travail**, pas l’ombre : hairlines 1px, rayons 6/8/12px,
  ombres quasi nulles et toujours en deux couches (ambiante + directe).
- **Motion sobre.** Uniquement `transform` et `opacity`, 150–400 ms. Aucune
  propriété de layout n’est animée.

Tous les tokens sont dans `src/index.css`, sous `@theme`. Chaque niveau de
texte (`fg`, `fg-muted`, `fg-faint`) dépasse 4,5:1 sur les deux fonds ;
`gray-400` est décoratif et ne doit jamais porter de texte.

## Architecture

```
src/
├── App.tsx                  Shell : hero persistant, routing, mode admin
├── index.css                Tokens @theme, base, recettes View Transitions
├── lib/
│   ├── content.ts           Modèle de contenu + données réelles
│   ├── store.tsx            Contexte CMS, brouillon local + publication
│   ├── supabase.ts          Client, lecture/publication, upload d’images
│   ├── router.ts            Routing History API (sans dépendance)
│   └── view-transition.ts   Wrapper document.startViewTransition
└── components/
    ├── ui/                  Button, IconButton, Chip, Lightbox, RichText, Signature
    ├── layout/              Header, Footer, SectionNav, Wordmark
    ├── sections/            Accueil, Competences, CasEtudes, CoupsDeCoeur
    ├── effects/             CursorTrail, AsciiField, AsciiStage → AsciiPlanet
    └── cms/                 Editable (inline), AdminDrawer
```

### Effets

- **`CursorTrail`** — traînée de carrés bleus sur un canvas plein écran en
  `pointer-events: none`. Coupée sous `prefers-reduced-motion` et hors
  `(pointer: fine)`, où elle n’a pas de sens.
- **`AsciiPlanet`** — un globe qui tourne, rendu en caractères par
  `AsciiEffect` de three.js, glyphes blancs sur le bleu d’accent dans un
  carré 1:1. La carte terre/mer est générée procéduralement (bruit de valeur
  sur trois octaves, trame qui boucle en x pour qu’il n’y ait pas de couture) :
  une vraie texture terrestre pèserait des centaines de kilo-octets pour
  quelque chose que la conversion ASCII réduit à une dizaine de niveaux.
  Trois pièges à connaître si vous y touchez :
  - la scène **doit** avoir un fond noir opaque. `AsciiEffect` force
    `brightness = 1` là où `alpha === 0`, donc un renderer en `alpha: true`
    peint tout le cadre avec le caractère le plus dense.
  - l’éclairage est surtout ambiant. Une lumière directionnelle forte écrase
    le contraste terre/mer et ne laisse qu’une boule ombrée.
  - l’océan n’est jamais totalement noir, sinon le disque se dissout au limbe
    partout où l’eau touche le bord et la sphère cesse de se lire.
  - ne pas remplacer la `font-family` inline de l’effet : son crénage est
    calibré sur `courier new` et la grille se désaligne sinon.

  Le tout est chargé en `lazy` derrière un `IntersectionObserver`, donc three
  (~130 ko gzip) n’entre pas dans le bundle initial, et retombe sur un glyphe
  statique si WebGL est indisponible.

## Publication du contenu

Par défaut le CMS écrit dans `localStorage` : c’est un **brouillon local**, il
ne quitte pas le navigateur. Renseignez `.env.local` à partir de
`.env.example` pour brancher Supabase et publier pour de vrai.

1. Créez un projet Supabase, puis exécutez `supabase/schema.sql` dans le SQL
   Editor. Il crée la table `site_content`, le bucket `media`, et les
   politiques RLS.
2. Dans Authentication, créez l’utilisateur admin et **désactivez les
   inscriptions publiques**.
3. Copiez l’URL du projet et la clé `anon` dans `.env.local`.

La clé `anon` finit dans le bundle, et c’est voulu : elle n’ouvre que la
lecture. Toute écriture est refusée par la politique RLS tant que la requête
ne porte pas la session de l’adresse admin. Ne jamais exposer `service_role`,
qui contourne toutes les politiques.

Dans le panneau, `publier` pousse le document vers Supabase et met le site à
jour pour tout le monde, sans redéploiement. `annuler le brouillon` revient à
la dernière version publiée.

### Images

Les images téléversées depuis le CMS vont dans le bucket `media` et reçoivent
une URL publique **stable**. Celles qui viennent encore de `src/assets` sont
servies par Vite avec un hash dans le nom, qui change à chaque build : une URL
de ce type stockée en base casserait au déploiement suivant. Le groupe
« Hébergement des images » du panneau les déplace vers Supabase en un clic.

### Cas d’études

Chaque article suit la même arborescence, et c’est une propriété du type plutôt
qu’une discipline de rédaction :

```
en-tête     titre · année · résumé · fiche (rôle, contexte, période, livrables)
récit       le contexte → le problème → l’approche → le résultat
chiffres    optionnel, uniquement s’il y a une mesure réelle
galerie     images légendées, zoomables, ratio propre à chacune
liens       optionnels
```

Le modèle précédent était un `Block[]` avec des titres libres. Chaque article y
inventait sa forme, et l’a fait : six à seize blocs, et six jeux de titres
différents sur six cas — « Sous le capot », « Le parti pris », « Au C2RMF »…
Aucun recoupement. Des champs nommés rendent la dérive impossible : on ne peut
plus publier un cas sans énoncer son problème, ni en changer l’ordre.

Ce qui a été conservé de la version en blocs : le résumé, la fiche, le zoom
plein écran sur les images, et le `ratio` déclaré par image — sans lui, une
planche de maquettes est recadrée en 4/3 et ses écrans deviennent illisibles.

`CONTENT_VERSION` protège le contrat : la forme ayant changé, elle passe à 3 et
le contenu déjà publié est ignoré au profit de ce fichier. Le panneau le
signale et propose de republier.

### Routing

Vraies URLs — `/`, `/competences`, `/cas-etudes`, `/coups-de-coeur` — avec
état profond : `?projet=wakey`, `?item=porco-rosso`. Les liens sont de vrais
`<a>`, donc Cmd/Ctrl+clic ouvre un onglet normalement.

`public/.htaccess` renvoie toute route inconnue vers `index.html` : sans lui,
un rafraîchissement sur `/competences` renverrait un 404 côté Apache.

### Transitions

`document.startViewTransition` piloté depuis `src/lib/view-transition.ts`.
Le composant React `<ViewTransition>` n’existe qu’en canary ; on reste donc
sur React stable et on nomme les groupes en CSS. Les navigateurs sans l’API,
et les utilisateurs en `prefers-reduced-motion`, obtiennent la mise à jour
instantanée.

## Le CMS (Ctrl/⌘ + A)

`Ctrl/⌘ + A` bascule le mode admin (le raccourci est ignoré quand le curseur
est dans un champ de saisie, pour ne pas voler le « tout sélectionner »).

Deux façons d’éditer, utilisables en même temps :

- **En ligne** — les textes de la page deviennent modifiables sur place.
- **Le panneau latéral** — **cloisonné par section** : il n’affiche que les
  champs de la section affichée, pas tout le contenu du site. L’en-tête et le
  pied de page sont rattachés à l’Accueil ; les coups de cœur sont filtrables
  par recherche.

### Ordonner et replier

Les trois collections — compétences, cas d’études, coups de cœur — sont des
listes de lignes repliées : un titre, un sous-titre, un numéro d’ordre, et le
formulaire complet en dessous une fois dépliée. « tout replier » / « tout
déplier » basculent d’un coup, ce qui rend les 26 coups de cœur parcourables.

La poignée à gauche fixe l’ordre de priorité, celui du rendu : ordre du menu
des compétences, du carrousel, de la maçonnerie. On la glisse, ou — parce que
le glisser-déposer seul exclut ceux qui ne peuvent pas maintenir un pointeur
(WCAG 2.5.7) — **on la focalise et on presse ↑/↓**. La liste défile toute
seule quand on approche des bords du panneau, sinon un déplacement se
limiterait à ce qui tient à l’écran.

Un point de conception : **une liste filtrée ne se réordonne pas.** Les lignes
affichées sont alors un sous-ensemble, et déposer l’une « sur » l’autre ne dit
rien de leurs positions réelles dans le tableau. La poignée est donc grisée
tant que la recherche des coups de cœur est remplie, avec la raison affichée.

Dans les blocs de texte et le paragraphe du pied de page, les liens s’écrivent
`[texte affiché](https://url)` et sont rendus par `RichText`.

Les modifications vont d’abord dans `localStorage` (clé
`guilhem-portfolio-content-v2`) : c’est un brouillon, local à un navigateur.
Voir « Publication du contenu » plus haut pour les envoyer en ligne. Sans
Supabase configuré, la seule voie reste l’export JSON à reporter dans
`src/lib/content.ts`.

## Déploiement

`.github/workflows/deploy.yml` construit et envoie `./build` en FTP chez OVH à
chaque push sur `main`. Voir `DEPLOIEMENT.md` pour la procédure manuelle et
`IMAGES-GUIDE.md` pour l’ajout d’images.
