import type { Content } from "@/lib/content";
import { Editable } from "@/components/cms/Editable";
import { RichText } from "@/components/ui/RichText";
import { Signature } from "@/components/ui/Signature";
import { AsciiStage } from "@/components/effects/AsciiStage";

export interface FooterProps {
  content: Content;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
}

export function Footer({ content, admin, setField }: FooterProps) {
  const { profile } = content;
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ viewTransitionName: "site-footer" }}
      className="mt-24 border-t border-line"
    >
      {/* Full-bleed, like the header: only a gutter, no centred container. */}
      <div className="flex flex-col gap-10 px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="text-lg tracking-[-0.02em] text-fg">
              <Editable
                admin={admin}
                value={profile.footerName}
                onCommit={(value) => setField("profile.footerName", value)}
                className="font-semibold"
              />{" "}
              <Editable
                admin={admin}
                value={profile.footerLine}
                onCommit={(value) => setField("profile.footerLine", value)}
                className="text-fg-faint"
              />
            </p>

            {/* The signature is grouped with the paragraph, not with the column,
                so it hugs the last line instead of drifting to the far edge. */}
            <div className="flex max-w-prose flex-col items-start gap-1">
              {admin ? (
                <Editable
                  as="p"
                  multiline
                  admin
                  value={profile.footerBody}
                  onCommit={(value) => setField("profile.footerBody", value)}
                  className="text-[15px] leading-relaxed text-fg-muted"
                />
              ) : (
                <RichText
                  value={profile.footerBody}
                  className="text-[15px] leading-relaxed text-fg-muted"
                />
              )}

              <Signature className="w-22 text-fg sm:w-26" />
            </div>
          </div>

          <AsciiStage />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-8">
          <p className="font-mono text-[12px] text-fg-subtle">@ {year}</p>
          <p className="font-mono text-[12px] text-fg-subtle">{profile.name}</p>
        </div>
      </div>
    </footer>
  );
}
