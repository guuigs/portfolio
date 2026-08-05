import { useEffect, useRef, useState } from "react";
import { Download, Plus, RotateCcw, Trash2, X } from "lucide-react";
import type { ContentStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export interface AdminDrawerProps {
  store: ContentStore;
  onClose: () => void;
}

function Field({
  label,
  value,
  onCommit,
  multiline = false,
}: {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  multiline?: boolean;
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
          rows={4}
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
    </label>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-line" open>
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

export function AdminDrawer({ store, onClose }: AdminDrawerProps) {
  const { content, setField, removeItem, reset, exportJSON } = store;
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
    <>
      {/* Deliberately NOT a modal: admin is an editing mode, so the page
          behind stays fully interactive for inline edits. No blocking scrim. */}
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
            <span className="text-sm font-medium">Contenu du site</span>
            <span className="font-mono text-[11px] text-fg-subtle">
              sauvegarde automatique · locale
            </span>
          </div>
          <IconButton label="Fermer l’administration" onClick={onClose}>
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
          </IconButton>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5">
          <Section title="Profil">
            <Field
              label="nom"
              value={content.profile.name}
              onCommit={(value) => setField("profile.name", value)}
            />
            <Field
              label="rôle"
              value={content.profile.role}
              onCommit={(value) => setField("profile.role", value)}
            />
            <Field
              label="titre principal"
              value={content.profile.heroTitle}
              onCommit={(value) => setField("profile.heroTitle", value)}
            />
            <Field
              label="introduction"
              multiline
              value={content.profile.heroIntro}
              onCommit={(value) => setField("profile.heroIntro", value)}
            />
            <Field
              label="visuel d’accueil (url)"
              value={content.profile.heroImage}
              onCommit={(value) => setField("profile.heroImage", value)}
            />
          </Section>

          <Section title="Réseaux">
            <Field
              label="cv"
              value={content.socials.cv}
              onCommit={(value) => setField("socials.cv", value)}
            />
            <Field
              label="linkedin"
              value={content.socials.linkedin}
              onCommit={(value) => setField("socials.linkedin", value)}
            />
            <Field
              label="github"
              value={content.socials.github}
              onCommit={(value) => setField("socials.github", value)}
            />
            <Field
              label="mail"
              value={content.socials.mail}
              onCommit={(value) => setField("socials.mail", value)}
            />
          </Section>

          <Section title={`Compétences · ${content.skills.length}`}>
            {content.skills.map((skill, index) => (
              <div key={skill.id} className="flex flex-col gap-3 rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-medium">{skill.title}</span>
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
              </div>
            ))}
          </Section>

          <Section title={`Cas d’études · ${content.cases.length}`}>
            {content.cases.map((study, index) => (
              <div key={study.id} className="flex flex-col gap-3 rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-medium">{study.shortTitle}</span>
                  <DeleteButton
                    what={study.shortTitle}
                    onConfirm={() => removeItem("cases", index)}
                  />
                </div>
                <Field
                  label="titre"
                  value={study.title}
                  onCommit={(value) => setField(`cases.${index}.title`, value)}
                />
                <Field
                  label="titre court"
                  value={study.shortTitle}
                  onCommit={(value) => setField(`cases.${index}.shortTitle`, value)}
                />
                <Field
                  label="date"
                  value={study.date}
                  onCommit={(value) => setField(`cases.${index}.date`, value)}
                />
                <Field
                  label="vignette (url)"
                  value={study.thumb}
                  onCommit={(value) => setField(`cases.${index}.thumb`, value)}
                />
              </div>
            ))}
          </Section>

          <Section title={`Coups de cœur · ${content.likes.length}`}>
            {content.likes.map((like, index) => (
              <div key={like.id} className="flex flex-col gap-3 rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-medium">{like.title}</span>
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
                  label="date"
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
              </div>
            ))}
          </Section>
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
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

          <p aria-live="polite" className="w-full font-mono text-[11px] text-fg-subtle">
            {confirmingReset
              ? "Tout le contenu modifié sera perdu."
              : "Ctrl/⌘ + A pour fermer"}
          </p>
        </footer>
      </aside>
    </>
  );
}
