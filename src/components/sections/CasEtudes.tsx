import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Block, CaseStudy, Content } from "@/lib/content";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { RichText } from "@/components/ui/RichText";
import { Editable } from "@/components/cms/Editable";

export interface CasEtudesProps {
  content: Content;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
  activeId: string;
  onSelect: (caseId: string) => void;
}

/* ----------------------------------------------------------------- article */

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
        {(block.caption || admin) && (
          <Editable
            as="figcaption"
            admin={admin}
            value={block.caption ?? ""}
            onCommit={(value) => setField(`${path}.caption`, value)}
            className="text-[14px] text-fg-subtle sm:text-[13px]"
          />
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

  const proseClass =
    "max-w-prose text-[16px] leading-relaxed text-fg-muted sm:text-[15px]";

  // In admin the raw string is edited, brackets and all; readers get the
  // parsed links. Same field, two renderings.
  return admin ? (
    <Editable
      as="p"
      multiline
      admin
      value={block.value}
      onCommit={(value) => setField(`${path}.value`, value)}
      className={proseClass}
    />
  ) : (
    <RichText value={block.value} className={proseClass} />
  );
}

/* ---------------------------------------------------------------- carousel */

interface Metrics {
  activeW: number;
  smallW: number;
  gap: number;
  /** How many slots to render on each side of the active one. */
  reach: number;
}

const RATIO = 3 / 4; // thumbnails are 4:3

function measure(width: number): Metrics {
  const activeW = Math.round(Math.min(Math.max(width * 0.26, 190), 380));
  const smallW = activeW / 3;
  const gap = 14;
  // Enough slots to run past both edges, so the strip never shows its end.
  const half = width / 2 + smallW;
  const stride = smallW + gap;
  const reach = Math.max(2, Math.ceil((half - activeW / 2 - gap) / stride) + 1);
  return { activeW, smallW, gap, reach };
}

/** Centre-to-centre offset of the slot `k` places from the active one. */
function centerFor(k: number, m: Metrics): number {
  if (k === 0) return 0;
  const sign = Math.sign(k);
  const steps = Math.abs(k);
  const first = m.activeW / 2 + m.gap + m.smallW / 2;
  return sign * (first + (steps - 1) * (m.smallW + m.gap));
}

/**
 * Full-bleed thumbnail carousel: the selected case sits dead centre at three
 * times the size of its neighbours, and the strip wraps, so there is no first
 * or last item.
 *
 * Slots are absolutely positioned and moved with `transform` alone — width
 * and left are layout properties and animating them would force a reflow on
 * every frame. Each slot keeps the full-size box and the inactive ones are
 * scaled down to a third instead.
 */
function Carousel({
  cases,
  activeIndex,
  onSelect,
  onStep,
}: {
  cases: CaseStudy[];
  activeIndex: number;
  onSelect: (caseId: string) => void;
  onStep: (delta: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<Metrics>(() => measure(1280));
  const swipe = useRef<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new ResizeObserver(([entry]) => {
      setMetrics(measure(entry.contentRect.width));
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const { activeW, reach } = metrics;
  const height = Math.round(activeW * RATIO);

  const slots: { key: string; k: number; study: CaseStudy; duplicate: boolean }[] = [];
  const seen = new Set<string>();
  for (let k = -reach; k <= reach; k += 1) {
    const wrapped = ((activeIndex + k) % cases.length + cases.length) % cases.length;
    const study = cases[wrapped];
    // With few cases a wide viewport shows the same item more than once —
    // that is what "infinite" looks like. Only the first copy is exposed to
    // assistive tech and to the tab order.
    const duplicate = seen.has(study.id);
    seen.add(study.id);
    slots.push({ key: `${k}`, k, study, duplicate });
  }

  return (
    <div
      ref={hostRef}
      role="group"
      aria-label="Cas d’études"
      className="carousel-mask relative w-full touch-pan-y overflow-hidden"
      style={{ height }}
      // The arrows are pointer-only, so without this a phone can just tap the
      // neighbours — a 63px-wide target for the natural gesture on a carousel.
      onPointerDown={(event) => {
        if (event.pointerType === "mouse") return;
        swipe.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        const start = swipe.current;
        swipe.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        // Ignore anything that reads as a vertical scroll rather than a swipe.
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(event.clientY - start.y)) return;
        onStep(dx < 0 ? 1 : -1);
      }}
      onPointerCancel={() => {
        swipe.current = null;
      }}
    >
      {slots.map(({ key, k, study, duplicate }) => {
        const isActive = k === 0;
        return (
          <button
            key={key}
            type="button"
            tabIndex={isActive || duplicate ? -1 : 0}
            aria-hidden={duplicate || undefined}
            aria-current={isActive ? "true" : undefined}
            aria-label={study.shortTitle}
            onClick={() => onSelect(study.id)}
            className={cn(
              "absolute top-0 overflow-hidden rounded-lg border bg-bg-subtle",
              "transition-[transform,opacity,border-color] duration-500 ease-out-quint",
              "motion-reduce:transition-none",
              isActive
                ? "z-10 border-line-strong opacity-100 shadow-md"
                : "z-0 border-line opacity-55 hover:opacity-90",
            )}
            style={{
              width: activeW,
              height,
              left: "50%",
              marginLeft: -activeW / 2,
              transform: `translate3d(${centerFor(k, metrics)}px, 0, 0) scale(${isActive ? 1 : 1 / 3})`,
            }}
          >
            <img
              src={study.thumb}
              alt=""
              loading={Math.abs(k) <= 1 ? "eager" : "lazy"}
              decoding="async"
              className="size-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ export */

export function CasEtudes({ content, admin, setField, activeId, onSelect }: CasEtudesProps) {
  const { cases } = content;
  const index = Math.max(0, cases.findIndex((study) => study.id === activeId));
  const current: CaseStudy | undefined = cases[index];

  const step = (delta: number) => {
    if (cases.length === 0) return;
    onSelect(cases[(index + delta + cases.length) % cases.length].id);
  };

  // ←/→ walk the carousel, as long as the user isn't typing in the CMS.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || target?.closest("input, textarea, dialog")) return;
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!current) return null;

  return (
    <section aria-label="Cas d’études" className="flex flex-col gap-12">
      <div className="relative">
        <Carousel cases={cases} activeIndex={index} onSelect={onSelect} onStep={step} />

        <IconButton
          label="Cas d’étude précédent"
          onClick={() => step(-1)}
          className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 bg-surface/90 backdrop-blur-sm sm:inline-flex lg:left-8"
        >
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        </IconButton>
        <IconButton
          label="Cas d’étude suivant"
          onClick={() => step(1)}
          className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 bg-surface/90 backdrop-blur-sm sm:inline-flex lg:right-8"
        >
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </IconButton>
      </div>

      <article className="gutter-x mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-line pb-8">
          <div className="flex items-center gap-3">
            <time className="font-mono text-[13px] tracking-tight text-fg-faint sm:text-[12px]">
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
