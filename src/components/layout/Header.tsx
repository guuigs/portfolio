import { Github, Linkedin, Mail } from "lucide-react";
import { hrefFor, isModifiedClick } from "@/lib/router";
import type { Socials } from "@/lib/content";
import { Wordmark } from "./Wordmark";

export interface HeaderProps {
  socials: Socials;
  onNavigate: (href: string) => void;
}

const ICON_LINK =
  "inline-flex size-9 items-center justify-center rounded-md text-fg-muted " +
  "transition-[background-color,color] duration-150 ease-out hover:bg-gray-100 hover:text-fg";

export function Header({ socials, onNavigate }: HeaderProps) {
  const homeHref = hrefFor("home");

  return (
    <header
      // Pinned above the view-transition snapshots so it never flickers.
      style={{ viewTransitionName: "site-header" }}
      className="
        sticky top-0 z-50 border-b border-line
        bg-bg/80 backdrop-blur-md backdrop-saturate-150
      "
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 lg:px-10">
        <a
          href={homeHref}
          onClick={(event) => {
            if (isModifiedClick(event)) return;
            event.preventDefault();
            onNavigate(homeHref);
          }}
          className="
            -ml-1 flex items-center rounded-md px-1 py-1 text-fg
            transition-opacity duration-150 ease-out hover:opacity-70
          "
        >
          <Wordmark className="h-5 w-auto" />
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
              ml-2 inline-flex h-9 items-center rounded-md border border-line-strong
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
