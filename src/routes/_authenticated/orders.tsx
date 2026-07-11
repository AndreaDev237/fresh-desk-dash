import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  createdAt: string;
  total: number;
  pickup: string;
  items: Array<{ name: string; qty: number }>;
};

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "I miei ordini — Frutteria Boolean" }] }),
  component: Orders,
});

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    try {
      setOrders(JSON.parse(localStorage.getItem("fb_orders") || "[]"));
    } catch {}
  }, []);

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-6">
      <h1 className="text-[24px] font-bold text-on-surface">I miei ordini</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/60">
            receipt_long
          </span>
          <p className="text-[14px] text-on-surface-variant">
            Non hai ancora effettuato nessun ordine.
          </p>
          <Link
            to="/"
            className="mt-2 rounded-md bg-primary px-4 py-2 text-[13px] font-bold text-on-primary press"
          >
            Sfoglia catalogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              to="/confirmation/$orderId"
              params={{ orderId: o.id }}
              className="flex flex-col gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-premium press"
            >
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-primary">#{o.id}</span>
                <span className="text-[12px] text-on-surface-variant">
                  {new Date(o.createdAt).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-[13px] text-on-surface-variant">
                {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-2">
                <span className="text-[12px] text-on-surface-variant">Ritiro: {o.pickup}</span>
                <span className="text-[15px] font-extrabold text-on-surface tabular-nums">
                  € {o.total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
