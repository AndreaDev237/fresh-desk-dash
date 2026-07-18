
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  total numeric(10,2) NOT NULL,
  pickup_name text NOT NULL,
  pickup_detail text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'confermato',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, code)
);

CREATE INDEX orders_user_created_idx ON public.orders (user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
