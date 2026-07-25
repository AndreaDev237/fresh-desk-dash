import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import { lovable } from "@/integrations/lovable";

export type User = { email: string; name: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

function toUser(supaUser: { email?: string | null; user_metadata?: Record<string, unknown> } | null): User | null {
  if (!supaUser?.email) return null;
  const meta = supaUser.user_metadata || {};
  const name =
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    supaUser.email.split("@")[0];
  return { email: supaUser.email, name };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session?.user ?? null));
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session?.user ?? null));
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: mapError(error.message) };
    return { ok: true };
  };

  const register: AuthCtx["register"] = async (name, email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    if (error) return { ok: false, error: mapError(error.message) };
    return { ok: true };
  };

  const loginWithGoogle: AuthCtx["loginWithGoogle"] = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
      });
      if (result.error) return { ok: false, error: mapError(result.error.message || String(result.error)) };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Errore Google Sign-In" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function mapError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials")) return "Email o password non corretti";
  if (m.includes("already registered") || m.includes("user already")) return "Email già registrata";
  if (m.includes("password")) return "Password non valida (min. 6 caratteri)";
  return msg;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
