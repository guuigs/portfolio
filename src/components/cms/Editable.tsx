import { useEffect, useRef, type ElementType } from "react";
import { cn } from "@/lib/utils";

export interface EditableProps {
  value: string;
  onCommit: (value: string) => void;
  admin: boolean;
  as?: ElementType;
  className?: string;
  /** Allow Enter to insert a newline instead of committing. */
  multiline?: boolean;
}

/**
 * Inline click-to-edit text, active only in admin mode.
 *
 * The DOM node is written to imperatively rather than being a controlled
 * child: re-rendering a `contentEditable` from state on every keystroke
 * collapses the caret to position 0. We sync in only when the incoming value
 * differs from what the element already shows.
 */
export function Editable({
  value,
  onCommit,
  admin,
  as: Tag = "span",
  className,
  multiline = false,
}: EditableProps) {
  const ref = useRef<HTMLElement>(null);

  // `admin` is a dependency too: the ref only attaches on the editable
  // branch, so entering admin mode has to re-run this to fill the node.
  useEffect(() => {
    const node = ref.current;
    if (node && node.textContent !== value) {
      node.textContent = value;
    }
  }, [value, admin]);

  if (!admin) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label="Modifier le texte"
      tabIndex={0}
      spellCheck={false}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        onCommit(event.currentTarget.textContent?.trim() ?? "");
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Escape") {
          event.currentTarget.textContent = value;
          event.currentTarget.blur();
          return;
        }
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      className={cn(
        "rounded-[3px] outline-none",
        "ring-1 ring-accent/35 focus:ring-2 focus:ring-accent",
        "transition-shadow duration-150",
        className,
      )}
    />
  );
}
