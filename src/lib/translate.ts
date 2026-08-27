/* ============================================================
   Machine translation of the French content into its `*En` fields.

   The site's truth is the French published to Supabase; this only ever
   fills in the English counterparts, and only when asked from the CMS.
   Two rules hold it together:

   - Nothing here writes over an English field that already has text. A
     translation is offered for what is missing, never imposed on what
     the author wrote.
   - Every translation records the exact French it was made from, in
     `content.translations.source`. That is what makes drift visible
     later: when the French moves on, the CMS can say so instead of
     leaving a translation that silently describes older copy.

   The API key never reaches the browser — the request goes to a Supabase
   Edge Function that holds it and checks the caller is the admin.
   ============================================================ */

import type { Content } from "./content";
import { supabase } from "./supabase";

/** One French field and the English field that mirrors it. */
export interface TranslatableField {
  /** Dotted path of the French source, e.g. `profile.footerBody`. */
  frPath: string;
  /** Dotted path of the English counterpart, e.g. `profile.footerBodyEn`. */
  enPath: string;
  /** What the CMS calls this field. */
  label: string;
  /** Current French. Empty means there is nothing to translate. */
  fr: string;
  /** Current English. Empty means missing. */
  en: string;
  /** The French this English was translated from, when we made it. */
  source?: string;
  /** A `string[]` field, carried as one item per line. */
  list: boolean;
}

/* --------------------------------------------------------------- walking */

function get(target: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((cursor, key) => {
    if (cursor === null || typeof cursor !== "object") return undefined;
    return (cursor as Record<string, unknown>)[key];
  }, target);
}

/** Reads a field as text, collapsing a `string[]` to one item per line. */
function readText(content: Content, path: string): { text: string; list: boolean } {
  const value = get(content, path);
  if (Array.isArray(value)) return { text: value.join("\n"), list: true };
  return { text: typeof value === "string" ? value : "", list: false };
}

/** Splits a translated payload back into the shape the field expects. */
export function parseText(text: string, list: boolean): string | string[] {
  if (!list) return text;
  return text.split("\n").map((item) => item.trim()).filter(Boolean);
}

/* ---------------------------------------------------------------- fields */

/* Every translatable field, as `[French key, English key, label]`. Kept as
   data rather than spread through the walk below: this is the list that has
   to stay in step with `Content`, and it should be readable in one glance. */

const PROFILE: [string, string, string][] = [
  ["heroTitle", "heroTitleEn", "titre principal"],
  ["heroIntro", "heroIntroEn", "introduction"],
  ["footerName", "footerNameEn", "accroche — début"],
  ["footerLine", "footerLineEn", "accroche — suite"],
  ["footerBody", "footerBodyEn", "paragraphe du pied de page"],
];

const SKILL: [string, string, string][] = [
  ["title", "titleEn", "titre"],
  ["description", "descriptionEn", "description"],
  ["stack", "stackEn", "stack"],
];

const CASE: [string, string, string][] = [
  ["title", "titleEn", "titre"],
  ["shortTitle", "shortTitleEn", "titre court"],
  ["summary", "summaryEn", "résumé"],
  ["role", "roleEn", "rôle"],
  ["client", "clientEn", "contexte"],
  ["deliverables", "deliverablesEn", "livrables"],
  ["context", "contextEn", "le contexte"],
  ["problem", "problemEn", "le problème"],
  ["approach", "approachEn", "l’approche"],
  ["result", "resultEn", "le résultat"],
];

/**
 * Every French/English field pair in the content, in reading order.
 *
 * Fields whose French is empty are skipped — there is nothing to translate,
 * and an empty entry would only be noise in the CMS counts.
 */
