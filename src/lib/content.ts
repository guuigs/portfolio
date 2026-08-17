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
export const CONTENT_VERSION = 2;

/** A heading, a paragraph, a bullet list, an image, or a standalone link. */
export type Block =
  | { type: "heading"; value: string }
  | { type: "text"; value: string }
  | { type: "list"; intro?: string; items: string[] }
  | {
      type: "image";
      value: string;
      caption?: string;
      /** CSS aspect-ratio for the frame. Defaults to the 4/3 house format. */
      ratio?: string;
    }
  | { type: "link"; href: string; label: string };

export interface CaseStudy {
  id: string;
  title: string;
  /** Short label for carousel thumbnails and skill rails. */
  shortTitle: string;
  date: string;
  /** Standfirst printed under the title, before the article proper. */
  summary?: string;
  /** Facts listed in the article header — rôle, contexte, livrables… */
  meta?: { label: string; value: string }[];
  thumb: string;
  blocks: Block[];
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  stack: string[];
  /** CaseStudy ids surfaced in this skill's rail. */
  cases: string[];
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
}

export interface Profile {
  name: string;
  role: string;
  heroTitle: string;
  heroIntro: string;
  heroImage: string;
  footerName: string;
  footerLine: string;
  /** The paragraph under the footer heading. Supports [texte](url) links. */
  footerBody: string;
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
      id: "design",
      title: "Design graphique",
      description:
        "J’ai forgé mon expérience du design graphique à travers de multiples facettes de ma vie professionnelle : veille personnelle, freelance, projets annexes. Un visuel doit être pensé avant tout par le message qu’il porte et par la personne à qui il s’adresse — la compréhension de l’autre et l’empathie sont clés.",
      stack: [
        "Figma",
        "Illustrator",
        "Photoshop",
        "InDesign",
        "Branding",
        "Typographie",
        "Direction artistique",
        "Packaging",
      ],
      cases: ["elapsio", "lkl", "artsing"],
    },
    {
      id: "ux",
      title: "Expérience utilisateur",
      description:
        "Mes études et mes expériences professionnelles m’ont montré à quel point l’étude du comportement de l’utilisateur est cruciale au succès d’un produit — et à quel point, paradoxalement, elle est peu pratiquée. Je m’efforce donc de toujours partir de l’usage : tests, interviews, études.",
      stack: [
        "Recherche utilisateur",
        "Entretiens semi-directifs",
        "Questionnaires",
        "Analyse de corpus",
        "Wireframes",
        "Prototypage",
        "Tests utilisateurs",
        "Accessibilité",
      ],
      cases: ["memoire", "wakey"],
    },
    {
      id: "web",
      title: "Développement web",
      description:
        "Mes études et mes projets m’ont vite montré la nécessité de comprendre les bases du code et le fonctionnement de nos systèmes numériques. Profitant d’un trou dans mon calendrier avant mon départ en Erasmus, je me suis mis au front — et je ne me suis plus arrêté.",
      stack: [
        "React",
        "TypeScript",
        "Expo",
        "Supabase",
        "Perplexity API",
        "Stripe",
        "HTML",
        "CSS",
        "p5.js",
        "Git",
        "Cursor",
      ],
      cases: ["wakey", "artsing"],
    },
    {
      id: "project",
      title: "Gestion de projets",
      description:
        "J’ai développé cette compétence au cours de mes trois années d’alternance, au Centre de Recherche et de Restauration des Musées de France (C2RMF) puis à l’Institut national de recherches en archéologie préventive (Inrap).",
      stack: [
        "Pilotage prestataires",
        "Ateliers",
        "Drupal",
        "SEO",
        "Analytics",
        "Rédaction éditoriale",
        "Accessibilité",
      ],
      cases: ["c2rmf"],
    },
  ],

  cases: [
    /* ------------------------------------------------------------ wakey */
    {
      id: "wakey",
      shortTitle: "Wakey",
      title: "Wakey — une application d’actualité qui sait s’arrêter",
      date: "2024",
      summary:
        "Un agrégateur d’actualité par IA, mené seul de la première ligne de code jusqu’à la publication sur l’App Store. Ce qu’il fait de mieux, c’est ce qu’il ne montre pas.",
      meta: [
        { label: "rôle", value: "Conception, UX, développement, publication" },
        { label: "contexte", value: "Projet personnel" },
        { label: "stack", value: "Expo · Supabase · Perplexity · Stripe" },
      ],
      thumb: imgWakeyScreens,
      blocks: [
        { type: "heading", value: "Pourquoi je l’ai fait" },
        {
          type: "text",
          value:
            "Wakey est mon projet le plus abouti. Je voulais apprendre à travailler avec les API d’IA, et je ne voulais pas l’apprendre sur un exercice : j’ai donc appris React, Git et GitHub en cours de route, et je suis allé jusqu’au bout — revue de l’App Store comprise.",
        },

        { type: "heading", value: "Le parti pris" },
        {
          type: "text",
          value:
            "Wakey est un agrégateur, et un agrégateur ne vaut que par ce qu’il retire. Trois actualités par jour, deux centres d’intérêt, un résumé qui se termine. Quand la pile est vide, l’application vous le dit et s’arrête là — pas de flux infini, pas de « et aussi ». C’est la décision de conception dont je suis le plus content, et c’est aussi celle qui a été la plus difficile à tenir.",
        },
        {
          type: "text",
          value:
            "Le même raisonnement tient l’écran d’article : un contexte, une info, rien d’autre. Chaque écran ne fait qu’une chose, et l’abonnement Wakey+ ne débloque pas des fonctionnalités mais du volume — six actualités au lieu de trois, autant de catégories que voulu, pour trois euros par mois.",
        },
        {
          type: "image",
          value: imgWakeyScreens,
          caption:
            "Un article, la fin du résumé du jour, le profil. Le message « vous venez de finir » est une fonctionnalité, pas un message d’erreur.",
        },

        { type: "heading", value: "La chaîne technique" },
        {
          type: "list",
          intro: "Six briques, chacune sur un seul rôle :",
          items: [
            "Perplexity API — la collecte et la synthèse des actualités.",
            "Supabase — la base de données, l’authentification, et le chargement quotidien des contenus.",
            "Stripe — la vérification des statuts d’abonnement Wakey+.",
            "Expo — React en mobile, et le déploiement.",
            "Cursor — l’environnement de développement.",
            "App Store — la publication sur iOS.",
          ],
        },
        {
          type: "image",
          value: imgWakeyStack,
          caption: "La chaîne complète, de la collecte au téléchargement.",
        },
      ],
    },

    /* ---------------------------------------------------------- mémoire */
    {
      id: "memoire",
      shortTitle: "Mémoire M2",
      title: "Mémoire — pourquoi les audioguides sur smartphone ne prennent pas",
      date: "2024 — 2026",
      summary:
        "117 pages, huit entretiens, 70 répondants, six audioguides analysés et un prototype testé en salle. Je cherchais un problème de design ; le terrain m’a répondu autre chose.",
      meta: [
        { label: "rôle", value: "Recherche, terrain, prototype" },
        {
          label: "contexte",
          value: "Master Design d’Interface Multimédia et Internet, Université Sorbonne Paris Nord",
        },
        { label: "direction", value: "Benoît Berthou" },
      ],
      thumb: imgMemoireThumb,
      blocks: [
        { type: "heading", value: "Le paradoxe de départ" },
        {
          type: "text",
          value:
            "En dix ans, le nombre d’applications muséales a doublé en France : 398 en 2015, 530 en 2021. Pendant ce temps, l’audioguide dédié reste utilisé par 75 % des visiteurs quand l’application sur smartphone personnel plafonne autour de 50 % (baromètre Gece, 2025). On produit de plus en plus d’un outil de moins en moins utilisé. Entre la promesse d’une médiation accessible et la réalité d’un outil marginalement adopté, qu’est-ce qui empêche l’audioguide mobile de tenir son rôle ?",
        },

        { type: "heading", value: "La méthode" },
        {
          type: "list",
          intro:
            "Cinq hypothèses — conception, économique, organisationnelle, contextuelle, et le support lui-même — mises à l’épreuve d’un dispositif qualitatif :",
          items: [
            "Huit entretiens semi-directifs, côté visiteurs et côté professionnels de musée.",
            "Un questionnaire, 70 répondants.",
            "Un corpus de six audioguides analysés selon une grille commune.",
            "Un prototype testé auprès de cinq visiteurs à la Cité de l’Architecture et du Patrimoine.",
          ],
        },

        { type: "heading", value: "Le prototype : une application qui ne fait presque rien" },
        {
          type: "text",
          value:
            "L’analyse du corpus avait montré que la quasi-totalité des interfaces d’audioguide force le regard vers l’écran — cartes, menus, listes de parcours — au détriment de ce que le visiteur est venu voir. Le regard est la ressource rare dans un musée. J’ai donc conçu l’inverse : un déclenchement simple, un contenu audio au centre, l’écran en périphérie, et pour idéal que le téléphone puisse rester dans la poche pendant l’écoute.",
        },
        {
          type: "text",
          value:
            "Deux maquettes, deux contenus audio, une après-midi dans la Galerie des moulages. Les deux partagent la même interface de lecture ; seule l’entrée change — la saisie d’un numéro héritée de l’audioguide physique d’un côté, le scan d’un QR code de l’autre.",
        },
        {
          type: "image",
          value: imgMemoireNumeros,
          caption: "Maquette 1 — la logique des numéros, héritée du boîtier.",
          ratio: "1100 / 577",
        },
        {
          type: "image",
          value: imgMemoireQR,
          caption:
            "Maquette 2 — la logique du QR code, précédée d’un module d’accueil en quatre écrans.",
          ratio: "952 / 557",
        },

        { type: "heading", value: "Ce que le terrain a renvoyé" },
        {
          type: "text",
          value:
            "Quatre visiteurs sur cinq ont préféré le QR code : moins d’étapes, un geste plus familier. Mais la préférence est arrivée avec une réserve qui dit l’essentiel — « Quand je suis dans un musée, j’ai pas forcément envie d’être sur mon téléphone. » On peut gagner sur le déclenchement et perdre quand même, parce que le problème n’est pas là où on le cherchait.",
        },

        { type: "heading", value: "Là où le design ne peut rien" },
        {
          type: "text",
          value:
            "Je suis parti en cherchant un défaut de conception, et j’ai trouvé une chaîne de production. Entre la conservation qui valide, la médiation qui écrit sous surveillance et le prestataire qui standardise, l’audioguide finit sans auteur identifiable : un objet orphelin, sans signature ni responsabilité éditoriale. On peut concevoir la meilleure interface du monde, elle se heurtera toujours à la même question, qui est de gouvernance et non de conception : qui paie pour la développer, et qui garantit qu’elle sera maintenue ?",
        },
        {
          type: "text",
          value:
            "Ce mémoire est aussi l’endroit où j’ai dû reconnaître mon propre biais. Je pensais en termes d’outil, pas en termes de visiteur — exactement le reproche que je faisais aux institutions.",
        },
        {
          type: "link",
          href: "/pdf/memoire-m2-dimi.pdf",
          label: "Lire le mémoire (M2, 117 pages)",
        },
        {
          type: "link",
          href: "/pdf/memoire-m1-dimi.pdf",
          label: "Lire l’état de l’art (M1, 34 pages)",
        },
      ],
    },

    /* ---------------------------------------------------------- elapsio */
    {
      id: "elapsio",
      shortTitle: "Elapsio",
      title: "Elapsio — l’identité et les packagings d’une marque de randonnée",
      date: "2024",
      summary:
        "Une marque de kits alimentaires pour la randonnée, du logotype aux sachets. Un même système devait tenir sur une bannière et sur dix centimètres de packaging.",
      meta: [
        { label: "rôle", value: "Identité, direction artistique, packaging" },
        { label: "contexte", value: "Mission freelance" },
        { label: "livrables", value: "Logotype, déclinaisons, gamme de packagings" },
      ],
      thumb: imgElapsioLogo,
      blocks: [
        { type: "heading", value: "Le contexte" },
        {
          type: "text",
          value:
            "Elapsio conçoit des kits alimentaires pour la randonnée. Je les ai accompagnés depuis la création de l’identité jusqu’à ses déclinaisons, packagings compris. La marque devait tenir dans deux mondes qui ne se ressemblent pas : le rayon d’un magasin, où elle est comparée à dix autres, et le fond d’un sac à dos, où elle est seule et froissée.",
        },

        { type: "heading", value: "L’identité" },
        {
          type: "text",
          value:
            "Le parti pris : une marque chaleureuse et lisible, réductible à une seule forme. Le symbole se lit comme une coquille de pèlerin autant que comme un sommet, avec des rayons qui redescendent — c’est la même chose, la marche et ce qu’on regarde en marchant. Il fonctionne en aplat monochrome, ce qui était la vraie contrainte : broderie, tampon, sérigraphie sur sachet, tout doit passer sans dégradé.",
        },
        {
          type: "image",
          value: imgElapsioLogo,
          caption: "Le logotype en aplat : une coquille, un sommet, et des rayons qui redescendent.",
        },

        { type: "heading", value: "Le packaging" },
        {
          type: "text",
          value:
            "Sur le sachet, la hiérarchie est brutale par nécessité : le nom de la recette d’abord, tout le reste ensuite. Le format ne pardonne rien — dix centimètres de haut, une main gantée, une lumière de fin de journée. La palette part du terrain plutôt que de la marque : les verts de la forêt, l’orange d’un soleil bas.",
        },
        {
          type: "image",
          value: imgElapsioPack,
          caption:
            "Un sachet Essentielle Boost à l’étape, entre le réchaud et les chaussures. Le seul test qui compte.",
        },
      ],
    },

    /* ---------------------------------------------------------- artsing */
    {
      id: "artsing",
      shortTitle: "ArtSing",
      title: "ArtSing — faire chanter des tableaux",
      date: "2023",
      summary:
        "Trois tableaux animés par IA qui chantent, et un karaoké pour reprendre avec eux. Un projet de 2023, entièrement réécrit deux ans plus tard, remis en ligne aujourd’hui.",
      meta: [
        { label: "rôle", value: "Concept, identité, développement" },
        { label: "contexte", value: "Projet personnel" },
        { label: "stack", value: "HTML · CSS · JavaScript · p5.js" },
      ],
      thumb: imgArtsingSite,
      blocks: [
        { type: "heading", value: "L’idée" },
        {
          type: "text",
          value:
            "En 2023, la génération de vidéo par IA sortait tout juste des laboratoires et tout le monde cherchait à quoi ça pouvait bien servir. J’ai voulu m’en servir pour quelque chose de bête et de joyeux : faire chanter des tableaux. Trois toiles, trois morceaux — l’autoportrait de Van Gogh sur Tainted Love, la Joconde sur Sunny, le portrait de Chopin sur Un peu de haine.",
        },
        {
          type: "text",
          value:
            "Le titre dit le programme : « the art of singing together ». Le tableau ouvre la bouche, les paroles défilent, et à ce moment-là le visiteur a le choix — regarder, ou chanter avec. Rien dans l’interface ne l’oblige, et c’est bien pour ça que ça marche.",
        },

        { type: "heading", value: "L’interface" },
        {
          type: "text",
          value:
            "Rose poudré et orange brûlé, Instrument Serif en italique pour les noms propres et Inter pour tout le reste : le contraste entre le peintre et la chanson est porté par la typographie plutôt que par un décor. L’accueil aligne les trois toiles comme des pochettes de disque, avec un léger basculement en 3D qui suit la souris — juste assez pour donner envie de cliquer.",
        },
        {
          type: "text",
          value:
            "Sur une page de morceau, l’écran se réduit à quatre choses : la toile qui chante, la phrase en cours, la suivante en dessous plus pâle, et une barre qui avance. Un bouton play, un bouton mute. Le karaoké est piloté par une liste de timecodes écrits à la main, morceau par morceau — c’est artisanal, et c’est ce qui fait que ça tombe juste.",
        },
        {
          type: "image",
          value: imgArtsingSite,
          caption: "La page Chopin, telle qu’elle est en ligne aujourd’hui.",
        },

        { type: "heading", value: "Sous le capot" },
        {
          type: "text",
          value:
            "HTML, CSS et JavaScript à la main — pas de framework, pas d’étape de build. p5.js dessine le fond de l’accueil, où le mot « ArtSing » se répand en continu. Les toiles ont été animées par des modèles vidéo, le code écrit avec ChatGPT et Cursor pour compagnons, et la première version hébergée chez O2switch.",
        },
        {
          type: "image",
          value: imgArtsingStack,
          caption:
            "La chaîne de production : des IA pour donner vie aux tableaux, Cursor pour le code, O2switch pour l’hébergement.",
        },

        { type: "heading", value: "Deux versions, et une remise en ligne" },
        {
          type: "text",
          value:
            "La première version, en 2023, était plus bavarde : un curseur remplacé par une traînée, et deux spectres qui écoutaient le micro pour réagir à la voix du visiteur. L’idée était bonne, l’exécution beaucoup moins — les paroles se décalaient, et la moitié des pages ne tenait pas la route. La réécriture de 2025 a tout enlevé sauf l’essentiel, et c’est celle-là qui est en ligne.",
        },
        {
          type: "text",
          value:
            "Le code dormait depuis dans un dossier. Je l’ai remonté ici en ne corrigeant que ce qui l’empêchait d’être consultable : la bibliothèque p5 servie depuis un CDN, désormais embarquée ; un chemin d’image absolu qui pointait à côté ; une mise en page sans aucune media query, qui débordait sur téléphone. Le reste est tel quel.",
        },
        {
          type: "link",
          href: "/artsing/",
          label: "Ouvrir ArtSing",
        },
      ],
    },

    /* ------------------------------------------------------------ c2rmf */
    {
      id: "c2rmf",
      shortTitle: "C2RMF & Inrap",
      title: "C2RMF puis Inrap — piloter des sites d’institution",
      date: "2022 — 2024",
      summary:
        "Trois ans d’alternance dans deux institutions culturelles publiques, à faire vivre des sites, à piloter des refontes et à négocier avec des prestataires. Trafic doublé en deux ans.",
      meta: [
        { label: "rôle", value: "Chargé de projet web et éditorial" },
        { label: "contexte", value: "Alternance — C2RMF (Ministère de la Culture), puis Inrap" },
        { label: "outils", value: "Drupal · Analytics · SEO" },
      ],
      thumb: imgC2RMF,
      blocks: [
        { type: "heading", value: "Au C2RMF" },
        {
          type: "text",
          value:
            "Le Centre de Recherche et de Restauration des Musées de France produit un savoir considérable et le publie peu. Mon travail a moins consisté à écrire qu’à débloquer : aller chercher la matière département par département, raccourcir la chaîne de validation, et faire en sorte que le site cesse d’être un goulot d’étranglement.",
        },
        {
          type: "list",
          intro: "Ce que ça a donné :",
          items: [
            "Trafic web en hausse de plus de 100 % en deux ans.",
            "Processus de création de contenus revu avec les différents départements, pour augmenter la fréquence de publication.",
            "Analyse du trafic et du comportement des utilisateurs, puis refonte de l’arborescence.",
            "Optimisation du référencement et de l’accessibilité des pages.",
            "Ateliers d’amélioration du CMS Drupal avec l’institution et le prestataire.",
          ],
        },
        {
          type: "image",
          value: imgC2RMF,
          caption: "Le site vitrine du centre.",
        },

        { type: "heading", value: "Puis à l’Inrap" },
        {
          type: "text",
          value:
            "À l’Institut national de recherches en archéologie préventive, le poste bascule vers le pilotage : deux refontes menées en parallèle, la direction d’un côté, le prestataire de l’autre, et le back-office entre les deux.",
        },
        {
          type: "list",
          items: [
            "Suivi de la refonte du site portail : conseil auprès de la direction et du prestataire, ateliers, back-office.",
            "Suivi de la refonte de l’iconothèque, dans les mêmes conditions.",
            "Chargé de projet sur la participation de l’Inrap au bicentenaire de la photographie.",
          ],
        },
      ],
    },

    /* -------------------------------------------------------------- lkl */
    {
      id: "lkl",
      shortTitle: "LKL",
      title: "LKL — l’identité d’une ligue esport amateur",
      date: "2023",
      summary:
        "Une marque qui doit claquer en stream et rester déclinable par des bénévoles, sans direction artistique derrière eux pour rattraper les écarts.",
      meta: [
        { label: "rôle", value: "Identité, direction artistique" },
        { label: "contexte", value: "Ligue esport amateur" },
        { label: "livrables", value: "Logotype, déclinaisons de diffusion" },
      ],
      thumb: imgLKL,
      blocks: [
        { type: "heading", value: "Le contexte" },
        {
          type: "text",
          value:
            "LKL est une ligue esport amateur. Le vrai commanditaire n’est pas une équipe marketing : ce sont des bénévoles qui vont produire eux-mêmes leurs visuels de match, chaque semaine, avec les outils qu’ils ont sous la main. Une charte de quarante pages n’aurait servi à personne.",
        },

        { type: "heading", value: "Le parti pris" },
        {
          type: "text",
          value:
            "Une forme, un mot, un fond. L’étoile éclatée fonctionne comme un impact ; le lettrage est massif et sans détail ; le contraste est poussé au maximum. C’est une réponse à la contrainte de diffusion autant qu’un choix esthétique : une image de stream est compressée, redimensionnée, incrustée sur un fond de jeu. Ce qui est fin disparaît, ce qui est plein survit.",
        },
        {
          type: "text",
          value:
            "Le grain sur l’aplat est là pour la même raison — il donne de la matière à une surface unie qui, sans lui, se serait délitée en bandes à la compression.",
        },
        {
          type: "image",
          value: imgLKL,
          caption: "Le lockup principal sur son aplat grainé.",
        },
      ],
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
