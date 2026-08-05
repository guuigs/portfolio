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
  (`-0.045em` sur le hero).
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
│   ├── store.tsx            Contexte CMS + persistance localStorage
│   ├── router.ts            Routing History API (sans dépendance)
│   └── view-transition.ts   Wrapper document.startViewTransition
└── components/
    ├── ui/                  Button, IconButton, Chip, Lightbox
    ├── layout/              Header, Footer, SectionNav, Wordmark
    ├── sections/            Accueil, Competences, CasEtudes, CoupsDeCoeur
    └── cms/                 Editable (inline), AdminDrawer
```

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
- **Le panneau latéral** — profil, réseaux, compétences, cas d’études et
  coups de cœur, avec suppression en deux temps et export JSON.

Le contenu est sauvegardé dans `localStorage` (clé
`guilhem-portfolio-content-v2`). C’est donc **local à un navigateur** : les
modifications ne sont pas publiées en ligne. Pour figer un changement dans le
site, exporter le JSON et reporter les valeurs dans `src/lib/content.ts`.

## Déploiement

`.github/workflows/deploy.yml` construit et envoie `./build` en FTP chez OVH à
chaque push sur `main`. Voir `DEPLOIEMENT.md` pour la procédure manuelle et
`IMAGES-GUIDE.md` pour l’ajout d’images.
