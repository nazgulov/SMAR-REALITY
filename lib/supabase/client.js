import { createClient } from "@supabase/supabase-js";

function cleanEnvValue(value) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

const supabaseUrl = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

let browserClient;
let serverClient;

export function hasSupabaseConfig() {
  return !getSupabaseConfigIssue();
}

export function getSupabaseConfigIssue() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return "Chybí NEXT_PUBLIC_SUPABASE_URL nebo NEXT_PUBLIC_SUPABASE_ANON_KEY v .env.local.";
  }

  if (
    supabaseUrl.includes("your-project-ref") ||
    supabaseAnonKey.includes("your-public-anon-key")
  ) {
    return "V .env.local jsou stále ukázkové hodnoty z .env.example.";
  }

  try {
    const url = new URL(supabaseUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "NEXT_PUBLIC_SUPABASE_URL musí začínat na https:// nebo http://.";
    }
  } catch {
    return "NEXT_PUBLIC_SUPABASE_URL není platná URL adresa.";
  }

  return null;
}

export function getSupabaseBrowserClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}

export function getSupabaseServerClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  if (!serverClient) {
    serverClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
  }

  return serverClient;
}

export function getStorageBucketName() {
  return process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "property-images";
}
