import { supabase } from "@/integrations/supabase/client";

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  code: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  pickup: string;
  pickupDetail: string;
  status: string;
};

function generateCode() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `FB-${n}`;
}

type Row = {
  id: string;
  code: string;
  created_at: string;
  items: unknown;
  total: number;
  pickup_name: string;
  pickup_detail: string;
  status: string;
};

function rowToOrder(r: Row): Order {
  return {
    id: r.id,
    code: r.code,
    createdAt: r.created_at,
    items: Array.isArray(r.items) ? (r.items as OrderItem[]) : [],
    total: Number(r.total),
    pickup: r.pickup_name,
    pickupDetail: r.pickup_detail,
    status: r.status,
  };
}

export async function createOrder(input: {
  items: OrderItem[];
  total: number;
  pickupName: string;
  pickupDetail: string;
}): Promise<Order> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Utente non autenticato");

  // Retry once on unlikely code collision (UNIQUE user_id+code).
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        code,
        total: input.total,
        pickup_name: input.pickupName,
        pickup_detail: input.pickupDetail,
        items: input.items,
      })
      .select("*")
      .single();
    if (!error && data) return rowToOrder(data as Row);
    if (error && error.code !== "23505") throw error;
  }
  throw new Error("Impossibile creare l'ordine");
}

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(rowToOrder);
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToOrder(data as Row) : null;
}
