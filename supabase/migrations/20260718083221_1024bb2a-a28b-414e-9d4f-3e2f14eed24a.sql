INSERT INTO private.app_config (key, value) VALUES
  ('notify_order_url', 'https://project--1b8cf52f-44d0-42a6-bd2f-7eb13ff70bcf.lovable.app/api/public/hooks/notify-order'),
  ('notify_order_secret', '1a3df8310f6f990af8bfee1491cbb4980ddfd97d906c1b09d4d29ac3c64e1528')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;