import { useCallback, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Like } from "@/lib/content";
import { useLocale, translate } from "@/lib/i18n";
import { IconButton } from "./IconButton";

export interface LightboxProps {
  likes: Like[];
  selectedId: string | null;
  onSelect: (likeId: string | null) => void;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-2.5">
      <dt className="overline">{label}</dt>
      <dd className="text-right text-[14px] text-fg sm:text-[13px]">{value}</dd>
    </div>
  );
}

/**
 * Detail view for a coup de cœur.
 *
 * The grid deliberately shows images with no captions, so this is the only
 * place the metadata exists — and it doubles as a browser: arrows and the
 * ←/→ keys walk the whole collection without going back to the grid.
 *
 * Built on native `<dialog>`, so focus trapping, Escape and inertness of the
 * page behind come from the platform rather than from us.
 */
export function Lightbox({ likes, selectedId, onSelect }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { locale } = useLocale();

  const index = likes.findIndex((like) => like.id === selectedId);
  const like = index >= 0 ? likes[index] : null;

  const step = useCallback(
    (delta: number) => {
      if (index < 0 || likes.length === 0) return;
      onSelect(likes[(index + delta + likes.length) % likes.length].id);
    },
    [index, likes, onSelect],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (like && !dialog.open) dialog.showModal();
    else if (!like && dialog.open) dialog.close();
  }, [like]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Fires for Escape and for programmatic closes alike.
    const handleClose = () => onSelect(null);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onSelect]);

  useEffect(() => {
    if (!like) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [like, step]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={like ? `${like.title}, ${like.author}` : translate(locale, "detail")}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) dismisses.
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      // A fixed frame, not one that fits its content: the collection mixes
      // portrait book covers with square sleeves, and sizing to each image
      // made the dialog jump on every step through it.
      className="
        m-auto h-[92dvh] w-[min(60rem,94vw)] overflow-hidden overscroll-contain
        rounded-xl border border-line bg-surface p-0 text-fg shadow-lg
        backdrop:bg-gray-900/60 backdrop:backdrop-blur-[3px]
      "
    >
      {like && (
        /* On a phone the metadata is `auto`-sized and was taking two thirds of
           the frame, leaving the image — the whole point — at 173×260. Fixed
           fractions give the picture the majority and let the panel scroll. */
        <div className="grid h-full grid-cols-1 grid-rows-[3fr_2fr] sm:grid-cols-[1fr_20rem] sm:grid-rows-1">
          <div className="relative flex min-h-0 items-center justify-center bg-bg-subtle p-4 sm:p-10">
            <img
              src={like.image}
              alt={like.title}
              className="max-h-full max-w-full rounded-md object-contain shadow-md"
            />

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between sm:inset-x-5 sm:bottom-5">
              <IconButton
                label={translate(locale, "previous")}
                onClick={() => step(-1)}
                className="bg-surface/90 backdrop-blur-sm"
              >
                <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
              </IconButton>
              <span className="rounded-md bg-surface/90 px-2.5 py-1 font-mono text-[11px] text-fg-subtle backdrop-blur-sm">
                {index + 1} / {likes.length}
              </span>
              <IconButton
                label={translate(locale, "next")}
                onClick={() => step(1)}
                className="bg-surface/90 backdrop-blur-sm"
              >
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </IconButton>
            </div>
          </div>

          <div className="flex flex-col gap-5 overflow-y-auto border-t border-line p-6 sm:border-l sm:border-t-0 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl tracking-[-0.03em]">{like.title}</h2>
              <IconButton
                label={translate(locale, "close")}
                className="-mr-2 -mt-1 size-8 shrink-0 border-transparent bg-transparent"
                onClick={() => dialogRef.current?.close()}
              >
                <X size={16} strokeWidth={1.75} aria-hidden="true" />
              </IconButton>
            </div>

            <dl className="flex flex-col border-b border-line">
              <Meta label={translate(locale, "author")} value={like.author} />
              <Meta label={translate(locale, "type")} value={like.kind} />
              <Meta label={translate(locale, "year")} value={like.date} />
            </dl>

            <a
              href={like.link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group mt-auto inline-flex h-10 w-full items-center justify-center gap-1.5
                rounded-md border border-line-strong bg-surface px-4 text-sm font-medium
                transition-[background-color,border-color] duration-150 ease-out
                hover:border-gray-400 hover:bg-bg-subtle
              "
            >
              {translate(locale, "learnMore")}
              <ArrowUpRight
                size={15}
                strokeWidth={1.75}
                aria-hidden="true"
                className="transition-transform duration-150 ease-out group-hover:translate-x-px group-hover:-translate-y-px"
              />
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
