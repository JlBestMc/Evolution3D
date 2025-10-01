import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://ksowobdydeybxowvcqnz.supabase.co";
export const supabaseUrl: string =
  (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_URL;
export const supabaseAnonKey: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

export const supabaseDebug = {
  usingFallbackUrl: !import.meta.env.VITE_SUPABASE_URL,
  usingEmptyKey: !import.meta.env.VITE_SUPABASE_ANON_KEY,
  url: supabaseUrl,
};

if (supabaseDebug.usingFallbackUrl) {
  console.warn(
    "VITE_SUPABASE_URL is missing. Using placeholder URL. Set your real project URL in .env.local"
  );
}
if (supabaseDebug.usingEmptyKey) {
  console.warn(
    "VITE_SUPABASE_ANON_KEY is missing. Public reads/writes may fail. Set it in .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
