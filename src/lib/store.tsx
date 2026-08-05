import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CONTENT, type Content } from "./content";
import {
  currentSession,
  fetchContent,
  isRemoteEnabled,
  publishContent,
  signIn as remoteSignIn,
  signOut as remoteSignOut,
  supabase,
} from "./supabase";

const STORAGE_KEY = "guilhem-portfolio-content-v2";

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
  /** Local edits that differ from what is published. */
  dirty: boolean;
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

function readLocal(): Content | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Shallow-merge so newly shipped default keys survive an old saved payload.
    return { ...clone(DEFAULT_CONTENT), ...(JSON.parse(raw) as Partial<Content>) };
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
  // Start from the bundled content (or a local draft) synchronously, so the
  // first paint never waits on the network and never flashes empty.
  const [content, setContent] = useState<Content>(() => readLocal() ?? clone(DEFAULT_CONTENT));
  const [published, setPublished] = useState<Content | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [publishError, setPublishError] = useState<string | null>(null);

  // Adopt the published content on load. A local draft wins, so an unfinished
  // edit survives a refresh — the drawer surfaces the conflict either way.
  useEffect(() => {
    if (!isRemoteEnabled) return;
    let cancelled = false;

    void (async () => {
      const remote = await fetchContent();
      if (cancelled || !remote) return;
      setPublished(remote);
      if (!readLocal()) setContent(remote);
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
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // Storage full or blocked (private mode) — editing still works in-memory.
    }
  }, [content]);

  const setField = useCallback((path: string, value: unknown) => {
    setContent((current) => {
      const next = clone(current);
      setByPath(next, path, value);
      return next;
    });
  }, []);

  const addItem = useCallback<ContentStore["addItem"]>((collection, item) => {
    setContent((current) => ({
      ...current,
      [collection]: [...current[collection], item],
    }));
  }, []);

  const removeItem = useCallback<ContentStore["removeItem"]>((collection, index) => {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].filter((_, i) => i !== index),
    }));
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setContent(clone(DEFAULT_CONTENT));
  }, []);

  const discardDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setContent(published ? clone(published) : clone(DEFAULT_CONTENT));
  }, [published]);

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
      setPublishState("done");
      window.setTimeout(() => setPublishState("idle"), 2500);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : String(error));
      setPublishState("error");
    }
  }, [content]);

  const signIn = useCallback(async (email: string, password: string) => {
    await remoteSignIn(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await remoteSignOut();
  }, []);

  const dirty = published !== null && !same(content, published);

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
