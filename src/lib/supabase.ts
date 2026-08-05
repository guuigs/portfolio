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

/** Reads the published content. Returns null when there is nothing to read. */
export async function fetchContent(): Promise<Content | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) {
    console.warn("[supabase] lecture du contenu impossible :", error.message);
    return null;
  }
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
 * Uploads an image and returns its public URL.
 *
 * The name is prefixed with a timestamp rather than reusing the file's own
 * name: two uploads called `cover.jpg` would otherwise overwrite each other,
 * and the second would silently replace an image still used elsewhere.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase n’est pas configuré.");

  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${Date.now()}-${safe}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) throw new Error(error.message);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
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
