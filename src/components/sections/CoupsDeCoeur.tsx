import { useMemo, useState } from "react";
import type { Content, Like } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/ui/Lightbox";

export interface CoupsDeCoeurProps {
  content: Content;
  selectedId: string | null;
  onSelect: (likeId: string | null) => void;
}

const ALL = "tout";

export function CoupsDeCoeur({ content, selectedId, onSelect }: CoupsDeCoeurProps) {
  const [kind, setKind] = useState<string>(ALL);

  const kinds = useMemo(
    () => [ALL, ...Array.from(new Set(content.likes.map((like) => like.kind)))],
    [content.likes],
  );

  const visible = useMemo(
    () => (kind === ALL ? content.likes : content.likes.filter((like) => like.kind === kind)),
    [content.likes, kind],
  );

  const selected: Like | null =
    content.likes.find((like) => like.id === selectedId) ?? null;

  return (
    <section aria-label="Coups de cœur" className="mx-auto w-full max-w-5xl px-6 lg:px-10">
      <div
        role="group"
        aria-label="Filtrer par type"
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        {kinds.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={kind === item}
            onClick={() => setKind(item)}
            className={cn(
              "inline-flex h-11 items-center rounded-md border px-3 text-[13px] font-medium sm:h-8",
              "transition-[background-color,border-color,color] duration-150 ease-out",
              kind === item
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-line-strong bg-surface text-fg-muted hover:border-gray-400 hover:bg-bg-subtle hover:text-fg",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-fg-faint">
          Rien dans cette catégorie pour le moment.
        </p>
      ) : (
        /* Pinterest-style masonry — CSS columns, 3 → 2 → 1. */
        <div className="columns-2 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {visible.map((like) => (
            <button
              key={like.id}
              type="button"
              onClick={() => onSelect(like.id)}
              className="
                group block w-full break-inside-avoid overflow-hidden rounded-lg
                border border-line bg-surface text-left
                transition-[border-color,box-shadow] duration-200 ease-out
                hover:border-line-strong hover:shadow-sm
              "
            >
              <div className="overflow-hidden bg-bg-subtle" style={{ aspectRatio: like.ratio }}>
                <img
                  src={like.image}
                  alt={like.title}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col gap-0.5 border-t border-line px-3 py-2.5">
                <span className="truncate text-[13px] font-medium text-fg">{like.title}</span>
                <span className="truncate text-[12px] text-fg-faint">{like.author}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Lightbox like={selected} onClose={() => onSelect(null)} />
    </section>
  );
}
