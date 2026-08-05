import type { Content } from "@/lib/content";

export interface AccueilProps {
  content: Content;
}

/**
 * The empty space below the hero, holding the animated visual.
 * A bordered frame rather than a floating card — the Vercel move is to let
 * the border do the separating and keep the surface flat.
 */
export function Accueil({ content }: AccueilProps) {
  const { heroImage, heroTitle } = content.profile;

  return (
    <section aria-label="Visuel" className="mx-auto w-full max-w-5xl px-6 lg:px-10">
      <div className="overflow-hidden rounded-xl border border-line bg-bg-subtle">
        {heroImage ? (
          <img
            src={heroImage}
            alt={heroTitle}
            // Intrinsic size of the shipped asset. Declaring it reserves the
            // box before decode, so the footer never jumps (CLS).
            width={3168}
            height={1344}
            // Above the fold — load eagerly and decode early to avoid a flash.
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-auto w-full"
          />
        ) : (
          <div className="flex aspect-16/9 items-center justify-center">
            <span className="overline">visuel à venir</span>
          </div>
        )}
      </div>
    </section>
  );
}
