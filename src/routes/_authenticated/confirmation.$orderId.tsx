import { createFileRoute, Link } from "@tanstack/react-router";
import checkmark from "@/assets/checkmark.png.asset.json";
import location from "@/assets/location.png.asset.json";
import { Button } from "@/components/fb/Button";

type Order = {
  id: string;
  createdAt: string;
  items: Array<{ productId: string; name: string; qty: number; price: number }>;
  total: number;
  pickup: string;
  pickupDetail: string;
};

export const Route = createFileRoute("/_authenticated/confirmation/$orderId")({
  head: () => ({
    meta: [
      { title: "Ordine confermato — Frutteria Boolean" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const { orderId } = Route.useParams();

  let order: Order | null = null;
  if (typeof window !== "undefined") {
    try {
      const orders: Order[] = JSON.parse(localStorage.getItem("fb_orders") || "[]");
      order = orders.find((o) => o.id === orderId) || null;
    } catch {}
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-container/25">
          <img src={checkmark.url} alt="" className="h-16 w-16 object-contain" />
        </div>
        <h1 className="text-[28px] font-extrabold tracking-tight text-on-surface">
          Ordine confermato!
        </h1>
        <p className="text-[15px] text-on-surface-variant">
          Grazie. Ecco il tuo codice ritiro:
        </p>
        <div className="mt-1 rounded-lg bg-primary px-6 py-3 shadow-premium">
          <span className="text-[26px] font-extrabold tracking-widest text-on-primary">
            #{orderId}
          </span>
        </div>
      </div>

      {/* Progress tracker */}
      <section className="flex flex-col gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-low p-4 shadow-premium">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
          Stato ordine
        </h2>
        <ol className="grid grid-cols-3 gap-2">
          <Step icon="check_circle" label="Confermato" active done />
          <Step icon="local_shipping" label="In preparazione" active />
          <Step icon="storefront" label="Pronto al ritiro" />
        </ol>
      </section>

      {/* Pickup instructions */}
      <section className="flex flex-col gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-premium">
        <div className="flex items-center gap-2">
          <img src={location.url} alt="" className="h-6 w-6 object-contain" aria-hidden />
          <h2 className="text-[16px] font-bold text-on-surface">Istruzioni per il ritiro</h2>
        </div>
        {order ? (
          <>
            <div>
              <div className="text-[15px] font-semibold text-on-surface">{order.pickup}</div>
              <div className="text-[13px] text-on-surface-variant">{order.pickupDetail}</div>
            </div>
            <ul className="flex flex-col gap-2 text-[13px] text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                Ritiro alle <b className="text-on-surface">13:00</b> di oggi
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
                Mostra il codice <b className="text-on-surface">#{orderId}</b> allo staff
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
                Zero attese: box pronte in scaffale
              </li>
            </ul>
          </>
        ) : (
          <p className="text-[13px] text-on-surface-variant">
            Dettagli ordine non disponibili su questo dispositivo.
          </p>
        )}
      </section>

      {order && (
        <section className="flex flex-col gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-4">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
            Riepilogo
          </h2>
          {order.items.map((it) => (
            <div key={it.productId} className="flex items-center justify-between text-[14px]">
              <span className="text-on-surface">
                {it.qty}× {it.name}
              </span>
              <span className="tabular-nums font-semibold">
                € {(it.qty * it.price).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-outline-variant/40 pt-2">
            <span className="text-[14px] font-bold text-on-surface">Totale</span>
            <span className="text-[18px] font-extrabold text-primary tabular-nums">
              € {order.total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </section>
      )}

      <Link to="/">
        <Button variant="secondary" size="lg" fullWidth>
          Torna al catalogo
        </Button>
      </Link>
    </div>
  );
}

function Step({
  icon,
  label,
  active,
  done,
}: {
  icon: string;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <li className="flex flex-col items-center gap-1.5 text-center">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${
          done
            ? "border-primary bg-primary text-on-primary"
            : active
              ? "border-primary bg-primary-container/30 text-primary"
              : "border-outline-variant bg-surface-container-lowest text-on-surface-variant/50"
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${done ? "fill" : ""}`}>{icon}</span>
      </div>
      <span
        className={`text-[11px] font-semibold leading-tight ${
          active ? "text-on-surface" : "text-on-surface-variant/60"
        }`}
      >
        {label}
      </span>
    </li>
  );
}
