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
}

export interface CaseImage {
  value: string;
  caption: string;
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
  links?: { href: string; label: string }[];
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
      cases: ["memoire", "wakey", "frenchbook"],
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
      cases: ["frenchbook", "wakey", "artsing"],
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
    /* ---------------------------------------------------- french book */
    {
      id: "frenchbook",
      shortTitle: "French Book Distribution",
      title: "French Book Distribution — accélérer le pointage des livres à réception",
      date: "2026",
      thumb: "",
      summary:
        "Remplacer un pointage manuel, ligne à ligne, par un scan OCR du bon de livraison et une lecture des codes-barres à la caméra. L’étape gagne 35 % d’efficacité.",
      role: "Conception produit et développement",
      client: "French Book Distribution — distribution et logistique du livre",
      deliverables: [
        "Scan OCR des bons de livraison",
        "Écran de vérification et de correction du scan",
        "Lecture des codes-barres à la caméra",
        "Rapprochement automatique entre les livres lus et les lignes du bon",
      ],
      context:
        "À l’arrivée des cartons, chaque livraison doit être « pointée » : on vérifie, livre par livre, que le contenu du carton correspond bien au bon de livraison qui l’accompagne. C’est le maillon qui conditionne toute la suite de la chaîne — tant qu’un carton n’est pas pointé, il n’entre pas en stock.",
      problem:
        "Le pointage repose entièrement sur le papier et sur la main. Le bon de livraison doit impérativement se trouver dans le carton à l’ouverture, et l’opérateur compare ensuite chaque référence à l’œil, ligne après ligne. C’est lent, fatigant, et la vigilance baisse exactement là où l’erreur coûte le plus cher : une ligne mal lue se propage jusqu’au stock.",
      approach: [
        "Observer l’étape sur le terrain avec les équipes de réception, pour distinguer ce qui prend réellement du temps de ce qu’on croit coûteux.",
        "Numériser le bon de livraison par OCR via Mistral, plutôt que de le ressaisir : le papier est lu une fois, puis devient une donnée exploitable.",
        "Intercaler un écran de vérification — l’OCR propose, l’opérateur confirme ou corrige. La machine ne décide jamais seule sur un document qui engage le stock.",
        "Lire les codes-barres des livres à la caméra, au rythme du déballage, au lieu du pointage visuel.",
        "Rapprocher automatiquement les codes lus et les lignes du bon, et ne remonter à l’opérateur que les écarts.",
      ],
      result:
        "L’opérateur ne recopie plus rien : il valide un scan, puis passe les livres devant la caméra. Le contrôle ligne à ligne disparaît au profit d’une liste d’écarts, beaucoup plus courte à traiter.",
      figures: [
        { value: "+35 %", label: "d’efficacité sur l’étape de pointage" },
        { value: "0", label: "ligne ressaisie à la main" },
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
        "117 pages, huit entretiens, 70 répondants, six audioguides analysés et un prototype testé en salle. Je cherchais un problème de design ; le terrain m’a répondu autre chose.",
      role: "Recherche, terrain, prototype",
      client:
        "Master Design d’Interface Multimédia et Internet, Université Sorbonne Paris Nord — direction Benoît Berthou",
      deliverables: [
        "Mémoire de 117 pages",
        "Huit entretiens semi-directifs",
        "Corpus de six audioguides analysés",
        "Prototype testé à la Cité de l’Architecture et du Patrimoine",
      ],
      context:
        "En dix ans, le nombre d’applications muséales a doublé en France : 398 en 2015, 530 en 2021. Pendant ce temps, l’audioguide dédié reste utilisé par 75 % des visiteurs quand l’application sur smartphone personnel plafonne autour de 50 % (baromètre Gece, 2025). On produit de plus en plus d’un outil de moins en moins utilisé.",
      problem:
        "Entre la promesse d’une médiation accessible et la réalité d’un outil marginalement adopté, qu’est-ce qui empêche l’audioguide mobile de tenir son rôle ? L’analyse du corpus donne une première piste : la quasi-totalité des interfaces force le regard vers l’écran — cartes, menus, listes de parcours — au détriment de ce que le visiteur est venu voir. Or le regard est la ressource rare dans un musée.",
      approach: [
        "Poser cinq hypothèses — conception, économique, organisationnelle, contextuelle, et le support lui-même — puis les mettre à l’épreuve d’un dispositif qualitatif.",
        "Mener huit entretiens semi-directifs, côté visiteurs et côté professionnels de musée.",
        "Passer un questionnaire, 70 répondants.",
        "Analyser un corpus de six audioguides selon une grille commune.",
        "Concevoir l’inverse de ce que fait le corpus : un déclenchement simple, l’audio au centre, l’écran en périphérie, et pour idéal que le téléphone puisse rester dans la poche.",
        "Tester deux maquettes auprès de cinq visiteurs dans la Galerie des moulages — même interface de lecture, seule l’entrée change : saisie d’un numéro contre scan d’un QR code.",
      ],
      result:
        "Quatre visiteurs sur cinq ont préféré le QR code : moins d’étapes, un geste plus familier. Mais la préférence est arrivée avec une réserve qui dit l’essentiel — « Quand je suis dans un musée, j’ai pas forcément envie d’être sur mon téléphone. » Je suis parti en cherchant un défaut de conception, et j’ai trouvé une chaîne de production : entre la conservation qui valide, la médiation qui écrit sous surveillance et le prestataire qui standardise, l’audioguide finit sans auteur identifiable. On peut concevoir la meilleure interface du monde, elle se heurtera toujours à une question de gouvernance et non de conception : qui paie pour la développer, et qui garantit qu’elle sera maintenue ? Ce mémoire est aussi l’endroit où j’ai dû reconnaître mon propre biais — je pensais en termes d’outil, pas en termes de visiteur, exactement le reproche que je faisais aux institutions.",
      figures: [
        { value: "4 sur 5", label: "visiteurs ont préféré le QR code au numéro" },
        { value: "70", label: "répondants au questionnaire, 8 entretiens" },
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
        "Application iOS publiée",
        "Parcours et écrans",
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
        "Faire porter l’abonnement Wakey+ sur du volume et non sur des fonctionnalités : six actualités au lieu de trois, autant de catégories que voulu, trois euros par mois.",
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
