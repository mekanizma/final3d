-- Admin faturalandırma: oluşturulan 3D tarama / özel baskı teklif formları (PDF öncesi kayıt)
create table if not exists public.admin_quote_documents (
  id              text primary key,
  quote_type      text not null check (quote_type in ('scan', 'custom')),
  quote_no        text not null,
  issued_at       date not null,
  valid_until     date not null,
  client_name     text not null,
  client_email    text not null default '',
  client_phone    text not null default '',
  client_company  text,
  total_amount    numeric(12, 2) not null default 0 check (total_amount >= 0),
  document        jsonb not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint admin_quote_documents_quote_no_key unique (quote_no)
);

create index if not exists admin_quote_documents_type_idx
  on public.admin_quote_documents (quote_type);

create index if not exists admin_quote_documents_created_at_idx
  on public.admin_quote_documents (created_at desc);

create index if not exists admin_quote_documents_client_name_idx
  on public.admin_quote_documents (client_name);

comment on table public.admin_quote_documents is
  'Admin panelinden oluşturulan resmi fiyat teklifleri (PDF). Müşteri web formları: custom_print_requests / scan_quote_requests.';

comment on column public.admin_quote_documents.document is
  'ScanQuoteDocument veya CustomPrintQuoteDocument JSON snapshot (kalemler, şartlar, proje alanları).';

-- Güncelleme zamanı
create or replace function public.set_admin_quote_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_quote_documents_updated_at on public.admin_quote_documents;
create trigger admin_quote_documents_updated_at
  before update on public.admin_quote_documents
  for each row execute function public.set_admin_quote_updated_at();

-- Yalnızca service role (admin API) erişir
alter table public.admin_quote_documents enable row level security;
