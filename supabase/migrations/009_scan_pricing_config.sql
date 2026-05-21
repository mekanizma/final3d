-- Admin: 3D tarama fiyat robotu ayarları (JSON)
alter table public.admin_settings
  add column if not exists scan_pricing_config jsonb;
