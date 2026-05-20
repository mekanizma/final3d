-- =============================================================================
-- Teklif ekleri: Storage yolu kolonları + private bucket'lar
-- Supabase SQL Editor'da çalıştırın (schema.sql sonrası)
-- =============================================================================

-- Kolonlar
alter table public.custom_print_requests
  add column if not exists file_storage_path text;

alter table public.scan_quote_requests
  add column if not exists photo_storage_path text;

comment on column public.custom_print_requests.file_storage_path is
  'Supabase Storage: print-files bucket içindeki yol (ör. cpr-xxx/model.stl)';

comment on column public.scan_quote_requests.photo_storage_path is
  'Supabase Storage: scan-photos bucket içindeki yol';

create index if not exists custom_print_requests_file_path_idx
  on public.custom_print_requests (file_storage_path)
  where file_storage_path is not null;

create index if not exists scan_quote_requests_photo_path_idx
  on public.scan_quote_requests (photo_storage_path)
  where photo_storage_path is not null;

-- Storage bucket'ları (private — yalnızca service role / imzalı URL)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('print-files', 'print-files', false, 52428800, null),
  ('scan-photos', 'scan-photos', false, 10485760, null)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = null;

-- İsteğe bağlı: authenticated kullanıcı kendi dosyasını görsün (admin API imzalı URL kullanır)
-- Service role ile yükleme API üzerinden yapıldığı için insert policy gerekmez.
