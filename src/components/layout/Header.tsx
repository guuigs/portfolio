import { Github, Linkedin, Mail } from "lucide-react";
import { hrefFor, isModifiedClick } from "@/lib/router";
import type { Socials } from "@/lib/content";
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

          <a
            href={socials.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="
              ml-2 inline-flex h-11 items-center rounded-md border border-line-strong sm:h-9
              bg-surface px-3 text-[13px] font-medium text-fg
              transition-[background-color,border-color] duration-150 ease-out
              hover:border-gray-400 hover:bg-bg-subtle
            "
          >
            mon cv
          </a>
        </nav>
      </div>
    </header>
  );
}
