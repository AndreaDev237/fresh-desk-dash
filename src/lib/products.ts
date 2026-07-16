import boxSnack from "@/assets/box-snack.png.asset.json";
import boxBosco from "@/assets/box-bosco.png.asset.json";
import boxPremium from "@/assets/box-premium.png.asset.json";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: { label: string; variant: "primary" | "secondary" };
  originalPrice?: number;
  isDeal?: boolean;
  discountPct?: number;
};

export const DAILY_DEAL_QTY_THRESHOLD = 3;
export const DAILY_DEAL_QTY_DISCOUNT = 0.15;

export const PRODUCTS: Product[] = [
  {
    id: "box-del-giorno",
    name: "Box del Giorno",
    description:
      "Selezione speciale della giornata: frutta di stagione a prezzo scontato, solo fino al cut-off.",
    price: 6.0,
    originalPrice: 8.0,
    isDeal: true,
    discountPct: 25,
    image: boxPremium.url,
    badge: { label: "Promo -25%", variant: "secondary" },
  },
  {
    id: "box-snack",
    name: "Box Snack d'Ufficio",
    description: "Il mix di stagione ideale per ricaricare le energie durante il lavoro.",
    price: 5.0,
    image: boxSnack.url,
    badge: { label: "Best Seller", variant: "primary" },
  },
  {
    id: "box-bosco",
    name: "Box Mix Bosco",
    description: "Selezione premium di bacche e piccoli frutti rossi, ricchi di antiossidanti.",
    price: 6.5,
    image: boxBosco.url,
    badge: { label: "Freschissimo", variant: "secondary" },
  },
  {
    id: "box-premium",
    name: "Premium Fruit Box",
    description: "Una selezione esclusiva di frutti esotici e locali per i palati più esigenti.",
    price: 8.0,
    image: boxPremium.url,
  },
];

export const PICKUP_POINTS = [
  { id: "reception-a", name: "Reception Edificio A", detail: "Piano terra, ingresso principale" },
  { id: "break-3", name: "Area Break Piano 3", detail: "Zona relax accanto agli ascensori" },
  { id: "ingresso-nord", name: "Ingresso Nord", detail: "Lato parcheggio dipendenti" },
];
