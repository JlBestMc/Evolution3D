import { createClient } from "@supabase/supabase-js";

// Use Vite env variables for client-side keys (must be prefixed with VITE_)
// Vite provides a type for import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ksowobdydeybxowvcqnz.supabase.co";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseKey) {
	console.warn("Supabase anon key is missing. Define VITE_SUPABASE_ANON_KEY in your .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
