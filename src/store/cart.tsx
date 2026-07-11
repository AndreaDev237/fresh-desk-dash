import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/lib/products";

export type CartItem = { productId: string; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (productId: string) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: Array<{ product: Product; qty: number; lineTotal: number }>;
};

const CartContext = createContext<CartCtx | null>(null);
const KEY = "fb_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const detailed = items
      .map((i) => {
        const product = PRODUCTS.find((p) => p.id === i.productId);
        if (!product) return null;
        return { product, qty: i.qty, lineTotal: product.price * i.qty };
      })
      .filter((x): x is { product: Product; qty: number; lineTotal: number } => x !== null);

    return {
      items,
      add: (productId) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === productId);
          if (existing) {
            return prev.map((i) =>
              i.productId === productId ? { ...i, qty: i.qty + 1 } : i,
            );
          }
          return [...prev, { productId, qty: 1 }];
        }),
      remove: (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
      setQty: (productId, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
      count: detailed.reduce((s, i) => s + i.qty, 0),
      subtotal: detailed.reduce((s, i) => s + i.lineTotal, 0),
      detailed,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
