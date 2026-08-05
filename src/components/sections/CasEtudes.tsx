import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Block, CaseStudy, Content } from "@/lib/content";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { Editable } from "@/components/cms/Editable";

export interface CasEtudesProps {
  content: Content;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
  activeId: string;
  onSelect: (caseId: string) => void;
}

function ArticleBlock({
  block,
  caseIndex,
  blockIndex,
  admin,
  setField,
}: {
  block: Block;
  caseIndex: number;
  blockIndex: number;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
}) {
  const path = `cases.${caseIndex}.blocks.${blockIndex}`;

  if (block.type === "image") {
    return (
      <figure className="flex flex-col gap-3">
        {/* The case-study assets are all 1024×768, so a 4:3 box reserves the
            exact space before decode — no layout shift, no cropping. */}
        <div className="aspect-4/3 overflow-hidden rounded-lg border border-line bg-bg-subtle">
          <img
            src={block.value}
            alt={block.caption ?? ""}
            width={1024}
            height={768}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>
        {block.caption && (
          <figcaption className="text-[13px] text-fg-subtle">{block.caption}</figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "list") {
    return (
      <div className="flex flex-col gap-3">
        {block.intro && <p className="text-[15px] text-fg-muted">{block.intro}</p>}
        <ul className="flex flex-col gap-2">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-3 text-[15px] leading-relaxed text-fg-muted">
              <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-fg-subtle" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.type === "link") {
    return (
      <a
        href={block.href}
        target={block.href.startsWith("http") ? "_blank" : undefined}
        rel={block.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="
          group inline-flex w-fit items-center gap-1.5 rounded-md border border-line-strong
          bg-surface px-4 py-2.5 text-sm font-medium
          transition-[background-color,border-color] duration-150 ease-out
          hover:border-gray-400 hover:bg-bg-subtle
        "
      >
        {block.label}
        <ArrowUpRight
          size={15}
          strokeWidth={1.75}
          aria-hidden="true"
          className="transition-transform duration-150 ease-out group-hover:translate-x-px group-hover:-translate-y-px"
        />
      </a>
    );
  }

  return (
    <Editable
      as="p"
      multiline
      admin={admin}
      value={block.value}
      onCommit={(value) => setField(`${path}.value`, value)}
      className="max-w-prose text-[15px] leading-relaxed text-fg-muted"
    />
  );
}

export function CasEtudes({ content, admin, setField, activeId, onSelect }: CasEtudesProps) {
  const { cases } = content;
  const index = Math.max(
    0,
    cases.findIndex((study) => study.id === activeId),
  );
  const current: CaseStudy | undefined = cases[index];
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the selected thumbnail in view when navigating with the arrows.
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  if (!current) return null;

  const step = (delta: number) => {
    const next = cases[(index + delta + cases.length) % cases.length];
    onSelect(next.id);
  };

  return (
    <section aria-label="Cas d’études" className="flex flex-col gap-12">
      {/* Thumbnail strip — natively swipeable, with arrows for pointer users. */}
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 lg:px-10">
        <IconButton label="Cas d’étude précédent" onClick={() => step(-1)} className="hidden sm:inline-flex">
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        </IconButton>

        <div ref={stripRef} className="no-scrollbar -mx-1 flex flex-1 gap-3 overflow-x-auto px-1 py-1">
          {cases.map((study) => {
            const isActive = study.id === current.id;
            return (
              <button
                key={study.id}
                type="button"
                data-active={isActive}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(study.id)}
                className={cn(
                  "group relative w-36 shrink-0 overflow-hidden rounded-lg border text-left",
                  "transition-[border-color,opacity] duration-200 ease-out",
                  isActive
                    ? "border-gray-900 opacity-100"
                    : "border-line opacity-60 hover:border-line-strong hover:opacity-100",
                )}
              >
                <div className="aspect-4/3 overflow-hidden bg-bg-subtle">
                  <img
                    src={study.thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
                <span className="block truncate border-t border-line bg-surface px-2 py-1.5 text-[12px] font-medium">
                  {study.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        <IconButton label="Cas d’étude suivant" onClick={() => step(1)} className="hidden sm:inline-flex">
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </IconButton>
      </div>

      {/* Article */}
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-line pb-8">
          <div className="flex items-center gap-3">
            <time className="font-mono text-[12px] tracking-tight text-fg-faint">
              {current.date}
            </time>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </div>
          <Editable
            as="h2"
            admin={admin}
            value={current.title}
            onCommit={(value) => setField(`cases.${index}.title`, value)}
            className="text-3xl tracking-[-0.035em] sm:text-4xl"
          />
        </header>

        <div className="flex flex-col gap-8">
          {current.blocks.map((block, blockIndex) => (
            <ArticleBlock
              key={blockIndex}
              block={block}
              caseIndex={index}
              blockIndex={blockIndex}
              admin={admin}
              setField={setField}
            />
          ))}
        </div>
      </article>
    </section>
  );
}
