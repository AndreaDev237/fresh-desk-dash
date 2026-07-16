import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/store/cart";
import { useCutoff } from "@/lib/cutoff";
import { Badge } from "@/components/fb/Card";
import { CutoffTimer } from "@/components/CutoffTimer";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});

function Home() {
  const { add } = useCart();
  const cutoff = useCutoff();
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(null), 1500);
    return () => clearTimeout(id);
  }, [added]);

  const deal = PRODUCTS.find((p) => p.isDeal);
  const rest = PRODUCTS.filter((p) => !p.isDeal);

  return (
    <div className="flex flex-col gap-6 px-4 pt-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container to-primary p-5 shadow-premium">
        <div className="relative z-10 max-w-[75%]">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-on-primary/80">
            Frutteria Boolean
          </p>
          <h1 className="text-[28px] leading-tight font-extrabold tracking-tight text-on-primary-container">
            La tua pausa frutta, senza sforzo
          </h1>
          <p className="mt-2 text-[14px] text-on-primary-container/80">
            Ordina entro le 10:00, ritira alle 13:00. Zero attese.
          </p>
        </div>
        <span
          aria-hidden
          className="material-symbols-outlined absolute -right-6 -bottom-6 text-[180px] text-on-primary/15 fill"
        >
          eco
        </span>
      </section>

      <CutoffTimer />

      {/* Box del Giorno */}
      {deal && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-secondary">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              Box del Giorno
            </h2>
            {cutoff.open && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant tabular-nums">
                Termina in {cutoff.hh}:{cutoff.mm}:{cutoff.ss}
              </span>
            )}
          </div>

          <article className="relative overflow-hidden rounded-xl border-2 border-secondary bg-surface-container-lowest shadow-premium">
            <div className="absolute right-3 top-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-on-secondary shadow-premium">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Promo -{deal.discountPct}%
              </span>
            </div>
            <div className="relative h-56 w-full overflow-hidden bg-surface-container">
              <img
                src={deal.image}
                alt={deal.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div>
                <h3 className="text-[20px] font-extrabold text-on-surface">{deal.name}</h3>
                <p className="mt-1 text-[13px] leading-snug text-on-surface-variant/80">
                  {deal.description}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                  Sconto extra -15% dalle 3 unità
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-tight text-on-surface-variant/60">
                    Oggi solo
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[26px] font-extrabold text-secondary">
                      € {deal.price.toFixed(2).replace(".", ",")}
                    </span>
                    {deal.originalPrice && (
                      <span className="text-[14px] font-semibold text-on-surface-variant line-through">
                        € {deal.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!cutoff.open}
                  onClick={() => {
                    add(deal.id);
                    setAdded(deal.id);
                  }}
                  className={`inline-flex h-11 items-center gap-1.5 rounded-md px-5 text-[13px] font-bold uppercase tracking-wider transition-all press disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant/50 ${
                    added === deal.id
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-secondary text-on-secondary hover:opacity-90"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {added === deal.id ? "check_circle" : "add_shopping_cart"}
                  </span>
                  {added === deal.id ? "Aggiunto" : "Aggiungi"}
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Catalog */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Catalogo box
          </h2>
          <span className="text-[12px] font-semibold text-on-surface-variant">
            {rest.length} disponibili
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {rest.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest shadow-premium press"
            >
              <div className="relative h-56 w-full overflow-hidden bg-surface-container">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {p.badge && (
                  <div className="absolute left-3 top-3">
                    <Badge variant={p.badge.variant === "primary" ? "success" : "promo"}>
                      {p.badge.label}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 p-3">
                <div>
                  <h3 className="text-[18px] font-bold text-on-surface">{p.name}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-on-surface-variant/80">
                    {p.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-tight text-on-surface-variant/60">
                      Prezzo
                    </span>
                    <span className="text-[22px] font-extrabold text-primary">
                      € {p.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={!cutoff.open}
                    onClick={() => {
                      add(p.id);
                      setAdded(p.id);
                    }}
                    className={`inline-flex h-11 items-center gap-1.5 rounded-md px-5 text-[13px] font-bold uppercase tracking-wider transition-all press disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant/50 ${
                      added === p.id
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-primary text-on-primary hover:bg-surface-tint"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {added === p.id ? "check_circle" : "add_shopping_cart"}
                    </span>
                    {added === p.id ? "Aggiunto" : "Aggiungi"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
