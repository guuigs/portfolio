import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CONTENT_VERSION, DEFAULT_CONTENT, type Content } from "./content";
import {
  currentSession,
  fetchContent,
  isRemoteEnabled,
  publishContent,
  signIn as remoteSignIn,
  signOut as remoteSignOut,
  supabase,
} from "./supabase";

/* v3 : la clé v2 a été écrite par une version qui persistait le contenu dès
   le premier rendu, brouillon ou pas. Tout navigateur ayant visité le site en
   porte donc une, et la garder reviendrait à faire gagner un faux brouillon
   sur le contenu publié — précisément le bug corrigé ici. On repart propre. */
const STORAGE_KEY = "guilhem-portfolio-content-v3";
const LEGACY_STORAGE_KEYS = ["guilhem-portfolio-content-v2"];

export type PublishState = "idle" | "publishing" | "done" | "error";

/** The editing surface every consumer sees. Deliberately an interface so the
 *  persistence layer can be swapped without touching a single view. */
export interface ContentStore {
  content: Content;
  /** Set a value by dotted path, e.g. `profile.heroTitle` or `skills.0.title`. */
  setField: (path: string, value: unknown) => void;
  addItem: <K extends "skills" | "cases" | "likes">(
    collection: K,
    item: Content[K][number],
  ) => void;
  removeItem: (collection: "skills" | "cases" | "likes", index: number) => void;
  reset: () => void;
  exportJSON: () => void;

