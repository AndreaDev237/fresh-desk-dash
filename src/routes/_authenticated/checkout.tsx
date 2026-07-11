import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/lib/auth";
import { PICKUP_POINTS } from "@/lib/products";
import { Button } from "@/components/fb/Button";
import { Input } from "@/components/fb/Input";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [{ title: "Pagamento — Frutteria Boolean" }],
  }),
  component: Checkout,
});

type Errors = Partial<Record<"name" | "card" | "exp" | "cvc", string>>;

function generateOrderId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `FB-${n}`;
}

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function Checkout() {
  const { detailed, subtotal, clear, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (count === 0) {
    throw redirect({ to: "/cart" });
  }

  const [name, setName] = useState(user?.name || "");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Inserisci il nome del titolare";
    const digits = card.replace(/\s/g, "");
    if (digits.length < 13 || digits.length > 16) e.card = "Numero carta non valido";
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      e.exp = "Formato MM/AA";
    } else {
      const [mm, yy] = exp.split("/").map(Number);
      if (mm < 1 || mm > 12) e.exp = "Mese non valido";
    }
    if (!/^\d{3,4}$/.test(cvc)) e.cvc = "3 o 4 cifre";
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setSubmitError(null);
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Mock: rifiuta se numero termina con 0 per far vedere lo stato di errore
    const digits = card.replace(/\s/g, "");
    if (digits.endsWith("0")) {
      setLoading(false);
      setSubmitError("Pagamento rifiutato dalla banca. Prova un'altra carta.");
      return;
    }

    const orderId = generateOrderId();
    const pickupId = sessionStorage.getItem("fb_pickup") || PICKUP_POINTS[0].id;
    const pickup = PICKUP_POINTS.find((p) => p.id === pickupId) || PICKUP_POINTS[0];

    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: detailed.map((d) => ({
        productId: d.product.id,
        name: d.product.name,
        qty: d.qty,
        price: d.product.price,
      })),
      total: subtotal,
      pickup: pickup.name,
      pickupDetail: pickup.detail,
      status: "confermato",
    };
    const prev = JSON.parse(localStorage.getItem("fb_orders") || "[]");
    localStorage.setItem("fb_orders", JSON.stringify([order, ...prev]));

    clear();
    setLoading(false);
    navigate({ to: "/confirmation/$orderId", params: { orderId } });
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 pb-6">
      <div>
        <h1 className="text-[24px] font-bold text-on-surface">Pagamento</h1>
        <p className="mt-1 text-[13px] text-on-surface-variant">
          Ambiente demo — non verrà addebitato nulla.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-outline-variant/40 bg-surface-container-low p-3">
        <span className="text-[13px] text-on-surface-variant">Totale da pagare</span>
        <span className="text-[22px] font-extrabold text-primary tabular-nums">
          € {subtotal.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Titolare carta"
          name="cardholder"
          autoComplete="cc-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Nome e cognome"
        />
        <Input
          label="Numero carta"
          name="card"
          inputMode="numeric"
          autoComplete="cc-number"
          value={card}
          onChange={(e) => setCard(formatCard(e.target.value))}
          error={errors.card}
          placeholder="1234 5678 9012 3456"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Scadenza"
            name="exp"
            inputMode="numeric"
            autoComplete="cc-exp"
            value={exp}
            onChange={(e) => setExp(formatExp(e.target.value))}
            error={errors.exp}
            placeholder="MM/AA"
          />
          <Input
            label="CVC"
            name="cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            error={errors.cvc}
            placeholder="123"
          />
        </div>

        {submitError && (
          <div className="rounded-md bg-error-container px-3 py-2 text-[13px] font-medium text-on-error-container">
            {submitError}
          </div>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Paga € {subtotal.toFixed(2).replace(".", ",")}
        </Button>

        <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          Pagamento sicuro
        </div>

        <div className="flex items-center justify-center gap-3 text-on-surface-variant">
          <PaymentLogo label="VISA" />
          <PaymentLogo label="Mastercard" />
          <PaymentLogo label="AMEX" />
          <PaymentLogo label="Stripe" />
        </div>
      </form>
    </div>
  );
}

function PaymentLogo({ label }: { label: string }) {
  return (
    <span className="rounded border border-outline-variant/60 bg-surface-container-lowest px-2 py-1 text-[10px] font-bold tracking-wider text-on-surface-variant">
      {label}
    </span>
  );
}
