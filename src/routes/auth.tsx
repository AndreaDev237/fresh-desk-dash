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
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/", replace: true });
  }, [user, navigate]);

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
      </div>

      <p className="mt-6 text-center text-[12px] text-on-surface-variant">
        Ordinando accetti i <Link to="/" className="underline">termini di servizio</Link>.
      </p>
    </div>
  );
}
