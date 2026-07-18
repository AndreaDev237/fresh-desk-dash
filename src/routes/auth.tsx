import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/fb/Button";
import { Input } from "@/components/fb/Input";
import logo from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Accedi — Frutteria Boolean" },
      { name: "description", content: "Accedi o registrati per ordinare la tua frutta-box." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/", replace: true });
  }, [user, navigate]);

  async function onGoogle() {
    setError(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (!res.ok) setError(res.error || "Errore Google Sign-In");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res =
      mode === "login"
        ? await login(email, password)
        : await register(name, email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Errore imprevisto");
      return;
    }
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col justify-center bg-background px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-3">
        <img src={logo.url} alt="Frutteria Boolean" className="h-16 w-16 object-contain" />
        <h1 className="text-[28px] font-extrabold tracking-tight text-on-surface">Frutteria Boolean</h1>
        <p className="text-center text-[15px] text-on-surface-variant">
          La tua pausa frutta, senza sforzo.
        </p>
      </div>

      <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-premium">
        <div className="mb-5 flex rounded-md bg-surface-container p-1">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
              mode === "login" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
            }`}
          >
            Accedi
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(null); }}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
              mode === "register" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
            }`}
          >
            Registrati
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <Input
              label="Nome"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Mario Rossi"
            />
          )}
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="mario@azienda.it"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Almeno 6 caratteri"
          />
          {error && (
            <div className="rounded-md bg-error-container px-3 py-2 text-[13px] font-medium text-on-error-container">
              {error}
            </div>
          )}
          <Button type="submit" size="lg" fullWidth loading={loading}>
            {mode === "login" ? "Accedi" : "Crea account"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-outline-variant/40" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">oppure</span>
          <span className="h-px flex-1 bg-outline-variant/40" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-[15px] font-semibold text-on-surface press hover:bg-surface-container disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.8 6.5 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.7 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.8 6.5 29.1 4.5 24 4.5c-7.4 0-13.8 4.2-17.7 10.2z"/>
            <path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13.1-5l-6-5c-2 1.4-4.4 2.3-7.1 2.3-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.9 39.2 16.4 43.5 24 43.5z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.2 5.5l6 5c-.4.4 6.4-4.7 6.4-14.5 0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          Continua con Google
        </button>
      </div>

      <p className="mt-6 text-center text-[12px] text-on-surface-variant">
        Ordinando accetti i <Link to="/" className="underline">termini di servizio</Link>.
      </p>
    </div>
  );
}
