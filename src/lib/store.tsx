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

const STORAGE_KEY = "guilhem-portfolio-content-v2";

/** The editing surface every consumer sees. Deliberately an interface so the
 *  persistence layer can be swapped (localStorage today, an API later)
 *  without touching a single view. */
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
}

const ContentContext = createContext<ContentStore | null>(null);

function clone<T>(value: T): T {
  return structuredClone(value);
}

function load(): Content {
  if (typeof window === "undefined") return clone(DEFAULT_CONTENT);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_CONTENT);
    // Shallow-merge so newly shipped default keys survive an old saved payload.
    return { ...clone(DEFAULT_CONTENT), ...(JSON.parse(raw) as Partial<Content>) };
  } catch {
    return clone(DEFAULT_CONTENT);
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

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(load);

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

  const value = useMemo<ContentStore>(
    () => ({ content, setField, addItem, removeItem, reset, exportJSON }),
    [content, setField, addItem, removeItem, reset, exportJSON],
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
