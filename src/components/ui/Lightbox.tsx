import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { Like } from "@/lib/content";
import { IconButton } from "./IconButton";

export interface LightboxProps {
  like: Like | null;
  onClose: () => void;
}

/**
 * Detail popup for a coup de cœur: the image, with title / author / date /
 * link beside it. Built on native `<dialog>` so focus trapping, Escape and
 * inertness of the page behind come from the platform rather than from us.
 */
export function Lightbox({ like, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (like && !dialog.open) {
      dialog.showModal();
    } else if (!like && dialog.open) {
      dialog.close();
    }
  }, [like]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Fires for Escape and for programmatic closes alike.
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={like ? `${like.title}, ${like.author}` : "Détail"}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) dismisses.
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="
        m-auto max-h-[88vh] w-[min(56rem,92vw)] overscroll-contain
        rounded-xl border border-line bg-surface p-0 text-fg shadow-lg
        backdrop:bg-gray-900/50 backdrop:backdrop-blur-[2px]
      "
    >
      {like && (
        <div className="grid max-h-[88vh] grid-cols-1 sm:grid-cols-[1.4fr_1fr]">
          <div className="flex items-center justify-center overflow-hidden bg-bg-subtle p-4 sm:p-6">
            <img
              src={like.image}
              alt={like.title}
              className="max-h-[42vh] w-auto rounded-md object-contain sm:max-h-[76vh]"
            />
          </div>

          <div className="flex flex-col gap-5 overflow-y-auto border-t border-line p-6 sm:border-l sm:border-t-0 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="overline">{like.kind}</span>
              <IconButton
                label="Fermer"
                className="-mr-2 -mt-2 size-8 border-transparent bg-transparent"
                onClick={() => dialogRef.current?.close()}
              >
                <X size={16} strokeWidth={1.75} aria-hidden="true" />
              </IconButton>
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl tracking-[-0.03em]">{like.title}</h2>
              <p className="text-sm text-fg-muted">{like.author}</p>
              <time className="text-sm text-fg-subtle">{like.date}</time>
            </div>

            <a
              href={like.link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group mt-auto inline-flex h-10 w-fit items-center gap-1.5 rounded-md
                border border-line-strong bg-surface px-4 text-sm font-medium
                transition-[background-color,border-color] duration-150 ease-out
                hover:border-gray-400 hover:bg-bg-subtle
              "
            >
              consulter
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
