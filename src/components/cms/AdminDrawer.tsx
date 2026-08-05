import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  ImagePlus,
  Plus,
  CloudUpload,
  LogOut,
  RotateCcw,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import { useContentStore, type ContentStore } from "@/lib/store";
import { uploadImage } from "@/lib/supabase";
import type { Block, CaseStudy } from "@/lib/content";
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
 */
function ImageField({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: string;
  onCommit: (value: string) => void;
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
      onCommit(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Field label={label} value={value} onCommit={onCommit} />

      <div className="flex items-center gap-2">
        {value && (
          <img
            src={value}
            alt=""
            className="size-10 shrink-0 rounded border border-line object-cover"
          />
        )}

        {canUpload ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
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
        <ImageField
          label="visuel d’accueil"
          value={profile.heroImage}
          onCommit={(value) => setField("profile.heroImage", value)}
        />
      </Group>

      {/* Header and footer live here rather than in their own panel: they are
          global chrome, and the brief asked for them under the home section. */}
      <Group title="En-tête · liens" open={false}>
        <Field label="cv" value={socials.cv} onCommit={(v) => setField("socials.cv", v)} />
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

  return (
    <Group title={`Compétences · ${content.skills.length}`}>
      {content.skills.map((skill, index) => (
        <Card key={skill.id}>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-medium">{skill.title}</span>
            <DeleteButton what={skill.title} onConfirm={() => removeItem("skills", index)} />
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
        </Card>
      ))}

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
function BlockEditor({
  block,
  path,
  setField,
  onMove,
  onRemove,
  canMoveUp,
  canMoveDown,
}: {
  block: Block;
  path: string;
  setField: (path: string, value: unknown) => void;
  onMove: (delta: number) => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-1">
        <span className="overline">{block.type}</span>
        <span className="flex items-center">
          <IconButton
            label="Monter le bloc"
            disabled={!canMoveUp}
            className="size-8 border-transparent bg-transparent disabled:opacity-30 sm:size-8"
            onClick={() => onMove(-1)}
          >
            <ArrowUp size={14} strokeWidth={1.75} aria-hidden="true" />
          </IconButton>
          <IconButton
            label="Descendre le bloc"
            disabled={!canMoveDown}
            className="size-8 border-transparent bg-transparent disabled:opacity-30 sm:size-8"
            onClick={() => onMove(1)}
          >
            <ArrowDown size={14} strokeWidth={1.75} aria-hidden="true" />
          </IconButton>
          <DeleteButton what="ce bloc" onConfirm={onRemove} />
        </span>
      </div>

      {block.type === "text" && (
        <Field
          label="texte"
          multiline
          rows={5}
          value={block.value}
          onCommit={(value) => setField(`${path}.value`, value)}
          hint="Les liens s’écrivent [texte affiché](https://url)."
        />
      )}

      {block.type === "image" && (
        <>
          <ImageField
            label="image"
            value={block.value}
            onCommit={(value) => setField(`${path}.value`, value)}
          />
          <Field
            label="légende"
            value={block.caption ?? ""}
            onCommit={(value) => setField(`${path}.caption`, value)}
          />
        </>
      )}

      {block.type === "list" && (
        <>
          <Field
            label="introduction"
            value={block.intro ?? ""}
            onCommit={(value) => setField(`${path}.intro`, value)}
          />
          <Field
            label="éléments (un par ligne)"
            multiline
            rows={5}
            value={block.items.join("\n")}
            onCommit={(value) =>
              setField(
                `${path}.items`,
                value.split("\n").map((item) => item.trim()).filter(Boolean),
              )
            }
          />
        </>
      )}

      {block.type === "link" && (
        <>
          <Field
            label="libellé"
            value={block.label}
            onCommit={(value) => setField(`${path}.label`, value)}
          />
          <Field
            label="url"
            value={block.href}
            onCommit={(value) => setField(`${path}.href`, value)}
          />
        </>
      )}
    </Card>
  );
}

function CasEtudesPanel({ store, activeId }: { store: ContentStore; activeId: string }) {
  const { content, setField, removeItem, addItem } = store;
  const index = Math.max(0, content.cases.findIndex((study) => study.id === activeId));
  const study: CaseStudy | undefined = content.cases[index];

  if (!study) return null;

  const blocks = study.blocks;
  const setBlocks = (next: Block[]) => setField(`cases.${index}.blocks`, next);

  return (
    <>
      <div className="border-b border-line py-3">
        <p className="text-[12px] leading-snug text-fg-faint">
          Vous modifiez <span className="font-medium text-fg">{study.shortTitle}</span>.
          Sélectionnez une autre vignette dans le carrousel pour changer de cas.
        </p>
      </div>

      <Group title="Fiche">
        <div className="flex items-center justify-end">
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
        <ImageField
          label="vignette"
          value={study.thumb}
          onCommit={(value) => setField(`cases.${index}.thumb`, value)}
        />
      </Group>

      <Group title={`Contenu · ${blocks.length} blocs`}>
        {blocks.map((block, blockIndex) => (
          <BlockEditor
            key={blockIndex}
            block={block}
            path={`cases.${index}.blocks.${blockIndex}`}
            setField={setField}
            canMoveUp={blockIndex > 0}
            canMoveDown={blockIndex < blocks.length - 1}
            onMove={(delta) => {
              const next = blocks.slice();
              const target = blockIndex + delta;
              [next[blockIndex], next[target]] = [next[target], next[blockIndex]];
              setBlocks(next);
            }}
            onRemove={() => setBlocks(blocks.filter((_, i) => i !== blockIndex))}
          />
        ))}

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setBlocks([...blocks, { type: "text", value: "" }])}
          >
            <Type size={14} strokeWidth={1.75} aria-hidden="true" />
            texte
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setBlocks([...blocks, { type: "image", value: "", caption: "" }])}
          >
            <ImagePlus size={14} strokeWidth={1.75} aria-hidden="true" />
            image
          </Button>
        </div>
      </Group>

      <Group title="Nouveau cas" open={false}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            addItem("cases", {
              id: `cas-${Date.now()}`,
              title: "Nouveau cas d’étude",
              shortTitle: "Nouveau cas",
              date: String(new Date().getFullYear()),
              thumb: "",
              blocks: [{ type: "text", value: "" }],
            })
          }
        >
          <Plus size={14} strokeWidth={1.75} aria-hidden="true" />
          ajouter un cas d’études
        </Button>
      </Group>
    </>
  );
}

function CoupsDeCoeurPanel({ store, activeId }: { store: ContentStore; activeId: string | null }) {
  const { content, setField, removeItem, addItem } = store;
  const [query, setQuery] = useState("");

  // 26 entries is too many to scroll past to reach one. Filter, and pin the
  // item currently open in the lightbox to the top.
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
      )
      .sort((a, b) => Number(b.like.id === activeId) - Number(a.like.id === activeId));
  }, [content.likes, query, activeId]);

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

      {shown.length === 0 && (
        <p className="py-4 text-center text-[13px] text-fg-faint">Aucun résultat.</p>
      )}

      {shown.map(({ like, index }) => (
        <Card key={like.id}>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-medium">{like.title}</span>
            <DeleteButton what={like.title} onConfirm={() => removeItem("likes", index)} />
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
          <ImageField
            label="visuel"
            value={like.image}
            onCommit={(value) => setField(`likes.${index}.image`, value)}
          />
        </Card>
      ))}

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
function imagePaths(content: ContentStore["content"]): { path: string; url: string }[] {
  const found: { path: string; url: string }[] = [];

  if (content.profile.heroImage) {
    found.push({ path: "profile.heroImage", url: content.profile.heroImage });
  }
  content.cases.forEach((study, i) => {
    if (study.thumb) found.push({ path: `cases.${i}.thumb`, url: study.thumb });
    study.blocks.forEach((block, b) => {
      if (block.type === "image" && block.value) {
        found.push({ path: `cases.${i}.blocks.${b}.value`, url: block.value });
      }
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
        setField(path, await uploadImage(new File([blob], name, { type: blob.type })));
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
function PublishBar({ store }: { store: ContentStore }) {
  const {
    remoteEnabled,
    adminEmail,
    dirty,
    publishState,
    publishError,
    publish,
    discardDraft,
    signIn,
    signOut,
  } = store;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!remoteEnabled) {
    return (
      <p className="w-full font-mono text-[11px] leading-snug text-fg-subtle">
        Stockage local uniquement. Renseignez VITE_SUPABASE_URL et
        VITE_SUPABASE_ANON_KEY pour publier en ligne.
      </p>
    );
  }

  if (!adminEmail) {
    return (
      <form
        className="flex w-full flex-col gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setAuthError(null);
          try {
            await signIn(email, password);
          } catch (error) {
            setAuthError(error instanceof Error ? error.message : String(error));
          } finally {
            setBusy(false);
          }
        }}
      >
        <input
          type="email"
          value={email}
          required
          placeholder="adresse"
          autoComplete="username"
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-[16px] outline-none focus:border-accent sm:text-sm"
        />
        <input
          type="password"
          value={password}
          required
          placeholder="mot de passe"
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-[16px] outline-none focus:border-accent sm:text-sm"
        />
        <Button size="sm" variant="primary" type="submit" disabled={busy}>
          {busy ? "connexion…" : "se connecter"}
        </Button>
        {authError && <p className="text-[11px] text-red-700">{authError}</p>}
      </form>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="primary"
          disabled={!dirty || publishState === "publishing"}
          onClick={() => void publish()}
        >
          <CloudUpload size={14} strokeWidth={1.75} aria-hidden="true" />
          {publishState === "publishing" ? "publication…" : "publier"}
        </Button>

        {dirty && (
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

      <div className="flex-1 overflow-y-auto overscroll-contain px-5">
        {section === "home" && <HomePanel store={store} />}
        {section === "competences" && <CompetencesPanel store={store} />}
        {section === "cas-etudes" && (
          <CasEtudesPanel store={store} activeId={activeCaseId} />
        )}
        {section === "coups-de-coeur" && (
          <CoupsDeCoeurPanel store={store} activeId={activeLikeId} />
        )}

        {store.remoteEnabled && (
          <Group title="Hébergement des images" open={false}>
            <MigrateImages store={store} />
          </Group>
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
          <PublishBar store={store} />
        </div>
      </footer>
    </aside>
  );
}
