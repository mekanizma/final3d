-- Ürün başına birden fazla görsel (images); image = kapak (ilk görsel)
alter table public.products
  add column if not exists images jsonb not null default '[]'::jsonb;

comment on column public.products.images is
  'Ürün galerisi URL listesi; image sütunu kapak görseli (images[0]) ile senkron tutulur.';

update public.products
set images = jsonb_build_array(image)
where images = '[]'::jsonb
  and image is not null
  and trim(image) <> '';
