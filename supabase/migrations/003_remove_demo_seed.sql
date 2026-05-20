-- Eski demo / mock seed kayıtlarını temizler (schema.sql artık seed eklemez).
-- Supabase SQL Editor'da bir kez çalıştırın.

delete from public.orders
where id in ('ord-1', 'ord-2', 'ord-3');

delete from public.products
where id in (
  'prod-1', 'prod-2', 'prod-3', 'prod-4',
  'prod-5', 'prod-6', 'prod-7', 'prod-8'
);
