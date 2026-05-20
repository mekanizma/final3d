-- =============================================================================
-- Final3d — Supabase PostgreSQL şeması
-- Supabase Dashboard → SQL Editor → New query → yapıştır → Run
-- =============================================================================

-- Uzantılar
create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. PROFİLLER (auth.users ile eşleşir)
-- =============================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  email       text not null unique,
  phone       text not null default '',
  address     text not null default '',
  created_at  timestamptz not null default now()
);

comment on table public.profiles is 'Mağaza müşteri profilleri — Supabase Auth ile bağlı';

-- Yeni kayıt sonrası otomatik profil
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, address)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'address', '')
  )
  on conflict (id) do update set
    name    = excluded.name,
    phone   = excluded.phone,
    address = excluded.address;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- 2. ÜRÜNLER
-- =============================================================================
create table if not exists public.products (
  id            text primary key,
  name          text not null,
  description   text not null default '',
  translations  jsonb not null default '{}'::jsonb,
  price         numeric(12, 2) not null check (price >= 0),
  stock         integer not null default 0 check (stock >= 0),
  image         text not null,
  category      text not null check (
    category in ('3d-print', 'model', 'accessory', 'filament', 'tool')
  ),
  featured      boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured) where featured = true;
create index if not exists products_created_at_idx on public.products (created_at desc);

comment on column public.products.translations is
  'Record<Locale, {name, description}> — tr, en, ru, ar';

-- =============================================================================
-- 3. SİPARİŞLER
-- =============================================================================
create table if not exists public.orders (
  id              text primary key,
  customer_name   text not null,
  phone           text not null,
  address         text not null,
  items           jsonb not null default '[]'::jsonb,
  note            text,
  payment_method  text not null default 'kapida-odeme'
                    check (payment_method = 'kapida-odeme'),
  status          text not null default 'yeni' check (
    status in ('yeni', 'hazirlaniyor', 'kargoda', 'teslim-edildi')
  ),
  subtotal        numeric(12, 2),
  shipping_fee    numeric(12, 2),
  total           numeric(12, 2) not null check (total >= 0),
  user_id         uuid references auth.users (id) on delete set null,
  user_email      text,
  created_at      timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_user_email_idx on public.orders (lower(user_email));
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

comment on column public.orders.items is
  '[{productId, productName, quantity, price}] — sipariş anındaki snapshot';

-- =============================================================================
-- 4. ÖZEL BASKI TALEPLERİ
-- =============================================================================
create table if not exists public.custom_print_requests (
  id          text primary key,
  name        text not null,
  email       text not null,
  phone       text not null,
  material    text not null check (material in ('pla', 'abs', 'petg', 'tpu')),
  color       text not null,
  quantity    text not null,
  note        text not null default '',
  file_name   text not null,
  file_size   bigint not null default 0 check (file_size >= 0),
  user_id     uuid references auth.users (id) on delete set null,
  status      text not null default 'yeni' check (
    status in ('yeni', 'inceleniyor', 'teklif-gonderildi')
  ),
  created_at  timestamptz not null default now()
);

create index if not exists custom_print_requests_status_idx
  on public.custom_print_requests (status);
create index if not exists custom_print_requests_created_at_idx
  on public.custom_print_requests (created_at desc);

-- =============================================================================
-- 5. 3D TARAMA TEKLİF TALEPLERİ
-- =============================================================================
create table if not exists public.scan_quote_requests (
  id                  text primary key,
  name                text not null,
  email               text not null,
  phone               text not null,
  object_description  text not null,
  scan_area           text not null,
  quantity            text not null,
  location_type       text not null,
  location_address    text not null,
  city                text not null,
  purpose             text not null,
  surface_type        text not null,
  wants_print         boolean not null default false,
  note                text not null default '',
  photo_file_name     text,
  photo_file_size     bigint check (photo_file_size is null or photo_file_size >= 0),
  user_id             uuid references auth.users (id) on delete set null,
  status              text not null default 'yeni' check (
    status in ('yeni', 'inceleniyor', 'teklif-gonderildi')
  ),
  created_at          timestamptz not null default now()
);

create index if not exists scan_quote_requests_status_idx
  on public.scan_quote_requests (status);
create index if not exists scan_quote_requests_created_at_idx
  on public.scan_quote_requests (created_at desc);

-- =============================================================================
-- 6. GALERİ YÜKLEMELERİ (admin ürün görseli)
-- =============================================================================
create table if not exists public.gallery_uploads (
  id          text primary key,
  label       text not null,
  url         text not null,
  created_at  timestamptz not null default now()
);

create index if not exists gallery_uploads_created_at_idx
  on public.gallery_uploads (created_at desc);

-- =============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.custom_print_requests enable row level security;
alter table public.scan_quote_requests enable row level security;
alter table public.gallery_uploads enable row level security;

-- Profiller: kullanıcı kendi kaydını okur/günceller
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Ürünler: herkes okuyabilir (mağaza vitrin)
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products for select
  using (true);

-- Siparişler: kullanıcı kendi siparişlerini görür
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  using (
    auth.uid() is not null
    and (
      user_id = auth.uid()
      or lower(user_email) = lower(auth.jwt()->>'email')
    )
  );

-- Sipariş oluşturma: giriş yapmış kullanıcı
drop policy if exists "orders_insert_authenticated" on public.orders;
create policy "orders_insert_authenticated"
  on public.orders for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
  );

