import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { email: string; name: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

const KEY = "fb_user";
const USERS_KEY = "fb_users";

type StoredUser = { name: string; email: string; password: string };

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    await new Promise((r) => setTimeout(r, 400));
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, error: "Email o password non corretti" };
    }
    const u = { email: found.email, name: found.name };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  };

  const register: AuthCtx["register"] = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 400));
    const users = readUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "Email già registrata" };
    }
    users.push({ name, email, password });
    writeUsers(users);
    const u = { email, name };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
