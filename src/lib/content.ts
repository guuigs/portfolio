/* ============================================================
   Content model — the whole site is data.
   Nothing in the views is hard-coded; the Ctrl+A admin layer
   edits this shape and persists it to localStorage.
   Seeded with the real copy, images and links from the site.
   ============================================================ */

// --- Case-study imagery -------------------------------------------------
import imgElapsio1 from "@/assets/images/Experiences/Design graphique/Elapsio1.png";
import imgElapsio2 from "@/assets/images/Experiences/Design graphique/Elapsio 2.png";
import imgLKL from "@/assets/images/Experiences/Design graphique/LKL.png";
import imgArtsingDesign from "@/assets/images/Experiences/Design graphique/Artsing.png";
import imgArtsingWeb from "@/assets/images/Experiences/Developpement web/Artsing.png";
import imgWakeyWeb from "@/assets/images/Experiences/Developpement web/Wakey.png";
import imgWakeyUx from "@/assets/images/Experiences/Experience utilisateur/Wakey.png";
import imgMemoire from "@/assets/images/Experiences/Experience utilisateur/Mémoire.png";
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

/** A paragraph, a bullet list, an image, or a standalone link in an article. */
export type Block =
  | { type: "text"; value: string }
  | { type: "list"; intro?: string; items: string[] }
  | { type: "image"; value: string; caption?: string }
  | { type: "link"; href: string; label: string };

export interface CaseStudy {
  id: string;
  title: string;
  /** Short label for carousel thumbnails and skill rails. */
  shortTitle: string;
  date: string;
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
  profile: Profile;
  socials: Socials;
  skills: Skill[];
  cases: CaseStudy[];
  likes: Like[];
}

// ------------------------------------------------------------- defaults

