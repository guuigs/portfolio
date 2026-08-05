import { useMemo, useState } from "react";
import { Dices } from "lucide-react";
import type { Content, Like } from "@/lib/content";
import { Lightbox } from "@/components/ui/Lightbox";

export interface CoupsDeCoeurProps {
  content: Content;
  selectedId: string | null;
  onSelect: (likeId: string | null) => void;
}

/** Small deterministic PRNG, so a given seed always yields the same layout. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items: Like[], seed: number): Like[] {
  const random = mulberry32(seed);
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function CoupsDeCoeur({ content, selectedId, onSelect }: CoupsDeCoeurProps) {
  // Seeded on mount, so every visit to the section deals a new hand. The
  // seed is kept rather than reshuffling per render, otherwise the grid would
  // reorder itself on any unrelated state change.
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 2 ** 31));

  const likes = useMemo(() => shuffle(content.likes, seed), [content.likes, seed]);

  return (
    <section aria-label="Coups de cœur" className="mx-auto w-full max-w-5xl px-6 lg:px-10">
      <div className="mb-4 flex">
        <button
          type="button"
          onClick={() => setSeed(Math.floor(Math.random() * 2 ** 31))}
          aria-label="Redistribuer les coups de cœur au hasard"
          title="Redistribuer au hasard"
          className="
            group inline-flex size-11 items-center justify-center rounded-md
            text-fg-faint transition-colors duration-150 ease-out
            hover:bg-bg-subtle hover:text-fg sm:size-9
          "
        >
          <Dices
            size={18}
            strokeWidth={1.75}
            aria-hidden="true"
            className="transition-transform duration-300 ease-out-quint group-hover:-rotate-12 group-active:rotate-90 motion-reduce:transition-none"
          />
        </button>
      </div>

      {/* Pinterest-style masonry — CSS columns, 3 → 2 → 1. */}
      <div className="columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
        {likes.map((like) => (
          <button
            key={like.id}
            type="button"
            // The card shows the image alone, so the accessible name has to
            // carry the title — otherwise every button reads as "bouton".
            aria-label={`${like.title}, ${like.author}`}
            onClick={() => onSelect(like.id)}
            className="
              group block w-full break-inside-avoid overflow-hidden rounded-lg
              border border-line bg-bg-subtle
              transition-[border-color,box-shadow] duration-200 ease-out
              hover:border-line-strong hover:shadow-sm
            "
          >
            <div className="overflow-hidden" style={{ aspectRatio: like.ratio }}>
              <img
                src={like.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </button>
        ))}
      </div>

      <Lightbox likes={likes} selectedId={selectedId} onSelect={onSelect} />
    </section>
  );
}
