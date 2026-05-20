-- STL/OBJ MIME kısıtını kaldır (bazı tarayıcılar application/octet-stream gönderir)
update storage.buckets
set allowed_mime_types = null
where id in ('print-files', 'scan-photos');

-- Bucket yoksa oluştur
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('print-files', 'print-files', false, 52428800, null),
  ('scan-photos', 'scan-photos', false, 10485760, null)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = null;