-- Özel baskı: herkes talep gönderebilir (anon + auth)
drop policy if exists "custom_print_insert_anyone" on public.custom_print_requests;
create policy "custom_print_insert_anyone"
  on public.custom_print_requests for insert
  with check (true);

drop policy if exists "custom_print_select_own" on public.custom_print_requests;
create policy "custom_print_select_own"
  on public.custom_print_requests for select
  using (
    auth.uid() is not null
    and user_id = auth.uid()
  );

-- Tarama teklifi: herkes talep gönderebilir
drop policy if exists "scan_quote_insert_anyone" on public.scan_quote_requests;
create policy "scan_quote_insert_anyone"
  on public.scan_quote_requests for insert
  with check (true);

drop policy if exists "scan_quote_select_own" on public.scan_quote_requests;
create policy "scan_quote_select_own"
  on public.scan_quote_requests for select
  using (
    auth.uid() is not null
    and user_id = auth.uid()
  );

-- Galeri: herkes okuyabilir (admin yazma service role ile API üzerinden)
drop policy if exists "gallery_select_public" on public.gallery_uploads;
create policy "gallery_select_public"
  on public.gallery_uploads for select
  using (true);

-- NOT: Admin CRUD (ürün/sipariş/talep yönetimi) service_role key ile
-- Next.js API route'larından yapılır — RLS bypass eder.

-- =============================================================================
-- 8. BAŞLANGIÇ ÜRÜN VERİSİ (seed)
-- =============================================================================
insert into public.products (id, name, description, price, stock, image, category, featured, created_at)
values
  (
    'prod-1',
    'Creality Ender 3 V3 SE',
    'Başlangıç ve orta seviye için ideal FDM 3D yazıcı. Otomatik seviyeleme, hızlı montaj ve sessiz çalışma.',
    8990, 12,
    'https://images.unsplash.com/photo-1612815159322-18061b51d4bb?w=800&q=80',
    '3d-print', true, '2025-01-15T10:00:00Z'
  ),
  (
    'prod-2',
    'Bambu Lab A1 Mini Combo',
    'Çok renkli baskı desteği, AMS lite ile birlikte. Kompakt tasarım, profesyonel sonuçlar.',
    15490, 8,
    'https://images.unsplash.com/photo-1631540577673-8259f3d5880c?w=800&q=80',
    '3d-print', true, '2025-01-20T10:00:00Z'
  ),
  (
    'prod-3',
    'Dragon Figürin – Premium PLA',
    'El boyaması hazır, yüksek detaylı ejderha figürü. Masaüstü koleksiyon için mükemmel.',
    450, 25,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    'model', true, '2025-02-01T10:00:00Z'
  ),
  (
    'prod-4',
    'Mimari Bina Modeli – KKTC',
    'Kuzey Kıbrıs mimarisinden ilham alan özel tasarım bina modeli. 1:200 ölçek.',
    680, 15,
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80',
    'model', false, '2025-02-05T10:00:00Z'
  ),
  (
    'prod-5',
    'PLA Filament – Neon Mavi 1kg',
    'Yüksek kaliteli PLA filament. 1.75mm, 220°C baskı sıcaklığı. Parlak neon mavi renk.',
    320, 50,
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    'filament', false, '2025-02-10T10:00:00Z'
  ),
  (
    'prod-6',
    'Nozzle Seti – 0.4mm Brass',
    '5''li pirinç nozzle seti. Tüm standart FDM yazıcılarla uyumlu.',
    180, 40,
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3780?w=800&q=80',
    'accessory', false, '2025-02-12T10:00:00Z'
  ),
  (
    'prod-7',
    'Baskı Plakası – PEI Kaplamalı',
    'Manyetik PEI kaplamalı esnek baskı plakası. 235x235mm. Kolay parça çıkarma.',
    420, 20,
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    'accessory', false, '2025-02-14T10:00:00Z'
  ),
  (
    'prod-8',
    'Kalibrasyon Alet Seti',
    'Feeler gauge, hex anahtar ve termometre içeren profesyonel kalibrasyon seti.',
    290, 18,
    'https://images.unsplash.com/photo-1581092160607-ee22621dd0b3?w=800&q=80',
    'tool', false, '2025-02-16T10:00:00Z'
  )
