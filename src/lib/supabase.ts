import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Content } from "./content";

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * The client is null until both variables are set, and every call site treats
 * that as "run purely local". The site therefore works unchanged with no
 * backend at all — useful for a fresh clone, and it means a Supabase outage
 * degrades to the bundled content rather than to a blank page.
 *
 * Shipping the anon key in the bundle is by design: it grants nothing on its
 * own. Reads are public because the content is public, and writes are refused
 * by the row-level policy unless the request carries an admin session.
 */
export const supabase: SupabaseClient | null =
  URL && ANON_KEY
    ? createClient(URL, ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null;

export const isRemoteEnabled = supabase !== null;

const ROW_ID = "main";
const TABLE = "site_content";
const BUCKET = "media";

/**
 * Reads the published content. Returns null when the row does not exist yet.
 *
 * Throws on a read failure rather than returning null, so callers can tell
 * "nothing has been published" from "we could not find out". Conflating the
 * two would let a transient network error look like an empty site, and the
 * next publish would overwrite content we never managed to read.
 */
export async function fetchContent(): Promise<Content | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data?.data as Content) ?? null;
}

/** Publishes the content. Fails unless the caller holds an admin session. */
export async function publishContent(content: Content): Promise<void> {
  if (!supabase) throw new Error("Supabase n’est pas configuré.");

  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: ROW_ID, data: content }, { onConflict: "id" });

  if (error) throw new Error(error.message);
}

/**
 * Uploads a file — image or document — and returns its public URL.
 *
 * The name is prefixed with a timestamp rather than reusing the file's own
 * name: two uploads called `cover.jpg` would otherwise overwrite each other,
 * and the second would silently replace a file still used elsewhere. For the
 * CV that timestamp doubles as a cache-buster: a visitor who already opened
 * the old PDF gets the new one instead of a stale copy.
 *
 * `contentType` is passed explicitly because a File picked on some platforms
 * arrives with an empty `type`, and Storage would then serve it as
 * `application/octet-stream` — which makes a browser download the PDF
 * instead of displaying it.
 */
export async function uploadFile(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase n’est pas configuré.");

  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${Date.now()}-${safe}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || guessType(safe),
  });

  if (error) throw new Error(error.message);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export interface MediaObject {
  /** Object key inside the bucket, e.g. `1755512345678-logo.png`. */
  name: string;
  url: string;
  size: number;
  createdAt: string;
  /** The name as uploaded, with the timestamp prefix removed. */
  original: string;
}

/**
 * Lists everything in the media bucket.
 *
 * Storage caps a listing at 100 rows, so this pages until a short page comes
 * back — a bucket that has accumulated re-uploads is exactly the case where
 * the first page is not the whole story.
 */
export async function listMedia(): Promise<MediaObject[]> {
  if (!supabase) return [];

  const found: MediaObject[] = [];
  const pageSize = 100;

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: pageSize, offset, sortBy: { column: "created_at", order: "asc" } });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;

    for (const item of data) {
      // A folder placeholder has no metadata; skip it rather than offering to
      // delete something that is not a file.
      if (!item.metadata) continue;
      found.push({
        name: item.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(item.name).data.publicUrl,
        size: Number(item.metadata.size ?? 0),
        createdAt: item.created_at ?? "",
        original: item.name.replace(/^\d{10,}-/, ""),
      });
    }

    if (data.length < pageSize) break;
  }

  return found;
}

/** Deletes objects from the media bucket. Requires the admin session. */
export async function removeMedia(names: string[]): Promise<void> {
  if (!supabase) throw new Error("Supabase n’est pas configuré.");
  if (names.length === 0) return;

  const { error } = await supabase.storage.from(BUCKET).remove(names);
  if (error) throw new Error(error.message);
}

/** Minimal extension→MIME map, for the browsers that hand over an empty type. */
function guessType(name: string): string {
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".gif")) return "image/gif";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

export interface AdminSession {
  email: string;
}

export async function currentSession(): Promise<AdminSession | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const email = data.session?.user.email;
  return email ? { email } : null;
}

export async function signIn(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error("Supabase n’est pas configuré.");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  await supabase?.auth.signOut();
}
