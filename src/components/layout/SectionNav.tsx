import { cn } from "@/lib/utils";
import { hrefFor, isModifiedClick, type SectionId } from "@/lib/router";

const ITEMS: { id: Exclude<SectionId, "home">; label: string }[] = [
  { id: "competences", label: "compétences" },
  { id: "cas-etudes", label: "cas d’études" },
  { id: "coups-de-coeur", label: "coups de cœur" },
];

export interface SectionNavProps {
  active: SectionId;
  onNavigate: (href: string) => void;
}

/**
 * The three section buttons. Equal width, as the sketch specifies. Rendered
 * as links so the URL is the source of truth and middle-click still works.
 */
export function SectionNav({ active, onNavigate }: SectionNavProps) {
  return (
    <nav
      aria-label="Sections"
      className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center"
    >
      {ITEMS.map((item) => {
        const isActive = active === item.id;
        // Clicking the active section returns home, so the nav doubles as a toggle.
        const href = isActive ? hrefFor("home") : hrefFor(item.id);

        return (
          <a
            key={item.id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            onClick={(event) => {
              if (isModifiedClick(event)) return;
              event.preventDefault();
              onNavigate(href);
            }}
            className={cn(
              // Vercel sizing: 36px tall, sized to its label, 6px radius.
              // 44px on touch so the target stays thumb-sized.
              "inline-flex h-11 items-center justify-center rounded-md border px-4 sm:h-9",
              "text-[13px] font-medium",
              "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out",
              isActive
                ? "border-gray-900 bg-gray-900 text-white shadow-xs hover:bg-gray-800"
                : "border-line-strong bg-surface text-fg-muted shadow-xs hover:border-gray-400 hover:bg-bg-subtle hover:text-fg",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
