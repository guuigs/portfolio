import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from "lucide-react";
import type { CaseStudy, Content } from "@/lib/content";
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

/* ------------------------------------------------------------- image zoom */

/**
 * Full-screen view of one article image.
 *
 * The article shows every picture inside a fixed ratio box so the column keeps
 * its rhythm, which means a wide mockup sheet lands at column width and its
 * phone screens end up unreadable. This is the escape hatch: same image, no
 * frame, as large as the viewport allows.
 */
function ImageZoom({ src, caption, onClose }: { src: string | null; caption?: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (src && !dialog.open) dialog.showModal();
    else if (!src && dialog.open) dialog.close();
  }, [src]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Fires for Escape and for programmatic closes alike.
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={caption || "Image en grand"}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="
        m-auto max-h-[94dvh] w-[min(84rem,96vw)] overflow-hidden rounded-xl
        border border-line bg-surface p-0 text-fg shadow-lg
        backdrop:bg-gray-900/70 backdrop:backdrop-blur-[3px]
      "
    >
      {src && (
        <div className="relative flex max-h-[94dvh] flex-col">
          <IconButton
            label="Fermer"
            onClick={() => dialogRef.current?.close()}
            className="absolute right-3 top-3 z-10 bg-surface/90 backdrop-blur-sm"
          >
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
          </IconButton>
          <div className="min-h-0 flex-1 overflow-auto bg-bg-subtle p-3 sm:p-6">
            <img src={src} alt={caption ?? ""} className="mx-auto max-w-full" />
          </div>
          {caption && (
            <p className="border-t border-line px-5 py-3 text-[13px] text-fg-subtle">{caption}</p>
          )}
        </div>
      )}
    </dialog>
  );
}

/* ----------------------------------------------------------------- article */

const PROSE = "max-w-prose text-[16px] leading-relaxed text-fg-muted sm:text-[15px]";

/** A paragraph: editable in admin, link-parsed for readers. */
function Prose({
  value,
  path,
  admin,
  setField,
}: {
  value: string;
  path: string;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
}) {
  return admin ? (
    <Editable
      as="p"
      multiline
      admin
      value={value}
      onCommit={(next) => setField(path, next)}
      className={PROSE}
    />
  ) : (
    <RichText value={value} className={PROSE} />
  );
}