export function collectTranslatable(content: Content): TranslatableField[] {
  const found: TranslatableField[] = [];
  const source = content.translations?.source ?? {};

  const push = (frPath: string, enPath: string, label: string) => {
    const { text, list } = readText(content, frPath);
    if (!text.trim()) return;
    const en = readText(content, enPath);
    found.push({
      frPath,
      enPath,
      label,
      fr: text,
      en: en.text,
      source: source[frPath],
      list,
    });
  };

  for (const [fr, en, label] of PROFILE) push(`profile.${fr}`, `profile.${en}`, label);

  content.skills.forEach((skill, i) => {
    for (const [fr, en, label] of SKILL) {
      push(`skills.${i}.${fr}`, `skills.${i}.${en}`, `${skill.title} — ${label}`);
    }
  });

  content.cases.forEach((study, i) => {
    const name = study.shortTitle || study.title;
    for (const [fr, en, label] of CASE) {
      push(`cases.${i}.${fr}`, `cases.${i}.${en}`, `${name} — ${label}`);
    }
    study.figures?.forEach((_, j) => {
      push(`cases.${i}.figures.${j}.label`, `cases.${i}.figures.${j}.labelEn`, `${name} — chiffre ${j + 1}`);
    });
    study.images.forEach((_, j) => {
      push(`cases.${i}.images.${j}.caption`, `cases.${i}.images.${j}.captionEn`, `${name} — légende ${j + 1}`);
    });
    study.links?.forEach((_, j) => {
      push(`cases.${i}.links.${j}.label`, `cases.${i}.links.${j}.labelEn`, `${name} — lien ${j + 1}`);
    });
  });

  content.likes.forEach((like, i) => {
    push(`likes.${i}.kind`, `likes.${i}.kindEn`, `${like.title} — type`);
  });

  return found;
}

/** Never translated yet. */
export const isMissing = (field: TranslatableField): boolean => field.en.trim() === "";

/**
 * Translated by us, but the French has been rewritten since.
 *
 * A field with no recorded source was written by hand and is never called
 * stale — we have no claim on it.
 */
export const isStale = (field: TranslatableField): boolean =>
  !isMissing(field) && field.source !== undefined && field.source !== field.fr;

/* ------------------------------------------------------------- the call */

interface TranslateResponse {
  translations?: { id: string; text: string }[];
  error?: string;
}

export interface TranslationResult {
  /** English keyed by the `*En` path it belongs to. */
  values: Record<string, string | string[]>;
  /** French keyed by its own path, to record as the provenance. */
  sources: Record<string, string>;
}

/**
 * Translates the given fields in one round trip.
 *
 * Batched deliberately: the whole point is that the model sees the fields
 * together, so a case study's summary and its result read as one voice
 * rather than as ten separately-translated fragments.
 */
export async function translateFields(
  fields: TranslatableField[],
): Promise<TranslationResult> {
  if (!supabase) throw new Error("Supabase n’est pas configuré.");
  if (fields.length === 0) return { values: {}, sources: {} };

  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  if (!token) throw new Error("Connectez-vous pour traduire.");

  const { data, error } = await supabase.functions.invoke<TranslateResponse>("translate", {
    body: {
      items: fields.map((field) => ({
        id: field.enPath,
        label: field.label,
        text: field.fr,
        list: field.list,
      })),
    },
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);

  const returned = new Map((data?.translations ?? []).map((item) => [item.id, item.text]));

  const values: Record<string, string | string[]> = {};
  const sources: Record<string, string> = {};

  for (const field of fields) {
    const text = returned.get(field.enPath);
    // A field the model skipped is left alone rather than blanked — a missing
    // translation should stay missing, not overwrite the field with "".
    if (text === undefined || !text.trim()) continue;
    values[field.enPath] = parseText(text, field.list);
    sources[field.frPath] = field.fr;
  }

  return { values, sources };
}

/**
 * Small enough that one failure costs little and progress moves visibly,
 * large enough that a case study's fields travel together and come back in
 * one voice.
 */
const BATCH = 15;

/**
 * Translates a whole set, a batch at a time, reporting progress.
 *
 * Batches that fail are reported rather than thrown: a network blip on batch
 * four should not throw away the three that already succeeded. The caller
 * writes what came back and shows what did not.
 */
export async function translateAll(
  fields: TranslatableField[],
  onProgress?: (done: number, total: number) => void,
): Promise<TranslationResult & { failed: number; error?: string }> {
  const values: Record<string, string | string[]> = {};
  const sources: Record<string, string> = {};
  let failed = 0;
  let error: string | undefined;

  for (let i = 0; i < fields.length; i += BATCH) {
    const batch = fields.slice(i, i + BATCH);
    try {
      const result = await translateFields(batch);
      Object.assign(values, result.values);
      Object.assign(sources, result.sources);
    } catch (err) {
      failed += batch.length;
      error ??= err instanceof Error ? err.message : String(err);
    }
    onProgress?.(Math.min(i + BATCH, fields.length), fields.length);
  }

  return { values, sources, failed, error };
}
