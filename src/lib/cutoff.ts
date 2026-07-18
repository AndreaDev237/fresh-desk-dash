import { useEffect, useState } from "react";

/** Cut-off: feriale lun-ven alle 10:00. Weekend = chiuso. */
export type CutoffState = {
  open: boolean;
  hh: string;
  mm: string;
  ss: string;
  label: string;
};

const DEBUG_KEY = "fb-debug-always-open";

export function getDebugAlwaysOpen(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEBUG_KEY) === "1";
}

export function setDebugAlwaysOpen(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) window.localStorage.setItem(DEBUG_KEY, "1");
  else window.localStorage.removeItem(DEBUG_KEY);
  window.dispatchEvent(new Event("fb-debug-change"));
}

function computeState(now: Date, debugAlwaysOpen: boolean): CutoffState {
  const day = now.getDay(); // 0=dom, 6=sab
  const isWeekend = day === 0 || day === 6;

  const cutoff = new Date(now);
  cutoff.setHours(10, 0, 0, 0);

  if (debugAlwaysOpen) {
    // In modalità debug la frutteria è sempre aperta: mostriamo un countdown
    // fittizio di 24h che non tocca la logica del prodotto.
    const nextCutoff = new Date(now);
    if (now >= cutoff) nextCutoff.setDate(nextCutoff.getDate() + 1);
    nextCutoff.setHours(10, 0, 0, 0);
    const diff = nextCutoff.getTime() - now.getTime();
    const totalSec = Math.floor(diff / 1000);
    const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const ss = String(totalSec % 60).padStart(2, "0");
    return { open: true, hh, mm, ss, label: "Debug: frutteria sempre aperta" };
  }

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
  const [debug, setDebug] = useState(false);
  const [state, setState] = useState<CutoffState>(() => computeState(new Date(), false));

  useEffect(() => {
    const sync = () => setDebug(getDebugAlwaysOpen());
    sync();
    window.addEventListener("fb-debug-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fb-debug-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    setState(computeState(new Date(), debug));
    const id = setInterval(() => setState(computeState(new Date(), debug)), 1000);
    return () => clearInterval(id);
  }, [debug]);

  return state;
}
