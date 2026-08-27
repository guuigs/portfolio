import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionNav } from "@/components/layout/SectionNav";
import { Accueil } from "@/components/sections/Accueil";
import { Competences } from "@/components/sections/Competences";
import { CasEtudes } from "@/components/sections/CasEtudes";
import { CoupsDeCoeur } from "@/components/sections/CoupsDeCoeur";
import { AdminDrawer } from "@/components/cms/AdminDrawer";
import { Editable } from "@/components/cms/Editable";
import { CursorTrail } from "@/components/effects/CursorTrail";
import { AsciiField } from "@/components/effects/AsciiField";
import { ContentProvider, useContentStore } from "@/lib/store";
import { hrefFor, useRoute } from "@/lib/router";
import { withViewTransition } from "@/lib/view-transition";
import { cn } from "@/lib/utils";

/** The square mark in `public/`, used whenever no logo has been uploaded —
 *  the default header wordmark is 113×40 and would be an unreadable sliver
 *  once squeezed into a 16px tab icon. */
const FALLBACK_FAVICON = "/logo-reduit.png";

const SECTION_TITLES: Record<string, string> = {
  home: "Guilhem Terrier — portfolio",
  competences: "Compétences — Guilhem Terrier",
  "cas-etudes": "Cas d’études — Guilhem Terrier",
  "coups-de-coeur": "Coups de cœur — Guilhem Terrier",
};

function Portfolio() {
  const store = useContentStore();
  const { content, setField } = store;
  const { route, navigate } = useRoute();
  const [admin, setAdmin] = useState(false);

  const isHome = route.section === "home";
  const activeCaseId = route.projet ?? content.cases[0]?.id ?? "";

  // Ctrl/⌘+A opens the admin layer, as the brief asks.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "a") return;
      // Don't hijack select-all while the user is actually editing text.
      const target = event.target as HTMLElement | null;
      const isTextEntry =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA";
      if (isTextEntry) return;

      event.preventDefault();
      setAdmin((open) => !open);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // The tab title must describe the section you are actually looking at.
  useEffect(() => {
    document.title = SECTION_TITLES[route.section] ?? SECTION_TITLES.home;
  }, [route.section]);

  // The tab icon follows the header logo, so uploading one changes both and
  // the two can never drift apart. index.html keeps its own <link> for the
  // moment before React boots — otherwise the tab flashes the default globe.
  const logo = content.profile.logo;
  useEffect(() => {
    // Replaced rather than mutated: Safari holds on to the icon it first
    // resolved and ignores a changed `href` on the existing element.
    document.querySelectorAll('link[rel~="icon"]').forEach((node) => node.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    // No `type`: an uploaded file may be a PNG, a GIF or an SVG, and a stale
    // type on the wrong one stops the browser drawing it at all.
    link.href = logo || FALLBACK_FAVICON;
    document.head.appendChild(link);
  }, [logo]);

  const go = useCallback(
    (href: string) => {
      withViewTransition(() => navigate(href));
    },
    [navigate],
  );

  const openCase = useCallback(
    (caseId: string) => go(hrefFor("cas-etudes", { projet: caseId })),
    [go],
  );

  const selectLike = useCallback(
    (likeId: string | null) => {
      // Replace rather than push: opening a lightbox shouldn't fill the
      // history stack, but it should survive a refresh and be shareable.
      navigate(hrefFor("coups-de-coeur", { item: likeId ?? undefined }), { replace: true });
    },
    [navigate],
  );

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col",
        // Make room for the admin panel so it never covers the content
        // you are editing.
        admin && "lg:pr-[26rem]",
      )}
    >
      <a
        href="#contenu"
        className="
          sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]
          focus:rounded-md focus:border focus:border-line-strong focus:bg-surface
          focus:px-4 focus:py-2 focus:text-sm
        "
      >
        Aller au contenu
      </a>

      <Header socials={content.socials} logo={content.profile.logo} onNavigate={go} />

      <main id="contenu" className="flex-1">
        {/* Persistent hero — the title and the three buttons stay put across
            sections, so the site reads as one page rather than four. */}
        <div
          className={cn(
            "gutter-x mx-auto flex max-w-6xl flex-col items-center text-center",
            isHome ? "gap-8 pb-16 pt-20 sm:pt-28" : "gap-6 pb-12 pt-12 sm:pt-16",
          )}
        >
          <Editable
            as="h1"
            admin={admin}
            value={content.profile.heroTitle}
            onCommit={(value) => setField("profile.heroTitle", value)}
            className={cn(
              // Size changes between home and a section, but it is NOT
              // transitioned — font-size is a layout property. The view
              // transition covers the swap instead.
              "max-w-3xl tracking-[-0.045em]",
              isHome ? "text-5xl sm:text-6xl lg:text-7xl" : "text-3xl sm:text-4xl",
            )}
          />

          {isHome && (
            <Editable
              as="p"
              multiline
              admin={admin}
              value={content.profile.heroIntro}
              onCommit={(value) => setField("profile.heroIntro", value)}
              // Mono, not sans: the brief swapped this one to the terminal voice.
              className="max-w-xl text-pretty font-mono text-[14px] leading-relaxed tracking-[-0.01em] text-fg-muted sm:text-sm"
            />
          )}

          <SectionNav active={route.section} onNavigate={go} />
        </div>

        {/* Only this block swaps between sections. */}
        <div style={{ viewTransitionName: "section-body" }} className="section-swap">
          {isHome && <Accueil content={content} />}

          {route.section === "competences" && (
            <Competences
              content={content}
              admin={admin}
              setField={setField}
              onOpenCase={openCase}
            />
          )}

          {route.section === "cas-etudes" && (
            <CasEtudes
              content={content}
              admin={admin}
              setField={setField}
              activeId={activeCaseId}
              onSelect={(caseId) =>
                withViewTransition(() =>
                  navigate(hrefFor("cas-etudes", { projet: caseId }), { replace: true }),
                )
              }
            />
          )}

          {route.section === "coups-de-coeur" && (
            <CoupsDeCoeur
              content={content}
              selectedId={route.item}
              onSelect={selectLike}
            />
          )}
        </div>
      </main>

      <Footer content={content} admin={admin} setField={setField} />

      {isHome && <AsciiField />}
      <CursorTrail />

      {/* No visible affordance for the admin shortcut: it is deliberately
          undiscoverable, so visitors never stumble into editing mode. */}
      {admin && (
        <AdminDrawer
          store={store}
          section={route.section}
          activeCaseId={activeCaseId}
          activeLikeId={route.item}
          onClose={() => setAdmin(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <Portfolio />
    </ContentProvider>
  );
}
