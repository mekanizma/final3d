-- Ürün kategorileri: model, figure, accessory
alter table public.products drop constraint if exists products_category_check;

update public.products
set category = 'model'
where category in ('3d-print', 'filament', 'tool', 'model');

update public.products
set category = 'accessory'
where category = 'accessory';

alter table public.products
  add constraint products_category_check
  check (category in ('model', 'figure', 'accessory'));
