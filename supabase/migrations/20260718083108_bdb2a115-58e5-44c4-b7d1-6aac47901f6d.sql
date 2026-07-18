-- Estensione per chiamate HTTP da Postgres
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schema privato non esposto dalla Data API
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;

-- Tabella di configurazione (solo service_role)
CREATE TABLE IF NOT EXISTS private.app_config (
  key text PRIMARY KEY,
  value text NOT NULL
);
REVOKE ALL ON private.app_config FROM anon, authenticated;

-- Funzione trigger: invia POST al webhook notify-order
CREATE OR REPLACE FUNCTION public.notify_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, private
AS $$
DECLARE
  webhook_url text;
  webhook_secret text;
  payload jsonb;
BEGIN
  SELECT value INTO webhook_url FROM private.app_config WHERE key = 'notify_order_url';
  SELECT value INTO webhook_secret FROM private.app_config WHERE key = 'notify_order_secret';

  IF webhook_url IS NULL OR webhook_secret IS NULL THEN
    RAISE NOTICE 'notify_new_order: config mancante, skip';
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'code', NEW.code,
    'total', NEW.total,
    'pickup_name', NEW.pickup_name,
    'pickup_detail', NEW.pickup_detail,
    'items', NEW.items,
    'user_id', NEW.user_id,
    'created_at', NEW.created_at
  );

  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-notify-secret', webhook_secret
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

-- Trigger sulla tabella orders
DROP TRIGGER IF EXISTS orders_notify_new_order ON public.orders;
CREATE TRIGGER orders_notify_new_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_order();