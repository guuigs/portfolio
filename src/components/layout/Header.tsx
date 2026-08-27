import { useEffect, useRef, useState } from "react";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { hrefFor, isModifiedClick } from "@/lib/router";
import type { Socials } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";

export interface HeaderProps {
  socials: Socials;
  /** Uploaded logo; falls back to the SVG wordmark when empty. */
  logo?: string;
  onNavigate: (href: string) => void;
}

const ICON_LINK =
  "inline-flex size-11 sm:size-9 items-center justify-center rounded-md text-fg-muted " +
  "transition-[background-color,color] duration-150 ease-out hover:bg-gray-100 hover:text-fg";

/** Used until a CV has been uploaded from the CMS. */
const FALLBACK_CV_EN = "/pdf/cv-en.pdf";

/**
 * The CV button, with the language choice folded inside it.
 *
 * Hover opens it on a pointer, but hover is never the only way in: the
 * trigger is a real button, so a tap opens the menu instead of firing a
 * download, and keyboard focus opens it too. That matters more than usual
 * here — a hover-only menu would put the English CV out of reach of every
 * phone, which is precisely the visitor it exists for.
 */
function CvMenu({ socials }: { socials: Socials }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* A touch browser fires an emulated mouseenter on tap, which would open the
     menu just in time for the click to toggle it shut again — the button would
     do nothing at all on a phone. Honour hover only where hovering is real. */
  const canHover = useRef(false);
  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  // Escape closes and hands focus back, so the keyboard never ends up
  // stranded inside a menu it cannot see.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const ITEM =
    "block rounded-[5px] px-2.5 py-2 text-[13px] text-fg-muted " +
    "transition-[background-color,color] duration-150 ease-out " +
    "hover:bg-bg-subtle hover:text-fg focus-visible:bg-bg-subtle focus-visible:text-fg";

  return (
    <div
      ref={rootRef}
      className="relative ml-2"
      onMouseEnter={() => canHover.current && setOpen(true)}
      onMouseLeave={() => canHover.current && setOpen(false)}
      // Focus deliberately does NOT open the menu: the keyboard opens it with
      // Enter on the button, like any disclosure. Opening on focus would fight
      // Escape, which closes and then hands focus back to that same button.
      // This only closes it once focus has left the menu entirely — React maps
      // it to focusout, so tabbing between the two links keeps it open.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className="
          inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md
          border border-line-strong bg-surface px-3 text-[13px] font-medium text-fg sm:h-9
          transition-[background-color,border-color] duration-150 ease-out
          hover:border-gray-400 hover:bg-bg-subtle
        "
      >
        mon cv
        <ChevronDown
          size={13}
          strokeWidth={2}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-fg-faint transition-transform duration-150 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        /* The wrapper's padding is the bridge between button and panel: with a
           plain margin the pointer would cross a dead gap and close the menu
           on the way down. */
        <div className="absolute right-0 top-full z-50 pt-1.5">
          <div className="flex min-w-36 flex-col rounded-md border border-line-strong bg-surface p-1 shadow-md">
            <a
              href={socials.cv}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={ITEM}
            >
              français
            </a>
            <a
              href={socials.cvEn || FALLBACK_CV_EN}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={ITEM}
            >
              english
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header({ socials, logo, onNavigate }: HeaderProps) {
  const homeHref = hrefFor("home");

  return (
    <header
      // Pinned above the view-transition snapshots so it never flickers.
      style={{ viewTransitionName: "site-header" }}
      // Opaque white rather than a translucent blur: the background ASCII
      // field scrolls underneath, and a frosted bar just smeared it.
      className="sticky top-0 z-50 border-b border-line bg-surface"
    >
      {/* Full-bleed: the bar spans the viewport, only a gutter holds it in. */}
      <div className="gutter-x flex h-16 items-center justify-between gap-4">
        <a
          href={homeHref}
          onClick={(event) => {
            if (isModifiedClick(event)) return;
            event.preventDefault();
            onNavigate(homeHref);
          }}
          className="
            -ml-1 flex min-h-11 items-center rounded-md px-1 text-fg sm:min-h-0 sm:py-1
            transition-opacity duration-150 ease-out hover:opacity-70
          "
        >
          {/* 32px inside the 64px bar: 1.6× the old 20px, and the tallest the
              wordmark can go while leaving the 16px of air the header needs
              above and below it. The bar's own height is untouched. */}
          <Wordmark className="h-8 w-auto" src={logo} />
        </a>

        <nav aria-label="Réseaux" className="flex items-center gap-0.5">
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={ICON_LINK}
          >
            <Github size={17} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={ICON_LINK}
          >
            <Linkedin size={17} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a href={socials.mail} aria-label="Envoyer un mail" className={ICON_LINK}>
            <Mail size={17} strokeWidth={1.75} aria-hidden="true" />
          </a>

          <CvMenu socials={socials} />
        </nav>
      </div>
    </header>
  );
}
