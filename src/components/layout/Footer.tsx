import type { Content } from "@/lib/content";
import { Editable } from "@/components/cms/Editable";
import { RichText } from "@/components/ui/RichText";
import { Signature } from "@/components/ui/Signature";
import { AsciiStage } from "@/components/effects/AsciiStage";
import { useLocale, translate, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface FooterProps {
  content: Content;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
}

/** Discreet FR/EN switch — mono type, the same voice as the meta row it
 *  sits in, so it reads as another piece of footer chrome rather than a
 *  UI control bolted on top. */
function LocaleSwitch() {
  const { locale, setLocale } = useLocale();

  const option = (value: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(value)}
      aria-current={locale === value ? "true" : undefined}
      aria-label={translate(locale, value === "fr" ? "switchToFrench" : "switchToEnglish")}
      className={cn(
        "rounded-[3px] px-0.5 transition-colors duration-150 ease-out",
        locale === value
          ? "text-fg"
          : "text-fg-faint hover:text-fg-muted",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-1 font-mono text-[13px] sm:text-[12px]">
      {option("fr", "FR")}
      <span aria-hidden="true" className="text-fg-faint">
        /
      </span>
      {option("en", "EN")}
    </div>
  );
}

export function Footer({ content, admin, setField }: FooterProps) {
  const { profile } = content;
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ viewTransitionName: "site-footer" }}
      className="mt-24 border-t border-line bg-surface"
    >
      {/* Full-bleed, like the header: only a gutter, no centred container. */}
      <div className="gutter-x safe-bottom flex flex-col gap-10 pt-14 [--safe-bottom-base:3.5rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(9rem,13rem)] lg:gap-16">
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

            {/* Grouped with the paragraph rather than the column: `self-end`
                below then lands on the text's own right edge, not the far side
                of the layout. */}
            <div className="flex max-w-prose flex-col items-start gap-1">
              {admin ? (
                <Editable
                  as="p"
                  multiline
                  admin
                  value={profile.footerBody}
                  onCommit={(value) => setField("profile.footerBody", value)}
                  className="text-[16px] leading-relaxed text-fg-muted sm:text-[15px]"
                />
              ) : (
                <RichText
                  value={profile.footerBody}
                  className="text-[15px] leading-relaxed text-fg-muted"
                />
              )}

              <Signature className="w-22 self-end text-fg sm:w-26" />
            </div>
          </div>

          <AsciiStage />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p className="font-mono text-[13px] text-fg-subtle sm:text-[12px]">@ {year}</p>
          <div className="flex items-center gap-6">
            <p className="font-mono text-[13px] text-fg-subtle sm:text-[12px]">{profile.name}</p>
            <LocaleSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
}
