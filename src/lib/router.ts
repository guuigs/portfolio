import { useCallback, useEffect, useState } from "react";

export const SECTIONS = ["home", "competences", "cas-etudes", "coups-de-coeur"] as const;
export type SectionId = (typeof SECTIONS)[number];

export interface Route {
  section: SectionId;
  /** Deep-linked case study id, from `?projet=`. */
  projet: string | null;
  /** Deep-linked coup de cœur id, from `?item=`. */
  item: string | null;
}

const PATH_BY_SECTION: Record<SectionId, string> = {
  home: "/",
  competences: "/competences",
  "cas-etudes": "/cas-etudes",
  "coups-de-coeur": "/coups-de-coeur",
};

function parse(): Route {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(window.location.search);
  const section =
    (SECTIONS.find((id) => PATH_BY_SECTION[id] === path) as SectionId | undefined) ?? "home";
  return {
    section,
    projet: params.get("projet"),
    item: params.get("item"),
  };
}

/** Builds the href for a route — used by real `<a>` elements so that
 *  Cmd/Ctrl/middle-click open a new tab like any other link. */
export function hrefFor(section: SectionId, params?: { projet?: string; item?: string }): string {
  const search = new URLSearchParams();
  if (params?.projet) search.set("projet", params.projet);
  if (params?.item) search.set("item", params.item);
  const query = search.toString();
  return PATH_BY_SECTION[section] + (query ? `?${query}` : "");
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(parse);

  useEffect(() => {
    // Let the browser put the scroll position back on Back/Forward.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }
    const onPopState = () => setRoute(parse());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((href: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, "", href);
    } else {
      window.history.pushState(null, "", href);
    }
    setRoute(parse());
  }, []);

  return { route, navigate };
}

/** True when a click should be left to the browser (new tab, new window, …). */
export function isModifiedClick(event: React.MouseEvent): boolean {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}
