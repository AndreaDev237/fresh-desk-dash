import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/fb/Button";
import { getDebugAlwaysOpen, setDebugAlwaysOpen } from "@/lib/cutoff";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profilo — Frutteria Boolean" }] }),
  component: Profile,
});

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alwaysOpen, setAlwaysOpen] = useState(false);

  useEffect(() => {
    setAlwaysOpen(getDebugAlwaysOpen());
  }, []);

  const toggleDebug = () => {
    const next = !alwaysOpen;
    setAlwaysOpen(next);
    setDebugAlwaysOpen(next);
  };

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-container/25 text-[36px] font-extrabold text-primary">
          {user?.name.charAt(0).toUpperCase() || "?"}
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-on-surface">{user?.name}</h1>
          <p className="text-[13px] text-on-surface-variant">{user?.email}</p>
        </div>
      </div>

      <section className="flex flex-col rounded-lg border border-outline-variant/40 bg-surface-container-lowest shadow-premium">
        <Row icon="notifications" label="Notifiche" />
        <Row icon="help" label="Aiuto e supporto" />
        <Row icon="policy" label="Termini e privacy" />
      </section>

      <section className="flex flex-col gap-2 rounded-lg border border-dashed border-outline-variant/60 bg-surface-container-lowest p-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-secondary">bug_report</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Debug
          </span>
        </div>
        <button
          type="button"
          onClick={toggleDebug}
          className="flex items-center justify-between gap-3 press"
        >
          <div className="flex flex-col text-left">
            <span className="text-[15px] font-semibold text-on-surface">
              Frutteria sempre aperta
            </span>
            <span className="text-[12px] text-on-surface-variant">
              Ignora cut-off 10:00 e chiusura weekend
            </span>
          </div>
          <span
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
              alwaysOpen ? "bg-primary" : "bg-surface-container-high"
            }`}
            aria-pressed={alwaysOpen}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-premium transition-transform ${
                alwaysOpen ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </span>
        </button>
      </section>

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={() => {
          logout();
          navigate({ to: "/auth" });
        }}
        icon={<span className="material-symbols-outlined text-[20px]">logout</span>}
      >
        Esci
      </Button>
    </div>
  );
}

function Row({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 border-b border-outline-variant/30 px-4 py-3.5 text-left last:border-b-0 press"
    >
      <span className="material-symbols-outlined text-[22px] text-primary">{icon}</span>
      <span className="flex-1 text-[15px] font-semibold text-on-surface">{label}</span>
      <span className="material-symbols-outlined text-[20px] text-on-surface-variant/60">
        chevron_right
      </span>
    </button>
  );
}
