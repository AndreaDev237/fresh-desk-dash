import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { PICKUP_POINTS } from "@/lib/products";
import { Button } from "@/components/fb/Button";
import location from "@/assets/location.png.asset.json";

export const Route = createFileRoute("/_authenticated/cart")({
  head: () => ({
    meta: [{ title: "Carrello — Frutteria Boolean" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { detailed, subtotal, setQty, remove, count } = useCart();
  const [pickup, setPickup] = useState<string>(PICKUP_POINTS[0].id);
  const navigate = useNavigate();

  if (count === 0) return <EmptyCart />;

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 pb-6">
      <h1 className="text-[24px] font-bold text-on-surface">Il tuo carrello</h1>

      <section className="flex flex-col gap-3">
        {detailed.map(({ product, qty, lineTotal }) => (
          <div
            key={product.id}
            className="flex gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-3 shadow-premium"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 shrink-0 rounded-md object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-bold text-on-surface">{product.name}</h3>
                  <p className="text-[13px] font-semibold text-primary">
                    € {product.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  aria-label={`Rimuovi ${product.name}`}
                  className="shrink-0 rounded-full p-1 text-on-surface-variant hover:bg-surface-container press"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low">
                  <button
                    type="button"
                    onClick={() => setQty(product.id, qty - 1)}
                    aria-label="Diminuisci"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface press"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="w-6 text-center text-[14px] font-bold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(product.id, qty + 1)}
                    aria-label="Aumenta"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface press"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
                <span className="text-[15px] font-bold text-on-surface">
                  € {lineTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Dropoff */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <img src={location.url} alt="" className="h-6 w-6 object-contain" aria-hidden />
          <h2 className="text-[16px] font-bold text-on-surface">Punto di ritiro</h2>
        </div>
        <div className="flex flex-col gap-2">
          {PICKUP_POINTS.map((p) => {
            const active = pickup === p.id;
            return (
              <label
                key={p.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all press ${
                  active
                    ? "border-primary bg-primary-container/15 shadow-premium"
                    : "border-outline-variant/40 bg-surface-container-lowest"
                }`}
              >
                <input
                  type="radio"
                  name="pickup"
                  value={p.id}
                  checked={active}
                  onChange={() => setPickup(p.id)}
                  className="sr-only"
                />
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? "border-primary" : "border-outline"
                  }`}
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </span>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-on-surface">{p.name}</div>
                  <div className="text-[12px] text-on-surface-variant">{p.detail}</div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Totals */}
      <section className="flex flex-col gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low p-4 shadow-premium">
        <Row label="Subtotale" value={subtotal} />
        <Row label="Ritiro" value={0} zeroLabel="Gratuito" />
        <div className="my-1 border-t border-outline-variant/40" />
        <Row label="Totale" value={subtotal} bold />
      </section>

      <Button
        size="lg"
        fullWidth
        onClick={() => {
          sessionStorage.setItem("fb_pickup", pickup);
          navigate({ to: "/checkout" });
        }}
        icon={<span className="material-symbols-outlined text-[20px]">lock</span>}
      >
        Vai al pagamento
      </Button>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  zeroLabel,
}: {
  label: string;
  value: number;
  bold?: boolean;
  zeroLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[14px] ${bold ? "font-bold text-on-surface" : "text-on-surface-variant"}`}>
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? "text-[20px] font-extrabold text-primary" : "text-[14px] font-semibold text-on-surface"}`}
      >
        {value === 0 && zeroLabel ? zeroLabel : `€ ${value.toFixed(2).replace(".", ",")}`}
      </span>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-container/25">
        <span className="material-symbols-outlined text-[72px] text-primary">shopping_basket</span>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-bold text-on-surface">Il carrello è vuoto</h1>
        <p className="text-[15px] text-on-surface-variant">
          Sfoglia il catalogo e aggiungi la tua frutta-box preferita. Ordini entro le 10:00, ritiri
          alle 13:00.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-6 text-[15px] font-bold text-on-primary shadow-premium press hover:bg-surface-tint"
      >
        <span className="material-symbols-outlined text-[20px]">storefront</span>
        Sfoglia catalogo
      </Link>
    </div>
  );
}
