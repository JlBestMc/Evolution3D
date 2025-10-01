import { supabase } from "@/lib/supabaseClient";

export async function loginWithGoogle(
  redirectTo: string = `${window.location.origin}/`
): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) throw error;
}
