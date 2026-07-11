import { useCutoff } from "@/lib/cutoff";
import { Badge } from "@/components/ui/Card";

export function CutoffTimer() {
  const s = useCutoff();

  return (
    <section className="flex flex-col gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-low p-4 shadow-premium">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[20px] text-primary">
            history_toggle_off
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Stato consegne
          </span>
        </div>
        <Badge variant={s.open ? "promo" : "category"}>
          {s.open ? "In corso" : "Chiuso"}
        </Badge>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] text-on-surface-variant">{s.label}</span>
        {s.open ? (
          <div className="flex items-baseline gap-1 font-extrabold tracking-tight text-primary timer-pulse">
            <TimeBlock value={s.hh} />
            <span className="text-2xl">:</span>
            <TimeBlock value={s.mm} />
            <span className="text-2xl">:</span>
            <TimeBlock value={s.ss} />
          </div>
        ) : (
          <span className="text-2xl font-bold tracking-tight text-on-surface-variant">
            Riapertura prossimo giorno feriale
          </span>
        )}
      </div>
    </section>
  );
}

function TimeBlock({ value }: { value: string }) {
  return <span className="text-[32px] tabular-nums leading-none">{value}</span>;
}
