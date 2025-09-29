import { createContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  role: string | null;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithPassword: (email: string, password: string, name?: string) => Promise<{ error?: string; needsConfirm?: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type ImportMetaEnvLike = { VITE_ADMIN_EMAILS?: string };
const env = (import.meta as unknown as { env?: ImportMetaEnvLike }).env || {};
const ADMIN_EMAILS: string[] = env.VITE_ADMIN_EMAILS
  ? env.VITE_ADMIN_EMAILS.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  : [];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileRole, setProfileRole] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) {
        setProfileRole(null);
        return;
      }
      interface ProfileRow { role?: string | null }
      const { data, error, status } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();
      if (!active) return;
      if (error) {
        console.error("[AuthProvider] profiles fetch error", { error, status, userId: user.id });
        setProfileRole(null);
        return;
      }
      if (!data) {
        // No row yet (trigger maybe delayed) -> keep null and retry once after short delay
        setProfileRole(null);
        setTimeout(async () => {
          const { data: d2, error: e2 } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle<ProfileRow>();
          if (!active) return;
            if (e2) {
              console.error("[AuthProvider] profiles retry error", { e2, userId: user.id });
            } else if (d2?.role) {
              setProfileRole(d2.role.toLowerCase());
            }
        }, 800);
        return;
      }
      setProfileRole(data.role ? data.role.toLowerCase() : null);
    })();
    return () => { active = false; };
  }, [user]);

  const signInWithGoogle = async (redirectPath?: string) => {
    const redirectTo = `${window.location.origin}${redirectPath ?? "/admin"}`;
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signUpWithPassword = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: name ? { full_name: name } : undefined },
    });
    return { error: error?.message, needsConfirm: !data.user?.confirmed_at };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const meta = (user?.app_metadata ?? {}) as Record<string, unknown>;
  const metaRole = typeof meta.role === "string" ? meta.role : null;
  const allowlistAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const effectiveRole = profileRole || metaRole || (allowlistAdmin ? "admin" : null);
  const isAdmin = effectiveRole === "admin";

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading, isAdmin, role: effectiveRole ?? (isAdmin ? "admin" : "user"), signInWithGoogle, signInWithPassword, signUpWithPassword, signOut }),
    [user, session, loading, isAdmin, effectiveRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