export const DEFAULT_CONTENT: Content = {
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
      cases: ["elapsio-branding", "elapsio-packaging", "lkl", "artsing-design"],
    },
    {
      id: "ux",
      title: "Expérience utilisateur",
      description:
        "Mes études et mes expériences professionnelles m’ont montré à quel point l’étude du comportement de l’utilisateur est cruciale au succès d’un produit — et à quel point, paradoxalement, elle est peu pratiquée. Je m’efforce donc de toujours partir de l’usage : tests, interviews, études.",
      stack: [
        "Recherche utilisateur",
        "Interviews",
        "Questionnaires",
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
        "HTML",
        "CSS",
        "Git",
        "Cursor",
      ],
      cases: ["wakey", "artsing-web"],
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
    {
      id: "elapsio-branding",
      shortTitle: "Elapsio — branding",
      title: "Elapsio — création du branding de l’entreprise",
      date: "2024",
      thumb: imgElapsio1,
      blocks: [
        {
          type: "text",
          value:
            "Elapsio conçoit des kits alimentaires pour la randonnée. Je les ai accompagnés depuis la création de l’identité jusqu’aux déclinaisons de la marque.",
        },
        {
          type: "text",
          value:
            "Le parti pris : une marque chaleureuse et lisible, capable de tenir aussi bien sur un sachet de dix centimètres que sur une bannière. Le système repose sur une palette naturelle et une typographie éditoriale.",
        },
        {
          type: "image",
          value: imgElapsio1,
          caption: "Système d’identité — logotype, palette et déclinaisons.",
        },
      ],
    },
    {
      id: "elapsio-packaging",
      shortTitle: "Elapsio — packaging",
      title: "Elapsio — packagings du kit alimentaire de randonnée",
      date: "2024",
      thumb: imgElapsio2,
      blocks: [
        {
          type: "text",
          value:
            "La déclinaison packaging du produit phare d’Elapsio : le kit alimentaire de randonnée. Contrainte principale — rester lisible sur un format très contraint, en rayon comme dans un sac.",
        },
        {
          type: "image",
          value: imgElapsio2,
          caption: "Gamme de packagings du kit alimentaire.",
        },
      ],
    },
    {
      id: "lkl",
      shortTitle: "LKL",
      title: "LKL — branding de la ligue esport amateur",
      date: "2023",
      thumb: imgLKL,
      blocks: [
        {
          type: "text",
          value:
            "LKL est une ligue esport amateur. L’enjeu : une identité qui claque en stream tout en restant déclinable par des équipes bénévoles, sans direction artistique derrière elles.",
        },
        {
          type: "image",
          value: imgLKL,
          caption: "Identité et déclinaisons de diffusion.",
        },
      ],
    },
    {
      id: "artsing-design",
      shortTitle: "Artsing — branding",
      title: "Artsing — branding à l’aube de l’IA générative",
      date: "2023",
      thumb: imgArtsingDesign,
      blocks: [
        {
          type: "text",
          value:
            "Artsing explorait la génération d’images par intelligence artificielle à ses balbutiements. J’ai construit la marque autour de ces expérimentations.",
        },
        {
          type: "image",
          value: imgArtsingDesign,
          caption: "Identité Artsing.",
        },
      ],
    },
    {
      id: "artsing-web",
      shortTitle: "Artsing — site",
      title: "Artsing — développement de la page web",
      date: "2023",
      thumb: imgArtsingWeb,
      blocks: [
        {
          type: "text",
          value:
            "La page web d’Artsing, développée en HTML, CSS et JavaScript, met en scène les explorations génératives de la marque.",
        },
        {
          type: "image",
          value: imgArtsingWeb,
          caption: "Page d’accueil animée.",
        },
        {
          type: "link",
          href: "https://guilhemterrier.fr/artsing/index.html",
          label: "Visitez le site Artsing",
        },
      ],
    },
    {
      id: "wakey",
      shortTitle: "Wakey",
      title: "Wakey — application mobile d’agrégation d’actualité par IA",
      date: "2024",
      thumb: imgWakeyWeb,
      blocks: [
        {
          type: "text",
          value:
            "Wakey est mon projet le plus abouti. Je voulais apprendre à travailler avec les API d’IA : j’ai donc appris React, le fonctionnement de Git et GitHub, et mené le projet jusqu’à la publication.",
        },
        {
          type: "list",
          intro: "La stack complète :",
          items: [
            "Perplexity API pour l’agrégation et la synthèse",
            "Supabase pour la base de données et l’authentification",
            "Expo pour React en mobile",
            "Cursor comme environnement de développement",
            "iOS pour la publication",
          ],
        },
        {
          type: "image",
          value: imgWakeyWeb,
          caption: "Wakey — développement et publication.",
        },
        {
          type: "text",
          value:
            "L’attention portée à l’expérience utilisateur se reflète jusque dans les écrans : Wakey est un agrégateur, sa valeur tient à ce qu’il retire autant qu’à ce qu’il affiche.",
        },
        {
          type: "image",
          value: imgWakeyUx,
          caption: "Wakey — écrans de l’application.",
        },
      ],
    },
    {
      id: "memoire",
      shortTitle: "Mémoire M2",
      title: "Mémoire — repenser l’audioguide de musée",
      date: "2025",
      thumb: imgMemoire,
      blocks: [
        {
          type: "text",
          value:
            "L’exemple le plus net de mon attachement à la recherche utilisateur est mon mémoire, dans lequel je m’attache à identifier les points de friction liés aux audioguides de musée et à proposer une solution pertinente.",
        },
        {
          type: "image",
          value: imgMemoire,
          caption:
            "Extraits du questionnaire de début de recherche M2 sur les attentes des utilisateurs.",
        },
        {
          type: "link",
          href: "/pdf/memoire-m1-dimi.pdf",
          label: "Lire le mémoire",
        },
      ],
    },
    {
      id: "c2rmf",
      shortTitle: "C2RMF",
      title: "C2RMF — gestion technique et éditoriale du site",
      date: "2022 — 2024",
      thumb: imgC2RMF,
      blocks: [
        {
          type: "text",
          value:
            "Trois années d’alternance au Centre de Recherche et de Restauration des Musées de France, puis à l’Inrap, à piloter des sites institutionnels et leurs refontes.",
        },
        {
          type: "list",
          intro: "Mes actions au C2RMF :",
          items: [
            "Augmentation du trafic web de plus de 100 % en deux ans.",
            "Optimisation des processus de création de contenus avec les différents départements, pour augmenter la fréquence de publication.",
            "Analyse du trafic et du comportement des utilisateurs afin de revoir l’arborescence du site.",
            "Optimisation du référencement et de l’accessibilité des pages.",
            "Participation aux ateliers d’amélioration du CMS Drupal avec l’institution et le prestataire.",
          ],
        },
        {
          type: "image",
          value: imgC2RMF,
          caption: "Site vitrine du centre.",
        },
        {
          type: "list",
          intro: "Mes actions à l’Inrap :",
          items: [
            "Suivi de la refonte du site portail : conseil auprès de la direction et du prestataire, ateliers, back-office.",
            "Suivi de la refonte de l’iconothèque, dans les mêmes conditions.",
            "Chargé de projet sur la participation de l’Inrap au bicentenaire de la photographie.",
          ],
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
