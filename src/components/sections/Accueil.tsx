import { useEffect, useRef, useState } from "react";
import type { Content } from "@/lib/content";
import { useLocale, translate } from "@/lib/i18n";

export interface AccueilProps {
  content: Content;
}

/** Ratio of the PNG that ships with the site, used until the real one is known. */
const DEFAULT_RATIO = 3168 / 1344;

/**
 * The empty space below the hero, holding the animated visual.
 * A bordered frame rather than a floating card — the Vercel move is to let
 * the border do the separating and keep the surface flat.
 */
export function Accueil({ content }: AccueilProps) {
  const { heroImage, heroTitle } = content.profile;
  const imgRef = useRef<HTMLImageElement>(null);
  const { locale } = useLocale();

  // The visual is editable from the CMS, so its proportions are not known at
  // build time — a GIF or a differently-cropped PNG would otherwise reserve
  // the wrong box and shove the footer when it decodes. Reading the natural
  // size on load keeps the reservation honest for whatever is published.
  const [ratio, setRatio] = useState(DEFAULT_RATIO);

  useEffect(() => {
    setRatio(DEFAULT_RATIO);
  }, [heroImage]);

  // A cached image can finish decoding before React attaches onLoad, and the
  // event never fires — check `complete` once the element exists.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalHeight > 0) {
      setRatio(img.naturalWidth / img.naturalHeight);
    }
  }, [heroImage]);

  return (
    <section aria-label={translate(locale, "visual")} className="gutter-x mx-auto w-full max-w-5xl">
      {/* No frame and no fill: the visual is meant to sit straight on the page,
          so a transparent PNG reads as part of it rather than inside a card. */}
      {heroImage ? (
        <img
          ref={imgRef}
          src={heroImage}
          alt={heroTitle}
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (naturalHeight > 0) setRatio(naturalWidth / naturalHeight);
          }}
          // Above the fold — load eagerly and decode early to avoid a flash.
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-auto w-full"
          style={{ aspectRatio: ratio }}
        />
      ) : (
        <div className="flex aspect-16/9 items-center justify-center rounded-xl border border-line bg-bg-subtle">
          <span className="overline">{translate(locale, "visualComingSoon")}</span>
        </div>
      )}
    </section>
  );
}