/**
 * One narrative section. Every case renders the same four, in the same order.
 * The titles are fixed rather than authored — that is the whole point of
 * moving off free headings, which had produced six different sets across six
 * articles.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-line pt-8">
      <h3 className="overline-sans">{title}</h3>
      {children}
    </section>
  );
}

/** Measured outcomes, when the case has any. */
function Figures({ figures }: { figures: NonNullable<CaseStudy["figures"]> }) {
  return (
    <dl className="mt-2 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
      {figures.map((figure) => (
        <div key={figure.label} className="flex flex-col gap-1 bg-surface p-5">
          <dt className="sr-only">{figure.label}</dt>
          <dd className="flex flex-col gap-1">
            <span className="text-3xl tracking-[-0.04em] text-fg">{figure.value}</span>
            <span className="text-[13px] leading-snug text-fg-muted">{figure.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Gallery({
  images,
  caseIndex,
  admin,
  setField,
  onZoom,
}: {
  images: CaseStudy["images"];
  caseIndex: number;
  admin: boolean;
  setField: (path: string, value: unknown) => void;
  onZoom: (image: { src: string; caption?: string }) => void;
}) {
  if (images.length === 0) return null;

  return (
    <div className="flex flex-col gap-7 border-t border-line pt-8">
      {images.map((image, i) => (
        <figure key={i} className="flex flex-col gap-3">
          {/* A fixed ratio box reserves the exact space before decode — no
              layout shift. Most assets are 4:3; anything else declares its own
              ratio rather than being cropped into the house format. */}
          <button
            type="button"
            onClick={() => onZoom({ src: image.value, caption: image.caption })}
            aria-label={image.caption ? `Agrandir : ${image.caption}` : "Agrandir l’image"}
            className="
              group relative block w-full cursor-zoom-in overflow-hidden rounded-lg
              border border-line bg-bg-subtle
              transition-colors duration-150 ease-out hover:border-line-strong
            "
            style={{ aspectRatio: image.ratio ?? "4 / 3" }}
          >
            <img
              src={image.value}
              alt={image.caption}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
            <span
              aria-hidden="true"
              className="
                pointer-events-none absolute right-3 top-3 flex size-8 items-center
                justify-center rounded-md border border-line bg-surface/90 text-fg-subtle
                opacity-0 backdrop-blur-sm transition-opacity duration-150 ease-out
                group-hover:opacity-100 group-focus-visible:opacity-100
              "
            >
              <Maximize2 size={14} strokeWidth={1.75} />
            </span>
          </button>
          <Editable
            as="figcaption"
            admin={admin}
            value={image.caption}
            onCommit={(value) => setField(`cases.${caseIndex}.images.${i}.caption`, value)}
            className="text-[14px] text-fg-subtle sm:text-[13px]"
          />
        </figure>
      ))}
    </div>
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
  const [zoom, setZoom] = useState<{ src: string; caption?: string } | null>(null);

  const closeZoom = useCallback(() => setZoom(null), []);

  // Switching case while an image is open would leave the dialog showing a
  // picture that no longer belongs to the article on screen.
  useEffect(() => {
    setZoom(null);
  }, [activeId]);

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

      {/* Same skeleton for every case: en-tête, fiche, contexte, problème,
          approche, résultat, chiffres, galerie, liens. Only the last three are
          conditional, and only because they are genuinely optional. */}
      <article className="gutter-x mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-5">
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

          <Editable
            as="p"
            multiline
            admin={admin}
            value={current.summary}
            onCommit={(value) => setField(`cases.${index}.summary`, value)}
            className="max-w-prose text-balance text-[18px] leading-relaxed text-fg-muted sm:text-[17px]"
          />

          <dl className="mt-1 flex flex-col gap-2 border-t border-line pt-5">
            {[
              ["rôle", current.role as React.ReactNode],
              ["contexte", current.client],
              ["période", current.date],
              [
                "livrables",
                <span className="flex flex-col gap-0.5">
                  {current.deliverables.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </span>,
              ],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                <dt className="overline sm:w-24 sm:shrink-0 sm:pt-[3px]">{label}</dt>
                <dd className="min-w-0 text-[14px] leading-snug text-fg-muted sm:text-[13px]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <Section title="le contexte">
          <Prose
            value={current.context}
            path={`cases.${index}.context`}
            admin={admin}
            setField={setField}
          />
        </Section>

        <Section title="le problème">
          <Prose
            value={current.problem}
            path={`cases.${index}.problem`}
            admin={admin}
            setField={setField}
          />
        </Section>

        <Section title="l’approche">
          <ol className="flex max-w-prose flex-col gap-3">
            {current.approach.map((step, i) => (
              <li
                key={i}
                className="flex gap-3 text-[16px] leading-relaxed text-fg-muted sm:text-[15px]"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 w-5 shrink-0 font-mono text-[13px] text-fg-faint"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="le résultat">
          <Prose
            value={current.result}
            path={`cases.${index}.result`}
            admin={admin}
            setField={setField}
          />
          {current.figures && current.figures.length > 0 && (
            <Figures figures={current.figures} />
          )}
        </Section>

        <Gallery
          images={current.images}
          caseIndex={index}
          admin={admin}
          setField={setField}
          onZoom={setZoom}
        />

        {current.links && current.links.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-line pt-8">
            {current.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="
                  group inline-flex h-11 items-center gap-1.5 rounded-md border
                  border-line-strong bg-surface px-4 text-sm font-medium
                  transition-[background-color,border-color] duration-150 ease-out
                  hover:border-gray-400 hover:bg-bg-subtle sm:h-10
                "
              >
                {link.label}
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="transition-transform duration-150 ease-out group-hover:translate-x-px group-hover:-translate-y-px"
                />
              </a>
            ))}
          </div>
        )}
      </article>

      <ImageZoom src={zoom?.src ?? null} caption={zoom?.caption} onClose={closeZoom} />
    </section>
  );
}
