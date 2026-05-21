import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CustomPrintQuoteDocument,
  QuotePdfType,
  ScanQuoteDocument,
} from "@/lib/billing/quoteTypes";
import { quoteGrandTotal } from "@/lib/billing/quoteTypes";
import { generateId } from "@/lib/utils";

export type DbAdminQuoteRow = {
  id: string;
  quote_type: QuotePdfType;
  quote_no: string;
  issued_at: string;
  valid_until: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string | null;
  total_amount: number | string;
  document: ScanQuoteDocument | CustomPrintQuoteDocument;
  created_at: string;
  updated_at: string;
};

export type AdminQuoteListItem = {
  id: string;
  quoteType: QuotePdfType;
  quoteNo: string;
  issuedAt: string;
  validUntil: string;
  clientName: string;
  totalAmount: number;
  createdAt: string;
};

function rowFromDocument(
  type: QuotePdfType,
  doc: ScanQuoteDocument | CustomPrintQuoteDocument
) {
  return {
    quote_type: type,
    quote_no: doc.quoteNo,
    issued_at: doc.issuedAt,
    valid_until: doc.validUntil,
    client_name: doc.client.name.trim(),
    client_email: doc.client.email.trim(),
    client_phone: doc.client.phone.trim(),
    client_company: doc.client.company?.trim() || null,
    total_amount: quoteGrandTotal(doc.lineItems),
    document: doc,
  };
}

export async function saveAdminQuoteDocument(
  type: QuotePdfType,
  doc: ScanQuoteDocument | CustomPrintQuoteDocument
): Promise<DbAdminQuoteRow> {
  const supabase = createAdminClient();
  const id = generateId("aqd");
  const payload = { id, ...rowFromDocument(type, doc) };

  const { data, error } = await supabase
    .from("admin_quote_documents")
    .upsert(payload, { onConflict: "quote_no" })
    .select("*")
    .single();

  if (error) throw error;
  return data as DbAdminQuoteRow;
}

export async function listAdminQuoteDocuments(
  type?: QuotePdfType
): Promise<AdminQuoteListItem[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("admin_quote_documents")
    .select(
      "id, quote_type, quote_no, issued_at, valid_until, client_name, total_amount, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (type) query = query.eq("quote_type", type);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    quoteType: row.quote_type as QuotePdfType,
    quoteNo: row.quote_no as string,
    issuedAt: row.issued_at as string,
    validUntil: row.valid_until as string,
    clientName: row.client_name as string,
    totalAmount: Number(row.total_amount),
    createdAt: row.created_at as string,
  }));
}

export async function getAdminQuoteDocument(
  id: string
): Promise<ScanQuoteDocument | CustomPrintQuoteDocument | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_quote_documents")
    .select("document")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data?.document) return null;
  return data.document as ScanQuoteDocument | CustomPrintQuoteDocument;
}
