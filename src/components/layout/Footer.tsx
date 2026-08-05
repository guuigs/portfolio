import type { Content } from "@/lib/content";
import { Editable } from "@/components/cms/Editable";

export interface FooterProps {
  content: Content;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
}

export function Footer({ content, admin, setField }: FooterProps) {
  const { profile, socials } = content;
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ viewTransitionName: "site-footer" }}
      className="mt-24 border-t border-line"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <p className="max-w-md text-lg tracking-[-0.02em] text-fg">
          <Editable
            admin={admin}
            value={profile.footerName}
            onCommit={(value) => setField("profile.footerName", value)}
          />{" "}
          <Editable
            admin={admin}
            value={profile.footerLine}
            onCommit={(value) => setField("profile.footerLine", value)}
            className="text-fg-faint"
          />
        </p>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-8">
          <p className="font-mono text-[12px] text-fg-subtle">
            © {year} {profile.name}
          </p>

          <nav aria-label="Liens de pied de page" className="flex items-center gap-6 text-sm">
            <a
              href={socials.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted transition-colors duration-150 hover:text-fg"
            >
              mon cv
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted transition-colors duration-150 hover:text-fg"
            >
              linkedin
            </a>
            <a
              href={socials.mail}
              className="text-fg-muted transition-colors duration-150 hover:text-fg"
            >
              mail
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