on conflict (id) do nothing;

-- =============================================================================
-- 9. ÖRNEK SİPARİŞLER (isteğe bağlı — demo)
-- =============================================================================
insert into public.orders (
  id, customer_name, phone, address, items, note,
  payment_method, status, total, created_at
)
values
  (
    'ord-1', 'Ahmet Yılmaz', '+90 533 123 4567',
    'Lefkoşa, KKTC – Gönyeli Mah. No:12',
    '[{"productId":"prod-1","productName":"Creality Ender 3 V3 SE","quantity":1,"price":8990}]'::jsonb,
    'Akşam saatlerinde teslim edilebilir.',
    'kapida-odeme', 'hazirlaniyor', 8990, '2025-05-10T14:30:00Z'
  ),
  (
    'ord-2', 'Zeynep Korkmaz', '+90 542 987 6543',
    'Girne, KKTC – Alsancak Cad. No:45',
    '[{"productId":"prod-3","productName":"Dragon Figürin – Premium PLA","quantity":2,"price":450},{"productId":"prod-5","productName":"PLA Filament – Neon Mavi 1kg","quantity":3,"price":320}]'::jsonb,
    null,
    'kapida-odeme', 'yeni', 1860, '2025-05-15T09:15:00Z'
  ),
  (
    'ord-3', 'Mehmet Demir', '+90 548 111 2233',
    'Mağusa, KKTC – Maraş Cad. No:8',
    '[{"productId":"prod-2","productName":"Bambu Lab A1 Mini Combo","quantity":1,"price":15490}]'::jsonb,
    null,
    'kapida-odeme', 'kargoda', 15490, '2025-05-12T16:45:00Z'
  )
on conflict (id) do nothing;

-- =============================================================================
-- 10. SUPABASE STORAGE (Dashboard → Storage → New bucket)
-- =============================================================================
-- Aşağıdaki bucket'ları Dashboard'dan oluşturun veya SQL ile:
--
-- insert into storage.buckets (id, name, public)
-- values
--   ('product-images', 'product-images', true),
--   ('print-files',    'print-files',    false),
--   ('scan-photos',    'scan-photos',    false);
--
-- STL/3MF dosyaları → print-files
-- Tarama fotoğrafları → scan-photos
-- Ürün görselleri     → product-images

-- =============================================================================
-- 11. AUTH AYARLARI (Dashboard)
-- =============================================================================
-- Authentication → Providers → Email:
--   ✓ Enable Email provider
--   ✗ Confirm email (hemen giriş için kapatın — API service role ile de yapılır)
--
-- Settings → API:
--   NEXT_PUBLIC_SUPABASE_URL      = (Supabase proje URL)
--   NEXT_PUBLIC_SUPABASE_ANON_KEY = (anon / publishable key)
--   SUPABASE_SERVICE_ROLE_KEY     = (service_role — asla client'a koymayın)
