import { supabase } from "@/lib/supabaseClient";
/**
 * Inicia sesión con Google usando Supabase Auth.
 * Por defecto redirige a /welcome en el mismo origen.
 */
export async function loginWithGoogle(
  redirectTo: string = `${window.location.origin}/`
): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) throw error;
}
