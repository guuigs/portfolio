/* ============================================================
   Locale — French by default, English for visitors outside
   France/Belgium, always overridable from the footer switch.

   Detection stays offline: no IP lookup, no third-party geo
   service. The timezone a browser resolves to is itself already
   a country signal, and pairing it with `navigator.language`
   covers the case of a French/Belgian expat travelling abroad on
   a foreign timezone but a French system locale. A manual choice
   is remembered and always wins over detection on the next visit.
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "fr" | "en";

const STORAGE_KEY = "guilhem-portfolio-locale";

const FR_TIMEZONES = new Set([
  "Europe/Paris",
  "Europe/Brussels",
  // French overseas territories — still France for this purpose.
  "Indian/Reunion",
  "America/Martinique",
  "America/Guadeloupe",
  "America/Cayenne",
  "Indian/Mayotte",
  "Pacific/Noumea",
  "Pacific/Tahiti",
]);

function detectLocale(): Locale {
  if (typeof window === "undefined") return "fr";

  let timezone = "";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    // Some environments (very old browsers, certain privacy modes) throw.
  }
  if (FR_TIMEZONES.has(timezone)) return "fr";

  const languages = navigator.languages ?? [navigator.language];
  const speaksFrench = languages.some((lang) => lang?.toLowerCase().startsWith("fr"));

  // A French-language browser outside a French/Belgian timezone still reads
  // as "fr" — that's most likely a French or Belgian visitor abroad, not the
  // "zone autre que la France ou la Belgique" the switch exists for.
  return speaksFrench ? "fr" : "en";
}

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "fr" || raw === "en" ? raw : null;
  } catch {
    return null;
  }
}

export interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleStore | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale() ?? detectLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage full or blocked — the choice still applies for this visit.
    }
  }, []);

  const value = useMemo<LocaleStore>(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleStore {
  const store = useContext(LocaleContext);
  if (!store) throw new Error("useLocale must be used inside <LocaleProvider>.");
  return store;
}

/* ---------------------------------------------------------- UI strings */

/**
 * Chrome text that never comes from the content model — nav, labels,
 * accessible names. The long-form copy (case studies, skills, likes) is
 * translated separately in `content.en.ts`, keyed by id rather than by a
 * flat dictionary, since it has to stay aligned with images and links.
 */
const STRINGS = {
  skipToContent: { fr: "Aller au contenu", en: "Skip to content" },
  socials: { fr: "Réseaux", en: "Social links" },
  sendMail: { fr: "Envoyer un mail", en: "Send an email" },
  myResume: { fr: "mon cv", en: "my résumé" },
  sections: { fr: "Sections", en: "Sections" },
  navSkills: { fr: "compétences", en: "skills" },
  navCases: { fr: "cas d’études", en: "case studies" },
  navLikes: { fr: "coups de cœur", en: "favourites" },
  visual: { fr: "Visuel", en: "Visual" },
  visualComingSoon: { fr: "visuel à venir", en: "visual coming soon" },
  skillsIndex: { fr: "Index des compétences", en: "Skills index" },
  skillsSection: { fr: "Compétences", en: "Skills" },
  techStack: { fr: "stack technique", en: "tech stack" },
  relatedCases: { fr: "cas d’études", en: "case studies" },
  caseStudies: { fr: "Cas d’études", en: "Case studies" },
  previousCase: { fr: "Cas d’étude précédent", en: "Previous case study" },
  nextCase: { fr: "Cas d’étude suivant", en: "Next case study" },
  role: { fr: "rôle", en: "role" },
  context: { fr: "contexte", en: "context" },
  period: { fr: "période", en: "period" },
  deliverables: { fr: "livrables", en: "deliverables" },
  theContext: { fr: "le contexte", en: "the context" },
  theProblem: { fr: "le problème", en: "the problem" },
  theApproach: { fr: "l’approche", en: "the approach" },
  theResult: { fr: "le résultat", en: "the result" },
  fullSizeImage: { fr: "Image en grand", en: "Full-size image" },
  zoomImage: { fr: "Agrandir l’image", en: "Zoom image" },
  zoomCaption: { fr: "Agrandir : ", en: "Zoom: " },
  close: { fr: "Fermer", en: "Close" },
  likes: { fr: "Coups de cœur", en: "Favourites" },
  shuffleLikes: { fr: "Redistribuer les coups de cœur au hasard", en: "Shuffle the favourites" },
  shuffle: { fr: "Redistribuer au hasard", en: "Shuffle" },
  author: { fr: "auteur", en: "author" },
  type: { fr: "type", en: "type" },
  year: { fr: "année", en: "year" },
  learnMore: { fr: "en savoir plus", en: "learn more" },
  previous: { fr: "Précédent", en: "Previous" },
  next: { fr: "Suivant", en: "Next" },
  detail: { fr: "Détail", en: "Details" },
  switchToFrench: { fr: "Passer en français", en: "Switch to French" },
  switchToEnglish: { fr: "Passer en anglais", en: "Switch to English" },
  metaDescription: {
    fr: "Portfolio de Guilhem Terrier — design graphique, expérience utilisateur, développement web et gestion de projets.",
    en: "Guilhem Terrier’s portfolio — graphic design, user experience, web development and project management.",
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type StringKey = keyof typeof STRINGS;

export function translate(locale: Locale, key: StringKey): string {
  return STRINGS[key][locale];
}
