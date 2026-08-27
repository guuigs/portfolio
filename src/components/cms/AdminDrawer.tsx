import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  GripVertical,
  Download,
  FileText,
  ImagePlus,
  Plus,
  CloudUpload,
  LogOut,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentStore, type ContentStore } from "@/lib/store";
import { listMedia, removeMedia, uploadFile, type MediaObject } from "@/lib/supabase";
import type { SectionId } from "@/lib/router";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export interface AdminDrawerProps {
  store: ContentStore;
  /** Only this section's fields are shown — the panel follows the page. */
  section: SectionId;
  /** Case study currently on screen, so the panel edits what you're looking at. */
  activeCaseId: string;
  /** Coup de cœur currently open in the lightbox, if any. */
  activeLikeId: string | null;
  onClose: () => void;
}

const SECTION_LABEL: Record<SectionId, string> = {
  home: "Accueil",
  competences: "Compétences",
  "cas-etudes": "Cas d’études",
  "coups-de-coeur": "Coups de cœur",
};

/* ------------------------------------------------------------------ atoms */

function Field({
  label,
  value,
  onCommit,
  multiline = false,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  const [draft, setDraft] = useState(value);

  // Adopt external changes (inline edits on the page, reset, import).
  useEffect(() => setDraft(value), [value]);

  // 16px on small screens: anything smaller makes iOS zoom the viewport on focus.
  const shared =
    "w-full rounded-md border border-line-strong bg-surface px-3 py-2 " +
    "text-[16px] sm:text-sm " +
    "outline-none transition-[border-color] duration-150 focus:border-accent";

  return (
    <label className="flex flex-col gap-1.5">
      <span className="overline">{label}</span>
      {multiline ? (
        <textarea
          value={draft}
          rows={rows}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => onCommit(draft)}
          onKeyDown={(event) => {
            // ⌘/Ctrl+Enter commits from a textarea.
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.currentTarget.blur();
            }
          }}
          className={`${shared} resize-y leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          value={draft}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => onCommit(draft)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className={shared}
        />
      )}
      {hint && <span className="text-[11px] leading-snug text-fg-faint">{hint}</span>}
    </label>
  );
}

/**
 * A URL field with an upload shortcut.
 *
 * Typing a URL still works — that is how the bundled assets stay reachable —
 * but uploading pushes the file to Supabase Storage and writes back a public
 * URL that survives a rebuild, unlike Vite's hashed asset names.
 *
 * `accept` is what makes this usable for the CV: the upload itself was always
 * type-agnostic, only the picker was pinned to images. Anything that is not an
 * image previews as a named document rather than a broken thumbnail.
 */
function FileField({
  label,
  value,
  onCommit,
  accept = "image/*",
  hint,
}: {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  accept?: string;
  hint?: string;
}) {
  const { remoteEnabled, adminEmail } = useContentStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canUpload = remoteEnabled && adminEmail !== null;

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onCommit(await uploadFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // Query strings and Storage paths both end in the real extension, so a
  // suffix test is enough here and avoids a HEAD request just to draw a chip.
  const isImage = /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(value);

  return (
    <div className="flex flex-col gap-2">
      <Field label={label} value={value} onCommit={onCommit} />

      <div className="flex items-center gap-2">
        {value &&
          (isImage ? (
            <img
              src={value}
              alt=""
              className="size-10 shrink-0 rounded border border-line object-cover"
            />
          ) : (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex min-w-0 items-center gap-1.5 rounded border border-line
                px-2 py-1.5 text-[11px] text-fg-muted
                transition-colors duration-150 ease-out hover:border-line-strong
              "
            >
              <FileText size={13} strokeWidth={1.75} aria-hidden="true" />
              <span className="truncate">
                {decodeURIComponent(value.split("/").pop()?.split("?")[0] ?? value)}
              </span>
            </a>
          ))}

        {canUpload ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="sr-only"
              id={`upload-${label}-${value.slice(-12)}`}
              onChange={(event) => void onPick(event.target.files?.[0])}
            />
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={14} strokeWidth={1.75} aria-hidden="true" />
              {busy ? "envoi…" : "téléverser"}
            </Button>
          </>
        ) : (
          <span className="text-[11px] text-fg-faint">
            {remoteEnabled ? "connectez-vous pour téléverser" : "coller une URL"}
          </span>
        )}
      </div>

      {hint && <p className="text-[11px] leading-snug text-fg-faint">{hint}</p>}
      {error && <p className="text-[11px] text-red-700">{error}</p>}
    </div>
  );
}

/** Two-step delete: destructive actions must be confirmed. */
function DeleteButton({ what, onConfirm }: { what: string; onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);

  // Disarm on its own so a forgotten armed button can't be hit by accident.
  useEffect(() => {
    if (!armed) return;
    const timer = window.setTimeout(() => setArmed(false), 4000);
    return () => window.clearTimeout(timer);
  }, [armed]);

  if (armed) {
    return (
      <span className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md border border-red-600 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-50"
        >
          supprimer
        </button>
        <button
          type="button"
          onClick={() => setArmed(false)}
          className="rounded-md px-2 py-1 text-[11px] text-fg-muted hover:bg-gray-100"
        >
          annuler
        </button>
      </span>
    );
  }

  return (
    <IconButton
      label={`Supprimer ${what}`}
      className="size-8 shrink-0 border-transparent bg-transparent hover:text-red-600 sm:size-8"
      onClick={() => setArmed(true)}
    >
      <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
    </IconButton>
  );
}

function Group({
  title,
  children,
  open = true,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group border-b border-line" open={open}>
      <summary
        className="
          flex cursor-pointer list-none items-center justify-between gap-2 py-3
          text-sm font-medium marker:content-none
        "
      >
        {title}
        <span
          aria-hidden="true"
          className="text-fg-subtle transition-transform duration-150 group-open:rotate-45"
        >
          <Plus size={15} strokeWidth={1.75} />
        </span>
      </summary>
      <div className="flex flex-col gap-4 pb-5 pt-1">{children}</div>
    </details>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line p-3">{children}</div>
  );
}

/* ------------------------------------------------------------ sortable list */

/**
 * Collapsible, reorderable list of collection items.
 *
 * Every row is closed by default and shows only its title, so a collection of
 * twenty-six entries stays legible and the order is visible at a glance. The
 * grip reorders by drag, and the same grip responds to ↑/↓ when focused —
 * a drag with no single-pointer alternative is unusable for anyone who cannot
 * hold and move at once (WCAG 2.5.7).
 *
 * Reordering is disabled while a filter is active: the visible rows are then a
 * subset, and dropping row 2 "onto" row 5 has no defensible meaning in the
 * underlying array.
 */
function SortableList({
  items,
  onReorder,
  openIds,
  onToggle,
  reorderDisabledReason,
}: {
  items: { id: string; title: string; subtitle?: string; body: React.ReactNode }[];
  onReorder: (from: number, to: number) => void;
  openIds: Set<string>;
  onToggle: (id: string) => void;
  reorderDisabledReason?: string;
}) {
  const rowsRef = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const autoScroll = useRef(0);

  // The drawer body scrolls, and a long list does not fit. Without this, a row
  // can only ever be dropped within the current viewport of the panel.
  useEffect(() => {
    if (dragIndex === null) return;
    let frame = 0;
    const step = () => {
      frame = requestAnimationFrame(step);
      if (autoScroll.current === 0) return;
      const scroller = listRef.current?.closest("[data-cms-scroll]");
      scroller?.scrollBy(0, autoScroll.current);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [dragIndex]);

  const locate = (clientY: number) => {
    let found = null as number | null;
    // Rows removed by a filter leave stale entries behind; a detached node
    // still answers getBoundingClientRect, with a zero rect at the origin.
    rowsRef.current.slice(0, items.length).forEach((row, i) => {
      if (!row) return;
      const rect = row.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) found = i;
    });
    return found;
  };

  const endDrag = () => {
    if (dragIndex !== null && overIndex !== null && overIndex !== dragIndex) {
      onReorder(dragIndex, overIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
    autoScroll.current = 0;
  };

  return (
    <ul ref={listRef} className="flex flex-col gap-2">
      {items.map((item, index) => {
        const open = openIds.has(item.id);
        const isDragging = dragIndex === index;
        const isTarget = dragIndex !== null && overIndex === index && !isDragging;

        return (
          <li
            key={item.id}
            ref={(node) => {
              rowsRef.current[index] = node;
            }}
            className={cn(
              "rounded-lg border border-line bg-surface",
              "transition-[opacity,border-color] duration-150",
              isDragging && "opacity-40",
              isTarget && "border-accent",
            )}
          >
            <div className="flex items-center gap-1 p-1.5">
              {reorderDisabledReason ? (
                <span
                  aria-hidden="true"
                  title={reorderDisabledReason}
                  className="flex size-11 shrink-0 items-center justify-center text-gray-300 sm:size-9"
                >
                  <GripVertical size={15} strokeWidth={1.75} />
                </span>
              ) : (
                <button
                  type="button"
                  aria-label={`Réordonner ${item.title}. Flèches haut et bas pour déplacer.`}
                  className="
                    flex size-11 shrink-0 touch-none cursor-grab items-center justify-center
                    rounded-md text-fg-faint transition-colors duration-150
                    hover:bg-bg-subtle hover:text-fg active:cursor-grabbing sm:size-9
                  "
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDragIndex(index);
                    setOverIndex(index);
                  }}
                  onPointerMove={(event) => {
                    if (dragIndex === null) return;
                    const at = locate(event.clientY);
                    if (at !== null) setOverIndex(at);

                    const scroller = listRef.current?.closest("[data-cms-scroll]");
                    if (!scroller) return;
                    const box = scroller.getBoundingClientRect();
                    const margin = 48;
                    if (event.clientY < box.top + margin) autoScroll.current = -8;
                    else if (event.clientY > box.bottom - margin) autoScroll.current = 8;
                    else autoScroll.current = 0;
                  }}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowUp" && index > 0) {
                      event.preventDefault();
                      onReorder(index, index - 1);
                    }
                    if (event.key === "ArrowDown" && index < items.length - 1) {
                      event.preventDefault();
                      onReorder(index, index + 1);
                    }
                  }}
                >
                  <GripVertical size={15} strokeWidth={1.75} aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                aria-expanded={open}
                onClick={() => onToggle(item.id)}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-2 text-left hover:bg-bg-subtle"
              >
                <ChevronRight
                  size={14}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-fg-subtle transition-transform duration-150",
                    open && "rotate-90",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{item.title}</span>
                  {item.subtitle && (
                    <span className="block truncate text-[11px] text-fg-faint">
                      {item.subtitle}
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-fg-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            </div>

            {open && <div className="flex flex-col gap-3 border-t border-line p-3">{item.body}</div>}
          </li>
        );
      })}
    </ul>
  );
}

/** Collapse-all / expand-all switch shown above a sortable list. */
function CollapseBar({
  openCount,
  total,
  onCollapseAll,
  onExpandAll,
  reorderable = true,
}: {
  openCount: number;
  total: number;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  reorderable?: boolean;
}) {
  const allClosed = openCount === 0;
  return (
    <div className="flex flex-col gap-1.5 pb-1">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] whitespace-nowrap text-fg-faint">
          {openCount} / {total} déplié{openCount > 1 ? "s" : ""}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="shrink-0"
          onClick={allClosed ? onExpandAll : onCollapseAll}
        >
          {allClosed ? (
            <>
              <ChevronsUpDown size={14} strokeWidth={1.75} aria-hidden="true" />
              tout déplier
            </>
          ) : (
            <>
              <ChevronsDownUp size={14} strokeWidth={1.75} aria-hidden="true" />
              tout replier
            </>
          )}
        </Button>
      </div>
      {reorderable && (
        // The keyboard route is the accessible one, and nothing on screen
        // hints at it — a grip icon only ever says "drag me".
        <p className="text-[11px] leading-snug text-fg-faint">
          Glissez la poignée pour changer l’ordre, ou ↑ / ↓ au clavier.
        </p>
      )}
    </div>
  );
}

/** Moves one item of a collection and writes the new order back. */
function reorder<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** Open/closed state for one collection, with collapse-all helpers. */
function useCollapse(initial: string[] = []) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(initial));
  const toggle = useCallback((id: string) => {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const collapseAll = useCallback(() => setOpenIds(new Set()), []);
  const expandAll = useCallback((ids: string[]) => setOpenIds(new Set(ids)), []);
  const open = useCallback((id: string) => {
    setOpenIds((current) => (current.has(id) ? current : new Set(current).add(id)));
  }, []);
  return { openIds, toggle, collapseAll, expandAll, open };
}

/* ------------------------------------------------------------------ panels */

function HomePanel({ store }: { store: ContentStore }) {
  const { content, setField } = store;
  const { profile, socials } = content;

  return (
    <>
      <Group title="Hero">
        <Field
          label="titre principal"
          value={profile.heroTitle}
          onCommit={(value) => setField("profile.heroTitle", value)}
        />
        <Field
          label="introduction"
          multiline
          value={profile.heroIntro}
          onCommit={(value) => setField("profile.heroIntro", value)}
        />
        <FileField
          label="visuel d’accueil"
          value={profile.heroImage}
          onCommit={(value) => setField("profile.heroImage", value)}
          accept="image/*"
          hint="PNG, JPG ou GIF animé. Le cadre s’adapte au format du fichier."
        />
      </Group>

      {/* Header and footer live here rather than in their own panel: they are
          global chrome, and the brief asked for them under the home section. */}
      <Group title="En-tête · liens" open={false}>
        <FileField
          label="logo (optionnel)"
          value={profile.logo ?? ""}
          onCommit={(v) => setField("profile.logo", v)}
          accept="image/*"
          hint="Sert à la fois au header et à l’icône d’onglet. Laisser vide pour garder le logo vectoriel. Un GIF marche ; viser ~96 px de haut minimum, et un cadrage proche du carré pour rester lisible en favicon."
        />
        <FileField
          label="cv français (pdf)"
          value={socials.cv}
          onCommit={(v) => setField("socials.cv", v)}
          accept="application/pdf,.pdf"
          hint="Téléverser remplace le CV du bouton « mon cv » sans redéploiement. Publiez ensuite pour que le changement soit visible."
        />
        <FileField
          label="cv anglais (pdf)"
          value={socials.cvEn ?? ""}
          onCommit={(v) => setField("socials.cvEn", v)}
          accept="application/pdf,.pdf"
          hint="Proposé sous « mon cv », au survol. Laisser vide sert le fichier embarqué dans public/pdf/cv-en.pdf."
        />
        <Field
          label="linkedin"
          value={socials.linkedin}
          onCommit={(v) => setField("socials.linkedin", v)}
        />
        <Field
          label="github"
          value={socials.github}
          onCommit={(v) => setField("socials.github", v)}
        />
        <Field label="mail" value={socials.mail} onCommit={(v) => setField("socials.mail", v)} />
      </Group>

      <Group title="Pied de page" open={false}>
        <Field
          label="nom affiché"
          value={profile.name}
          onCommit={(value) => setField("profile.name", value)}
        />
        <Field
          label="accroche — début"
          value={profile.footerName}
          onCommit={(value) => setField("profile.footerName", value)}
        />
        <Field
          label="accroche — suite"
          value={profile.footerLine}
          onCommit={(value) => setField("profile.footerLine", value)}
        />
        <Field
          label="paragraphe"
          multiline
          rows={6}
          value={profile.footerBody}
          onCommit={(value) => setField("profile.footerBody", value)}
          hint="Les liens s’écrivent [texte affiché](https://url)."
        />
      </Group>
    </>
  );
}

function CompetencesPanel({ store }: { store: ContentStore }) {
  const { content, setField, removeItem, addItem } = store;
  const { openIds, toggle, collapseAll, expandAll } = useCollapse();
  const ids = content.skills.map((skill) => skill.id);

  return (
    <Group title={`Compétences · ${content.skills.length}`}>
      <CollapseBar
        openCount={openIds.size}
        total={content.skills.length}
        onCollapseAll={collapseAll}
        onExpandAll={() => expandAll(ids)}
      />

      <SortableList
        openIds={openIds}
        onToggle={toggle}
        onReorder={(from, to) => setField("skills", reorder(content.skills, from, to))}
        items={content.skills.map((skill, index) => ({
          id: skill.id,
          title: skill.title,
          subtitle: `${skill.stack.length} outils · ${skill.cases.length} cas`,
          body: (
            <>
              <div className="flex items-center justify-end">
                <DeleteButton
                  what={skill.title}
                  onConfirm={() => removeItem("skills", index)}
                />
              </div>
              <Field
                label="titre"
                value={skill.title}
                onCommit={(value) => setField(`skills.${index}.title`, value)}
              />
              <Field
                label="description"
                multiline
                value={skill.description}
                onCommit={(value) => setField(`skills.${index}.description`, value)}
              />
              <Field
                label="stack (séparée par des virgules)"
                value={skill.stack.join(", ")}
                onCommit={(value) =>
                  setField(
                    `skills.${index}.stack`,
                    value.split(",").map((item) => item.trim()).filter(Boolean),
                  )
                }
              />
              <Field
                label="cas d’études liés (identifiants, virgules)"
                value={skill.cases.join(", ")}
                onCommit={(value) =>
                  setField(
                    `skills.${index}.cases`,
                    value.split(",").map((item) => item.trim()).filter(Boolean),
                  )
                }
                hint={`Disponibles : ${content.cases.map((c) => c.id).join(", ")}`}
              />
            </>
          ),
        }))}
      />

      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          addItem("skills", {
            id: `competence-${Date.now()}`,
            title: "Nouvelle compétence",
            description: "",
            stack: [],
            cases: [],
          })
        }
      >
        <Plus size={14} strokeWidth={1.75} aria-hidden="true" />
        ajouter une compétence
      </Button>
    </Group>
  );
}

/** Editor for one article block. */
/** Edits a list of short strings, one per line. */
function ListField({
  label,
  items,
  onCommit,
  hint,
}: {
  label: string;
  items: string[];
  onCommit: (items: string[]) => void;
  hint?: string;
}) {
  return (
    <Field
      label={label}
      multiline
      rows={Math.min(Math.max(items.length + 1, 3), 9)}
      value={items.join("\n")}
      hint={hint}
      onCommit={(value) =>
        onCommit(value.split("\n").map((item) => item.trim()).filter(Boolean))
      }
    />
  );
}

/**
 * Editor for one case study.
 *
 * Mirrors the article one-for-one: the same sections, in the same order, with
 * no way to add or reorder them. That constraint is the feature — free blocks
 * had let six articles drift into six different shapes.
 */
/**
 * The editor for one case study.
 *
 * Mirrors the article one-for-one: the same sections, in the same order, with
 * no way to add or reorder them. That constraint is the feature — free blocks
 * had let six articles drift into six different shapes.
 */
function CaseEditor({
  store,
  index,
}: {
  store: ContentStore;
  index: number;
}) {
  const { content, setField, removeItem } = store;
  const study = content.cases[index];
  if (!study) return null;

  const at = (field: string) => `cases.${index}.${field}`;
  const links = study.links ?? [];
  const figures = study.figures ?? [];

  return (
    <>
      <div className="flex items-center justify-end">
        <DeleteButton what={study.shortTitle} onConfirm={() => removeItem("cases", index)} />
      </div>

      <Group title="En-tête">
        <Field label="titre" value={study.title} onCommit={(v) => setField(at("title"), v)} />
        <Field
          label="titre court"
          value={study.shortTitle}
          onCommit={(v) => setField(at("shortTitle"), v)}
          hint="Affiché sous les vignettes des compétences."
        />
        <Field
          label="résumé"
          multiline
          rows={3}
          value={study.summary}
          onCommit={(v) => setField(at("summary"), v)}
          hint="Une ou deux phrases sous le titre, pour quelqu’un qui survole."
        />
        <FileField
          label="vignette"
          value={study.thumb}
          onCommit={(v) => setField(at("thumb"), v)}
        />
      </Group>

      <Group title="Fiche" open={false}>
        <Field label="rôle" value={study.role} onCommit={(v) => setField(at("role"), v)} />
        <Field
          label="contexte"
          value={study.client}
          onCommit={(v) => setField(at("client"), v)}
          hint="Client, employeur ou cadre du projet."
        />
        <Field label="période" value={study.date} onCommit={(v) => setField(at("date"), v)} />
        <ListField
          label="livrables (un par ligne)"
          items={study.deliverables}
          onCommit={(items) => setField(at("deliverables"), items)}
        />
      </Group>

      <Group title="Récit" open={false}>
        <Field
          label="le contexte"
          multiline
          rows={5}
          value={study.context}
          onCommit={(v) => setField(at("context"), v)}
          hint="La situation de départ. Les liens s’écrivent [texte](url)."
        />
        <Field
          label="le problème"
          multiline
          rows={5}
          value={study.problem}
          onCommit={(v) => setField(at("problem"), v)}
          hint="La friction réelle, pas la commande."
        />
        <ListField
          label="l’approche (une action par ligne)"
          items={study.approach}
          onCommit={(items) => setField(at("approach"), items)}
          hint="Numérotées automatiquement dans l’article."
        />
        <Field
          label="le résultat"
          multiline
          rows={5}
          value={study.result}
          onCommit={(v) => setField(at("result"), v)}
        />
      </Group>

      <Group title={`Chiffres clés · ${figures.length}`} open={false}>
        <p className="text-[12px] leading-snug text-fg-faint">
          À laisser vide si le projet n’a pas de mesure. Un chiffre inventé se
          voit, et décrédibilise les autres.
        </p>
        {figures.map((figure, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between gap-2">
              <span className="overline">chiffre {i + 1}</span>
              <DeleteButton
                what="ce chiffre"
                onConfirm={() => setField(at("figures"), figures.filter((_, j) => j !== i))}
              />
            </div>
            <Field
              label="valeur"
              value={figure.value}
              onCommit={(v) => setField(at(`figures.${i}.value`), v)}
            />
            <Field
              label="libellé"
              value={figure.label}
              onCommit={(v) => setField(at(`figures.${i}.label`), v)}
            />
          </Card>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setField(at("figures"), [...figures, { value: "", label: "" }])}
        >
          <Plus size={14} strokeWidth={1.75} aria-hidden="true" />
          ajouter un chiffre
        </Button>
      </Group>

      <Group title={`Images · ${study.images.length}`} open={false}>
        {study.images.map((image, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between gap-2">
              <span className="overline">image {i + 1}</span>
              <span className="flex items-center">
                <IconButton
                  label="Monter l’image"
                  disabled={i === 0}
                  className="size-8 border-transparent bg-transparent disabled:opacity-30 sm:size-8"
                  onClick={() => setField(at("images"), reorder(study.images, i, i - 1))}
                >
                  <ArrowUp size={14} strokeWidth={1.75} aria-hidden="true" />
                </IconButton>
                <IconButton
                  label="Descendre l’image"
                  disabled={i === study.images.length - 1}
                  className="size-8 border-transparent bg-transparent disabled:opacity-30 sm:size-8"
                  onClick={() => setField(at("images"), reorder(study.images, i, i + 1))}
                >
                  <ArrowDown size={14} strokeWidth={1.75} aria-hidden="true" />
                </IconButton>
                <DeleteButton
                  what="cette image"
                  onConfirm={() =>
                    setField(at("images"), study.images.filter((_, j) => j !== i))
                  }
                />
              </span>
            </div>
            <FileField
              label="fichier"
              value={image.value}
              onCommit={(v) => setField(at(`images.${i}.value`), v)}
            />
            <Field
              label="légende"
              value={image.caption}
              onCommit={(v) => setField(at(`images.${i}.caption`), v)}
            />
            <Field
              label="proportions"
              value={image.ratio ?? ""}
              onCommit={(v) => setField(at(`images.${i}.ratio`), v || undefined)}
              hint="Vide = cadre 4/3. Sinon « 1100 / 577 » pour montrer l’image entière."
            />
          </Card>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setField(at("images"), [...study.images, { value: "", caption: "" }])}
        >
          <ImagePlus size={14} strokeWidth={1.75} aria-hidden="true" />
          ajouter une image
        </Button>
      </Group>

      <Group title={`Liens · ${links.length}`} open={false}>
        {links.map((link, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between gap-2">
              <span className="overline">lien {i + 1}</span>
              <DeleteButton
                what="ce lien"
                onConfirm={() => setField(at("links"), links.filter((_, j) => j !== i))}
              />
            </div>
            <Field
              label="libellé"
              value={link.label}
              onCommit={(v) => setField(at(`links.${i}.label`), v)}
            />
            <Field
              label="url"
              value={link.href}
              onCommit={(v) => setField(at(`links.${i}.href`), v)}
            />
          </Card>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setField(at("links"), [...links, { href: "", label: "" }])}
        >
          <Plus size={14} strokeWidth={1.75} aria-hidden="true" />
          ajouter un lien
        </Button>
      </Group>
    </>
  );
}

/**
 * All case studies, in the order the carousel shows them.
 *
 * The panel used to expose only the case selected in the carousel, which made
 * the running order invisible and unchangeable from here. Listing them all —
 * collapsed, with the current one open — keeps the focus without hiding the
 * sequence.
 */
function CasEtudesPanel({ store, activeId }: { store: ContentStore; activeId: string }) {
  const { content, setField, addItem } = store;
  const { openIds, toggle, collapseAll, expandAll, open } = useCollapse(activeId ? [activeId] : []);
  const ids = content.cases.map((study) => study.id);

  // Stepping through the carousel used to change what the panel showed; now
  // that it lists every case, it opens the one on screen instead.
  useEffect(() => {
    if (activeId) open(activeId);
  }, [activeId, open]);

  return (
    <Group title={`Cas d’études · ${content.cases.length}`}>
      <p className="text-[12px] leading-snug text-fg-faint">
        L’ordre ci-dessous est celui du carrousel.
      </p>

      <CollapseBar
        openCount={openIds.size}
        total={content.cases.length}
        onCollapseAll={collapseAll}
        onExpandAll={() => expandAll(ids)}
      />

      <SortableList
        openIds={openIds}
        onToggle={toggle}
        onReorder={(from, to) => setField("cases", reorder(content.cases, from, to))}
        items={content.cases.map((study, index) => ({
          id: study.id,
          title: study.shortTitle,
          subtitle: `${study.date}${study.id === activeId ? " · affiché" : ""}`,
          body: <CaseEditor store={store} index={index} />,
        }))}
      />

      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          addItem("cases", {
            id: `cas-${Date.now()}`,
            title: "Nouveau cas d’études",
            shortTitle: "Nouveau cas",
            date: String(new Date().getFullYear()),
            thumb: "",
            summary: "",
            role: "",
            client: "",
            deliverables: [],
            context: "",
            problem: "",
            approach: [],
            result: "",
            images: [],
          })
        }
      >
        <Plus size={14} strokeWidth={1.75} aria-hidden="true" />
        ajouter un cas d’études
      </Button>
    </Group>
  );
}

function CoupsDeCoeurPanel({ store, activeId }: { store: ContentStore; activeId: string | null }) {
  const { content, setField, removeItem, addItem } = store;
  const [query, setQuery] = useState("");
  const { openIds, toggle, collapseAll, expandAll } = useCollapse(activeId ? [activeId] : []);

  const filtering = query.trim().length > 0;

  // 26 entries is too many to scroll past to reach one, so the list can be
  // filtered — but a filtered list cannot be reordered: the rows are then a
  // subset and dropping one "onto" another says nothing about the real array.
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return content.likes
      .map((like, index) => ({ like, index }))
      .filter(
        ({ like }) =>
          !needle ||
          like.title.toLowerCase().includes(needle) ||
          like.author.toLowerCase().includes(needle) ||
          like.kind.toLowerCase().includes(needle),
      );
  }, [content.likes, query]);

  return (
    <Group title={`Coups de cœur · ${content.likes.length}`}>
      <label className="flex flex-col gap-1.5">
        <span className="overline">rechercher</span>
        <input
          type="search"
          value={query}
          placeholder="titre, auteur, type…"
          onChange={(event) => setQuery(event.target.value)}
          className="
            w-full rounded-md border border-line-strong bg-surface px-3 py-2
            text-[16px] outline-none transition-[border-color] duration-150
            focus:border-accent sm:text-sm
          "
        />
      </label>

      <CollapseBar
        openCount={openIds.size}
        total={shown.length}
        onCollapseAll={collapseAll}
        onExpandAll={() => expandAll(shown.map(({ like }) => like.id))}
        reorderable={!filtering}
      />

      {filtering && (
        <p className="text-[11px] leading-snug text-fg-faint">
          Ordre figé pendant la recherche — videz le champ pour réordonner.
        </p>
      )}

      {shown.length === 0 && (
        <p className="py-4 text-center text-[13px] text-fg-faint">Aucun résultat.</p>
      )}

      <SortableList
        openIds={openIds}
        onToggle={toggle}
        reorderDisabledReason={filtering ? "Videz la recherche pour réordonner" : undefined}
        onReorder={(from, to) => setField("likes", reorder(content.likes, from, to))}
        items={shown.map(({ like, index }) => ({
          id: like.id,
          title: like.title,
          subtitle: `${like.author}${like.kind ? ` · ${like.kind}` : ""}`,
          body: (
            <>
              <div className="flex items-center justify-end">
                <DeleteButton
                  what={like.title}
                  onConfirm={() => removeItem("likes", index)}
                />
              </div>
              <Field
                label="titre"
                value={like.title}
                onCommit={(value) => setField(`likes.${index}.title`, value)}
              />
              <Field
                label="auteur"
                value={like.author}
                onCommit={(value) => setField(`likes.${index}.author`, value)}
              />
              <Field
                label="année"
                value={like.date}
                onCommit={(value) => setField(`likes.${index}.date`, value)}
              />
              <Field
                label="type"
                value={like.kind}
                onCommit={(value) => setField(`likes.${index}.kind`, value)}
              />
              <Field
                label="lien"
                value={like.link}
                onCommit={(value) => setField(`likes.${index}.link`, value)}
              />
              <FileField
                label="visuel"
                value={like.image}
                onCommit={(value) => setField(`likes.${index}.image`, value)}
              />
            </>
          ),
        }))}
      />

      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          addItem("likes", {
            id: `coup-${Date.now()}`,
            title: "Nouveau coup de cœur",
            author: "",
            date: "",
            kind: "",
            link: "",
            image: "",
            ratio: "3 / 4",
          })
        }
      >
        <Plus size={14} strokeWidth={1.75} aria-hidden="true" />
        ajouter un coup de cœur
      </Button>
    </Group>
  );
}

/* ---------------------------------------------------------------- migration */

/** Every dotted path in the content that holds an image URL. */
/** "profile, socials et likes" — an Oxford-comma-free French enumeration. */
function frenchList(keys: string[]): string {
  const labels: Record<string, string> = {
    profile: "la page d’accueil et le pied de page",
    socials: "les liens",
    likes: "les coups de cœur",
  };
  const parts = keys.map((key) => labels[key] ?? key);
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} et ${parts[parts.length - 1]}`;
}

function imagePaths(content: ContentStore["content"]): { path: string; url: string }[] {
  const found: { path: string; url: string }[] = [];

  if (content.profile.heroImage) {
    found.push({ path: "profile.heroImage", url: content.profile.heroImage });
  }
  // The header logo is uploaded exactly like the hero image and was missing
  // here, so the hosting migration skipped it — and the audit below would have
  // called it an orphan. The CV is not in this list on purpose: it lives at a
  // fixed path under public/, which is already stable across builds.
  if (content.profile.logo) {
    found.push({ path: "profile.logo", url: content.profile.logo });
  }
  content.cases.forEach((study, i) => {
    if (study.thumb) found.push({ path: `cases.${i}.thumb`, url: study.thumb });
    study.images.forEach((image, j) => {
      if (image.value) found.push({ path: `cases.${i}.images.${j}.value`, url: image.value });
    });
  });
  content.likes.forEach((like, i) => {
    if (like.image) found.push({ path: `likes.${i}.image`, url: like.image });
  });

  return found;
}

/**
 * Moves the images that Vite bundles into Supabase Storage.
 *
 * This has to happen in the browser, not in a Node script: the URLs in the
 * content are Vite's hashed asset paths, which only resolve against the
 * running app. Fetching them here turns each one into a blob we can upload,
 * and the resulting Storage URL is stable across rebuilds — which the hashed
 * path is not, and that is precisely why the migration is needed at all.
 */
/** Human-readable byte size, one decimal place past a megabyte. */
function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Inventory of the Storage bucket, against what the content actually points at.
 *
 * Re-uploading the same file does not replace it: `uploadFile` prefixes a
 * timestamp precisely so two files called `logo.png` cannot clobber each other.
 * That is the right call for a live site — an upload never breaks a URL already
 * in use — but it means every re-upload leaves the previous object behind, and
 * nothing in the UI ever showed that.
 *
 * Unreferenced is compared against the draft *and* the published row: a file
 * the online version still uses is not an orphan just because the local draft
 * dropped it, and deleting it would break the live site for everyone else.
 */
function MediaAudit({ store }: { store: ContentStore }) {
  const { content, adminEmail } = store;
  const [items, setItems] = useState<MediaObject[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      setItems(await listMedia());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }, []);

  const referenced = useMemo(() => {
    const urls = new Set<string>();
    for (const { url } of imagePaths(content)) urls.add(url);
    // Les deux CV, sinon l'audit signalerait comme orphelin un PDF bel et bien
    // servi par le menu de l'en-tête — et proposerait de le supprimer.
    if (content.socials.cv) urls.add(content.socials.cv);
    if (content.socials.cvEn) urls.add(content.socials.cvEn);
    return urls;
  }, [content]);

  if (!adminEmail) {
    return (
      <p className="text-[12px] leading-snug text-fg-faint">
        Connectez-vous pour inspecter le bucket.
      </p>
    );
  }

  if (items === null) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-[12px] leading-snug text-fg-faint">
          Chaque téléversement crée un nouvel objet — réimporter la même image ne
          remplace pas l’ancienne, elle s’ajoute.
        </p>
        <Button size="sm" variant="ghost" disabled={busy} onClick={() => void load()}>
          <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
          {busy ? "lecture…" : "inventorier le bucket"}
        </Button>
        {error && <p className="text-[11px] leading-snug text-fg-muted">Échec : {error}</p>}
      </div>
    );
  }

  const orphans = items.filter((item) => !referenced.has(item.url));
  const orphanBytes = orphans.reduce((sum, item) => sum + item.size, 0);
  const total = items.reduce((sum, item) => sum + item.size, 0);

  // Same original filename uploaded more than once — the duplicates, named.
  const byName = new Map<string, MediaObject[]>();
  for (const item of items) {
    byName.set(item.original, [...(byName.get(item.original) ?? []), item]);
  }
  const duplicated = [...byName.entries()]
    .filter(([, group]) => group.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  const purge = async () => {
    setBusy(true);
    setError(null);
    try {
      await removeMedia(orphans.map((item) => item.name));
      setItems(await listMedia());
      setConfirming(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-fg-muted">
        <dt>objets</dt>
        <dd className="text-right text-fg">{items.length}</dd>
        <dt>poids total</dt>
        <dd className="text-right text-fg">{humanSize(total)}</dd>
        <dt>référencés</dt>
        <dd className="text-right text-fg">{items.length - orphans.length}</dd>
        <dt>non référencés</dt>
        <dd className="text-right text-fg">
          {orphans.length} · {humanSize(orphanBytes)}
        </dd>
      </dl>

      {duplicated.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-[11px] leading-snug text-fg-muted">
            {duplicated.length} fichier(s) téléversés plusieurs fois :
          </p>
          <ul className="flex flex-col gap-0.5 font-mono text-[11px] text-fg-faint">
            {duplicated.slice(0, 8).map(([name, group]) => (
              <li key={name} className="flex justify-between gap-2">
                <span className="min-w-0 truncate">{name}</span>
                <span className="shrink-0">×{group.length}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {orphans.length > 0 && (
        <div className="flex flex-col gap-2">
          <ul className="flex flex-wrap gap-1">
            {orphans.slice(0, 24).map((item) => (
              <li key={item.name}>
                <img
                  src={item.url}
                  alt={item.original}
                  title={`${item.original} · ${humanSize(item.size)}`}
                  loading="lazy"
                  className="size-10 rounded border border-line object-cover"
                />
              </li>
            ))}
          </ul>
          {confirming ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-fg-muted">
                Supprimer {orphans.length} objet(s) — définitif.
              </span>
              <Button size="sm" variant="ghost" disabled={busy} onClick={() => void purge()}>
                {busy ? "suppression…" : "confirmer"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                annuler
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setConfirming(true)}>
              <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
              supprimer les {orphans.length} non référencés
            </Button>
          )}
          <p className="text-[11px] leading-snug text-fg-faint">
            Publiez d’abord si votre brouillon touche aux images : la comparaison
            se fait sur ce que vous voyez ici.
          </p>
        </div>
      )}

      {orphans.length === 0 && (
        <p className="text-[12px] leading-snug text-fg-faint">
          Aucun objet inutilisé. Le bucket est propre.
        </p>
      )}

      {error && <p className="text-[11px] leading-snug text-fg-muted">Échec : {error}</p>}

      <Button size="sm" variant="ghost" disabled={busy} onClick={() => void load()}>
        <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
        {busy ? "lecture…" : "recharger l’inventaire"}
      </Button>
    </div>
  );
}

function MigrateImages({ store }: { store: ContentStore }) {
  const { content, setField, adminEmail } = store;
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const pending = imagePaths(content).filter(({ url }) => !url.startsWith("http"));
  if (!adminEmail) return null;

  if (pending.length === 0) {
    return (
      <p className="text-[12px] leading-snug text-fg-faint">
        Toutes les images sont déjà hébergées sur Supabase.
      </p>
    );
  }

  const run = async () => {
    setRunning(true);
    let done = 0;
    let failed = 0;

    for (const { path, url } of pending) {
      setProgress(`${done + failed + 1} / ${pending.length}`);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(String(response.status));
        const blob = await response.blob();
        const name = url.split("/").pop() ?? "image";
        setField(path, await uploadFile(new File([blob], name, { type: blob.type })));
        done += 1;
      } catch {
        failed += 1;
      }
    }

    setProgress(`${done} migrée(s)${failed ? `, ${failed} en échec` : ""}. Pensez à publier.`);
    setRunning(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] leading-snug text-fg-faint">
        {pending.length} image(s) sont encore servies depuis le bundle. Leur URL
        change à chaque déploiement : déplacez-les vers Supabase pour la figer.
      </p>
      <Button size="sm" variant="ghost" disabled={running} onClick={() => void run()}>
        <CloudUpload size={14} strokeWidth={1.75} aria-hidden="true" />
        {running ? `migration… ${progress}` : "migrer les images"}
      </Button>
      {!running && progress && (
        <p aria-live="polite" className="text-[11px] text-fg-muted">
          {progress}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- publication */

/**
 * Sign-in and publish controls.
 *
 * Edits always land in `localStorage` first — that is the draft. Publishing is
 * a separate, deliberate act that writes the document to Supabase, where every
 * visitor reads it. Without a configured project the whole bar collapses to
 * the export button, and the CMS behaves exactly as it did before.
 */
/**
 * Sign-in, shown at the very top of the panel.
 *
 * Not in the footer: signing in is the first thing to do on arrival, and a
 * control that gates everything else has no business below several screens of
 * fields you cannot publish yet.
 */
function SignInPanel({ store }: { store: ContentStore }) {
  const { signIn } = store;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const input =
    "w-full rounded-md border border-line-strong bg-surface px-3 py-2 " +
    "text-[16px] outline-none transition-[border-color] duration-150 " +
    "focus:border-accent sm:text-sm";

  return (
    <form
      className="flex flex-col gap-2 border-b border-line py-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await signIn(email, password);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Connexion</span>
        <span className="text-[12px] leading-snug text-fg-faint">
          Vous pouvez modifier sans être connecté, mais publier demande le
          compte administrateur.
        </span>
      </div>

      <input
        type="email"
        value={email}
        required
        placeholder="adresse"
        autoComplete="username"
        onChange={(event) => setEmail(event.target.value)}
        className={input}
      />
      <input
        type="password"
        value={password}
        required
        placeholder="mot de passe"
        autoComplete="current-password"
        onChange={(event) => setPassword(event.target.value)}
        className={input}
      />
      <Button size="sm" variant="primary" type="submit" disabled={busy}>
        {busy ? "connexion…" : "se connecter"}
      </Button>
      {error && <p className="text-[12px] text-red-700">{error}</p>}
    </form>
  );
}

/** Publish controls, in the footer once signed in. */
function PublishControls({ store }: { store: ContentStore }) {
  const {
    dirty,
    hasDraft,
    loadingRemote,
    neverPublished,
    publishState,
    publishError,
    remoteError,
    staleRemote,
    carriedKeys,
    publish,
    discardDraft,
    signOut,
    adminEmail,
  } = store;

  return (
    <div className="flex w-full flex-col gap-2">
      {staleRemote && (
        <p className="rounded-md border border-line bg-bg-subtle p-2 text-[11px] leading-snug text-fg-muted">
          {carriedKeys.length > 0 ? (
            <>
              La version en ligne a été publiée avec un modèle plus ancien.{" "}
              <strong className="font-medium text-fg">{frenchList(carriedKeys)}</strong> en
              {carriedKeys.length > 1 ? " ont" : " a"} été repris tels quels — vos textes et
              vos images restent en place. Les cas d’études et les compétences viennent de
              cette version du site. Publiez pour aligner les deux.
            </>
          ) : (
            <>
              La version en ligne a été publiée avec un modèle plus ancien et n’a rien pu en
              conserver. Publiez pour la remplacer.
            </>
          )}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="primary"
          disabled={!dirty || loadingRemote || publishState === "publishing"}
          onClick={() => void publish()}
        >
          <CloudUpload size={14} strokeWidth={1.75} aria-hidden="true" />
          {publishState === "publishing" ? "publication…" : "publier"}
        </Button>

        {/* Gated on a real draft, not on `dirty`: migrated content differs from
            the published row without anyone having edited anything, and the
            button would then offer to cancel nothing. */}
        {hasDraft && !neverPublished && (
          <Button size="sm" variant="ghost" onClick={discardDraft}>
            annuler le brouillon
          </Button>
        )}

        <IconButton
          label="Se déconnecter"
          className="ml-auto size-8 border-transparent bg-transparent sm:size-8"
          onClick={() => void signOut()}
        >
          <LogOut size={14} strokeWidth={1.75} aria-hidden="true" />
        </IconButton>
      </div>

      <p aria-live="polite" className="font-mono text-[11px] leading-snug text-fg-subtle">
        {publishState === "error"
          ? `Échec : ${publishError}`
          : publishState === "done"
            ? "Publié. Tout le monde voit cette version."
            : remoteError
              ? `Version en ligne illisible : ${remoteError}. Publication bloquée tant qu’on ne sait pas ce qu’elle contient.`
              : loadingRemote
                ? "Lecture de la version en ligne…"
                : neverPublished
                  ? "Rien n’a encore été publié. Le site sert le contenu embarqué."
                  : staleRemote
                    ? "Contenu repris de la version en ligne — à republier."
                    : dirty
                      ? "Brouillon local non publié."
                    : `En ligne · ${adminEmail}`}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ drawer */

export function AdminDrawer({
  store,
  section,
  activeCaseId,
  activeLikeId,
  onClose,
}: AdminDrawerProps) {
  const { reset, exportJSON } = store;
  const panelRef = useRef<HTMLDivElement>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  // Escape closes, and focus lands inside the panel when it opens.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    /* Deliberately NOT a modal: admin is an editing mode, so the page behind
       stays fully interactive for inline edits. No blocking scrim. */
    <aside
      ref={panelRef}
      role="region"
      aria-label="Administration du contenu"
      tabIndex={-1}
      className="
        fixed inset-y-0 right-0 z-[100] flex w-[min(26rem,100vw)] flex-col
        overscroll-contain border-l border-line bg-bg shadow-lg outline-none
      "
    >
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{SECTION_LABEL[section]}</span>
          <span className="font-mono text-[11px] text-fg-subtle">
            sauvegarde automatique · locale
          </span>
        </div>
        <IconButton label="Fermer l’administration" onClick={onClose}>
          <X size={16} strokeWidth={1.75} aria-hidden="true" />
        </IconButton>
      </header>

      <div data-cms-scroll className="flex-1 overflow-y-auto overscroll-contain px-5">
        {store.remoteEnabled && !store.adminEmail && <SignInPanel store={store} />}

        {section === "home" && <HomePanel store={store} />}
        {section === "competences" && <CompetencesPanel store={store} />}
        {section === "cas-etudes" && (
          <CasEtudesPanel store={store} activeId={activeCaseId} />
        )}
        {section === "coups-de-coeur" && (
          <CoupsDeCoeurPanel store={store} activeId={activeLikeId} />
        )}

        {store.remoteEnabled && (
          <>
            <Group title="Hébergement des images" open={false}>
              <MigrateImages store={store} />
            </Group>
            <Group title="Inventaire des médias" open={false}>
              <MediaAudit store={store} />
            </Group>
          </>
        )}
      </div>

      <footer className="safe-bottom flex flex-wrap items-center gap-2 border-t border-line px-5 pt-4">
        <Button size="sm" onClick={exportJSON}>
          <Download size={14} strokeWidth={1.75} aria-hidden="true" />
          exporter
        </Button>

        {confirmingReset ? (
          <>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                reset();
                setConfirmingReset(false);
              }}
            >
              confirmer
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmingReset(false)}>
              annuler
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setConfirmingReset(true)}>
            <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
            réinitialiser…
          </Button>
        )}

        {confirmingReset && (
          <p aria-live="polite" className="w-full font-mono text-[11px] text-fg-subtle">
            Tout le contenu modifié sera perdu.
          </p>
        )}

        <div className="w-full border-t border-line pt-3">
          {!store.remoteEnabled ? (
            <p className="w-full font-mono text-[11px] leading-snug text-fg-subtle">
              Stockage local uniquement. Renseignez VITE_SUPABASE_URL et
              VITE_SUPABASE_ANON_KEY pour publier en ligne.
            </p>
          ) : store.adminEmail ? (
            <PublishControls store={store} />
          ) : (
            <p className="w-full font-mono text-[11px] leading-snug text-fg-subtle">
              Connectez-vous en haut du panneau pour publier.
            </p>
          )}
        </div>
      </footer>
    </aside>
  );
}