  /* ---- publication ---- */
  /** True when a Supabase project is wired up. */
  remoteEnabled: boolean;
  /** Email of the signed-in admin, null when signed out. */
  adminEmail: string | null;
  /** Local edits that differ from what is published — or nothing published yet. */
  dirty: boolean;
  /** An actual local draft exists, as opposed to content merely differing. */
  hasDraft: boolean;
  /** True until the first read of the published content has settled. */
  loadingRemote: boolean;
  /** Nothing has ever been published, so the site still serves content.ts. */
  neverPublished: boolean;
  /** Why the published content could not be read, if it could not. */
  remoteError: string | null;
  /** The published payload predates this build's content model. */
  staleRemote: boolean;
  /** Which of its keys were recovered anyway. */
  carriedKeys: string[];
  publishState: PublishState;
  publishError: string | null;
  publish: () => Promise<void>;
  /** Throw away the local draft and go back to the published version. */
  discardDraft: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const ContentContext = createContext<ContentStore | null>(null);

function clone<T>(value: T): T {
  return structuredClone(value);
}

/**
 * Keys whose shape has not moved since the content model was first published.
 *
 * `cases` and `skills` are deliberately absent: both were restructured, and
 * carrying an old copy forward would put the previous articles back wholesale
 * — which is the reason the version gate exists at all.
 */
const CARRIED_KEYS = ["profile", "socials", "likes"] as const;

/** Shallow shape check — enough to stop a corrupt payload reaching the render. */
function looksLike(value: unknown, model: unknown): boolean {
  if (Array.isArray(model)) return Array.isArray(value);
  if (model !== null && typeof model === "object") {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  return typeof value === typeof model;
}

export interface Migration {
  /** The content to render, or null when there was no usable payload. */
  content: Content | null;
  /** The payload came from an older CONTENT_VERSION. */
  stale: boolean;
  /** Which keys were recovered from a stale payload. */
  carried: string[];
}

/**
 * Adopts a stored payload — local draft or published row — against the content
 * this build ships.
 *
 * A version bump used to discard the payload whole. That cost far more than it
 * protected: `cases` was the only key whose model had actually moved, but the
 * homepage text, the header logo, the links and the coups de cœur went with it
 * — including every image URL already uploaded to Storage, which then had to
 * be uploaded again. The data was never deleted; it was read and thrown away
 * on every load, which looks exactly the same from the outside.
 *
 * So the gate is per key. A payload of the current version is taken as is; an
 * older one keeps the keys whose shape never changed and takes the rest from
 * this build. A key is only carried if it still looks like what it replaces,
 * so a hand-edited or truncated payload degrades to the bundled copy instead
 * of rendering undefined.
 */
export function migrate(payload: Partial<Content> | null | undefined): Migration {
  if (!payload || typeof payload !== "object") {
    return { content: null, stale: false, carried: [] };
  }

  // Shallow-merge so newly shipped default keys survive an older payload.
  const base = clone(DEFAULT_CONTENT);

  if (payload.version === CONTENT_VERSION) {
    return { content: { ...base, ...payload } as Content, stale: false, carried: [] };
  }

  const carried: string[] = [];
  for (const key of CARRIED_KEYS) {
    const value = payload[key];
    if (value === undefined || !looksLike(value, base[key])) continue;
    (base as unknown as Record<string, unknown>)[key] = clone(value);
    carried.push(key);
  }

  return { content: base, stale: true, carried };
}

function readLocal(): Content | null {
  if (typeof window === "undefined") return null;
  try {
    for (const key of LEGACY_STORAGE_KEYS) window.localStorage.removeItem(key);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return migrate(JSON.parse(raw) as Partial<Content>).content;
  } catch {
    return null;
  }
}

function setByPath(target: Content, path: string, value: unknown): void {
  const keys = path.split(".");
  let cursor: Record<string, unknown> = target as unknown as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const next = cursor[keys[i]];
    if (next === null || typeof next !== "object") return;
    cursor = next as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
}

const same = (a: Content, b: Content) => JSON.stringify(a) === JSON.stringify(b);

export function ContentProvider({ children }: { children: ReactNode }) {
  /* Lu une seule fois, au tout premier rendu — avant que l'effet de
     persistance plus bas ait pu écrire quoi que ce soit. C'est la correction
     centrale : la version précédente rappelait `readLocal()` au retour du
     réseau, à un moment où elle trouvait forcément la valeur que l'effet de
     persistance venait d'écrire. La condition « pas de brouillon local » ne
     pouvait donc plus jamais être vraie, et le contenu publié dans Supabase
     n'était jamais adopté : on pouvait publier, mais plus personne ne lisait. */
  const [initialDraft] = useState<Content | null>(readLocal);

  // Start from the bundled content (or a local draft) synchronously, so the
  // first paint never waits on the network and never flashes empty.
  const [content, setContent] = useState<Content>(() => initialDraft ?? clone(DEFAULT_CONTENT));

  /* Un brouillon n'existe qu'à partir d'une vraie modification. Sans ce
     drapeau, ouvrir la page suffisait à en fabriquer un. */
  const [hasDraft, setHasDraft] = useState(initialDraft !== null);

  const [published, setPublished] = useState<Content | null>(null);
  // `published === null` is ambiguous on its own — it means both "not read
  // yet" and "nothing has ever been published". Keeping them apart is what
  // lets the very first publish be enabled.
  const [remoteRead, setRemoteRead] = useState(!isRemoteEnabled);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [staleRemote, setStaleRemote] = useState(false);
  const [carriedKeys, setCarriedKeys] = useState<string[]>([]);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [publishError, setPublishError] = useState<string | null>(null);

  // Adopt the published content on load. A local draft wins, so an unfinished
  // edit survives a refresh — the drawer surfaces the conflict either way.
  useEffect(() => {
    if (!isRemoteEnabled) return;
    let cancelled = false;

    void (async () => {
      try {
        const remote = await fetchContent();
        if (cancelled) return;
        setPublished(remote);
        setRemoteRead(true);

        const migrated = migrate(remote);
        setStaleRemote(migrated.stale);
        setCarriedKeys(migrated.carried);
        // The raw row stays the comparison baseline, so a payload that had to
        // be migrated reads as "à publier" — republishing is what stops it
        // being migrated again on every load.
        if (migrated.content && !initialDraft) setContent(migrated.content);
      } catch (error) {
        if (cancelled) return;
        // Leave remoteRead false: publishing stays disabled until we have
        // actually seen what is online, so a failed read can never lead to
        // overwriting it.
        setRemoteError(error instanceof Error ? error.message : String(error));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void currentSession().then((session) => setAdminEmail(session?.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setAdminEmail(session?.user.email ?? null),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Rien à sauvegarder tant que l'utilisateur n'a rien changé : écrire ici
    // sans condition, c'était fabriquer un brouillon à chaque visite.
    if (!hasDraft) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // Storage full or blocked (private mode) — editing still works in-memory.
    }
  }, [content, hasDraft]);

  /** Le brouillon n'a plus lieu d'être : publié, jeté, ou remis à zéro. */
  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setHasDraft(false);
  }, []);

  const setField = useCallback((path: string, value: unknown) => {
    setHasDraft(true);
    setContent((current) => {
      const next = clone(current);
      setByPath(next, path, value);
      return next;
    });
  }, []);

  const addItem = useCallback<ContentStore["addItem"]>((collection, item) => {
    setHasDraft(true);
    setContent((current) => ({
      ...current,
      [collection]: [...current[collection], item],
    }));
  }, []);

  const removeItem = useCallback<ContentStore["removeItem"]>((collection, index) => {
    setHasDraft(true);
    setContent((current) => ({
      ...current,
      [collection]: current[collection].filter((_, i) => i !== index),
    }));
  }, []);

  const reset = useCallback(() => {
    clearDraft();
    setContent(clone(DEFAULT_CONTENT));
  }, [clearDraft]);

  const discardDraft = useCallback(() => {
    clearDraft();
    // Same rule as on load: what is online is migrated, not discarded, so
    // dropping a draft returns to the published homepage rather than to the
    // bundled placeholder.
    setContent(migrate(published).content ?? clone(DEFAULT_CONTENT));
  }, [clearDraft, published]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-content.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const publish = useCallback(async () => {
    setPublishState("publishing");
    setPublishError(null);
    try {
      await publishContent(content);
      setPublished(clone(content));
      // What is online now matches this build's model, so nothing is carried.
      setStaleRemote(false);
      setCarriedKeys([]);
      // Ce qui vient d'être publié n'est plus un brouillon : garder la clé
      // ferait gagner une copie locale sur la version en ligne au rechargement
      // suivant, y compris après une modification faite depuis un autre poste.
      clearDraft();
      setPublishState("done");
      window.setTimeout(() => setPublishState("idle"), 2500);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : String(error));
      setPublishState("error");
    }
  }, [clearDraft, content]);

  const signIn = useCallback(async (email: string, password: string) => {
    await remoteSignIn(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await remoteSignOut();
  }, []);

  // Nothing published yet counts as dirty: otherwise the very first publish
  // could never be enabled, and the table would stay empty forever.
  const dirty = remoteRead && (published === null || !same(content, published));

  const value = useMemo<ContentStore>(
    () => ({
      content,
      setField,
      addItem,
      removeItem,
      reset,
      exportJSON,
      remoteEnabled: isRemoteEnabled,
      adminEmail,
      dirty,
      hasDraft,
      loadingRemote: !remoteRead,
      neverPublished: remoteRead && published === null,
      remoteError,
      staleRemote,
      carriedKeys,
      publishState,
      publishError,
      publish,
      discardDraft,
      signIn,
      signOut,
    }),
    [
      content,
      setField,
      addItem,
      removeItem,
      reset,
      exportJSON,
      adminEmail,
      dirty,
      hasDraft,
      remoteRead,
      remoteError,
      staleRemote,
      carriedKeys,
      published,
      publishState,
      publishError,
      publish,
      discardDraft,
      signIn,
      signOut,
    ],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContentStore(): ContentStore {
  const store = useContext(ContentContext);
  if (!store) {
    throw new Error("useContentStore must be used inside <ContentProvider>.");
  }
  return store;
}
