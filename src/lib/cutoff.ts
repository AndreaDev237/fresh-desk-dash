import { useEffect, useState } from "react";

/** Cut-off: feriale lun-ven alle 10:00. Weekend = chiuso. */
export type CutoffState = {
  open: boolean;
  hh: string;
  mm: string;
  ss: string;
  label: string;
};

function computeState(now: Date): CutoffState {
  const day = now.getDay(); // 0=dom, 6=sab
  const isWeekend = day === 0 || day === 6;

  const cutoff = new Date(now);
  cutoff.setHours(10, 0, 0, 0);

  if (isWeekend) {
    return { open: false, hh: "00", mm: "00", ss: "00", label: "Servizio non attivo nel weekend" };
  }
  if (now >= cutoff) {
    return { open: false, hh: "00", mm: "00", ss: "00", label: "Ordini chiusi per oggi" };
  }

  const diff = cutoff.getTime() - now.getTime();
  const totalSec = Math.floor(diff / 1000);
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return { open: true, hh, mm, ss, label: "L'ordine di oggi chiude tra:" };
}

export function useCutoff(): CutoffState {
  const [state, setState] = useState<CutoffState>(() => computeState(new Date()));

  useEffect(() => {
    const id = setInterval(() => setState(computeState(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}
