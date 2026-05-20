-- Ek backend tabloları (schema.sql sonrası çalıştırın)

create table if not exists public.admin_settings (
  id                  text primary key default 'default',
  print_cost_inputs   jsonb,
  updated_at          timestamptz not null default now()
);

insert into public.admin_settings (id, print_cost_inputs)
values ('default', null)
on conflict (id) do nothing;

alter table public.admin_settings enable row level security;

-- Sadece service_role (API) erişir — anon policy yok

-- Storage bucket (Dashboard'dan da oluşturulabilir)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read for product-images
drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Service role uploads via API (RLS bypass)
