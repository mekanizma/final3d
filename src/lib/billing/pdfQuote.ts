import type { Content, TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import { moneyText } from "@/lib/billing/buildReport";
import {
  cell,
  PDF_DOC_STYLES,
  pdfToBuffer,
  sectionTitle,
  tableLayout,
} from "@/lib/billing/pdfMakeClient";
import {
  formatQuoteDate,
  printMaterialLabel,
  scanLocationLabel,
  scanPurposeLabel,
  scanSurfaceLabel,
} from "@/lib/billing/quoteLabels";
import type { CustomPrintQuoteDocument, ScanQuoteDocument } from "@/lib/billing/quoteTypes";
import {
  lineItemTotal,
  quoteGrandTotal,
} from "@/lib/billing/quoteTypes";

function quoteHeader(
  docTitle: string,
  quoteNo: string,
  issuedAt: string,
  validUntil: string
): Content {
  return {
    columns: [
      {
        width: "*",
        stack: [
          { text: "FINAL3D", style: "brand" },
          {
            text: "FINAL3D PRINTER CENTER · KKTC",
            style: "brandSub",
          },
          { text: docTitle, style: "docTitle", margin: [0, 10, 0, 0] },
        ],
      },
      {
        width: 180,
        stack: [
          { text: "TEKLİF FORMU", style: "metaBold", alignment: "right" },
          {
            text: `Teklif No: ${quoteNo}`,
            style: "meta",
            alignment: "right",
            margin: [0, 6, 0, 0],
          },
          {
            text: `Tarih: ${formatQuoteDate(issuedAt)}`,
            style: "meta",
            alignment: "right",
          },
          {
            text: `Geçerlilik: ${formatQuoteDate(validUntil)}`,
            style: "meta",
            alignment: "right",
          },
        ],
      },
    ],
    margin: [0, 0, 0, 16] as [number, number, number, number],
  };
}

function clientBlock(client: {
  name: string;
  email: string;
  phone: string;
  company?: string;
}): Content {
  const rows: TableCell[][] = [
    [
      cell("Müşteri", { style: "tableHeader" }),
      cell("İletişim", { style: "tableHeader" }),
    ],
    [
      cell(
        [client.company, client.name].filter(Boolean).join("\n") || "—"
      ),
      cell(
        [client.phone ? `Tel: ${client.phone}` : "", client.email ? `E-posta: ${client.email}` : ""]
          .filter(Boolean)
          .join("\n") || "—"
      ),
    ],
  ];
  return {
    table: { widths: ["*", "*"], body: rows },
    layout: tableLayout(true),
  };
}

function pricingTable(
  lineItems: { description: string; quantity: number; unitPrice: number }[]
): Content {
  const body: TableCell[][] = [
    [
      cell("Açıklama", { style: "tableHeader" }),
      cell("Adet", { style: "tableHeader", alignment: "center" }),
      cell("Birim fiyat", { style: "tableHeader", alignment: "right" }),
      cell("Tutar", { style: "tableHeader", alignment: "right" }),
    ],
    ...lineItems.map((item) => [
      cell(item.description || "—"),
      cell(String(item.quantity), { alignment: "center" }),
      cell(moneyText(item.unitPrice), { alignment: "right" }),
      cell(moneyText(lineItemTotal(item)), {
        alignment: "right",
        bold: true,
      }),
    ]),
  ];

  const total = quoteGrandTotal(lineItems);

  return {
    stack: [
      sectionTitle("Fiyat teklifi"),
      {
        table: { widths: ["*", 40, 75, 75], body },
        layout: tableLayout(),
      },
      {
        columns: [
          { width: "*", text: "" },
          {
            width: 200,
            table: {
              widths: ["*", 90],
              body: [
                [
                  cell("GENEL TOPLAM", { bold: true, alignment: "right" }),
                  cell(moneyText(total), {
                    style: "totalBox",
                    alignment: "right",
                    fontSize: 12,
                    bold: true,
                    color: "#6d28d9",
                  }),
                ],
              ],
            },
            layout: "noBorders",
            margin: [0, 8, 0, 0] as [number, number, number, number],
          },
        ],
      },
    ],
  };
}

function detailRow(label: string, value: string): TableCell[] {
  return [cell(label, { style: "label" }), cell(value || "—", { style: "value" })];
}

function buildBaseDoc(
  title: string,
  quoteNo: string,
  issuedAt: string,
  validUntil: string,
  client: ScanQuoteDocument["client"],
  detailRows: TableCell[][],
  lineItems: ScanQuoteDocument["lineItems"],
  adminNote: string,
  terms: string
): TDocumentDefinitions {
  const content: Content[] = [
    quoteHeader(title, quoteNo, issuedAt, validUntil),
    {
      canvas: [
        {
          type: "rect",
          x: 0,
          y: 0,
          w: 515,
          h: 3,
          color: "#a855f7",
          r: 1,
        },
      ],
      margin: [0, 0, 0, 14] as [number, number, number, number],
    },
    sectionTitle("Müşteri bilgileri"),
    clientBlock(client),
    sectionTitle("Talep / proje detayları"),
    {
      table: { widths: [130, "*"], body: detailRows },
      layout: tableLayout(true),
    },
    pricingTable(lineItems),
    ...(adminNote.trim()
      ? [
          sectionTitle("Ek notlar (FINAL3D)"),
          {
            text: adminNote.trim(),
            style: "value",
            margin: [0, 0, 0, 8] as [number, number, number, number],
          },
        ]
      : []),
    sectionTitle("Şartlar ve koşullar"),
    { text: terms.trim() || "—", style: "terms" },
    {
      text: "Bu belge bilgilendirme amaçlı fiyat teklifidir. Sipariş onayı yazılı veya dijital onay ile kesinleşir.",
      style: "footer",
      margin: [0, 12, 0, 0] as [number, number, number, number],
    },
  ];

  return {
    pageSize: "A4",
    pageMargins: [42, 48, 42, 52] as [number, number, number, number],
    defaultStyle: { font: "Roboto", fontSize: 10, color: "#1e293b" },
    styles: { ...PDF_DOC_STYLES },
    content,
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        {
          text: "final3d.com · info@final3d.com",
          fontSize: 7,
          color: "#94a3b8",
        },
        {
          text: `Sayfa ${currentPage} / ${pageCount}`,
          alignment: "right",
          fontSize: 7,
          color: "#94a3b8",
        },
      ],
      margin: [42, 0, 42, 16] as [number, number, number, number],
    }),
  };
}

export function buildScanQuotePdf(doc: ScanQuoteDocument): TDocumentDefinitions {
  const detailRows: TableCell[][] = [
    detailRow("Nesne / parça", doc.objectDescription),
    detailRow("Taranacak alan", doc.scanArea),
    detailRow("Adet / kopya", doc.quantity),
    detailRow("Tarama yeri", scanLocationLabel(doc.locationType)),
    ...(doc.locationType === "onsite"
      ? [detailRow("Saha adresi", doc.locationAddress)]
      : []),
    detailRow("Şehir", doc.city),
    detailRow("Kullanım amacı", scanPurposeLabel(doc.purpose)),
    detailRow("Yüzey tipi", scanSurfaceLabel(doc.surfaceType)),
    detailRow(
      "3D baskı talebi",
      doc.wantsPrint ? "Evet — tarama sonrası baskı isteniyor" : "Hayır"
    ),
    ...(doc.clientNote.trim()
      ? [detailRow("Müşteri notu", doc.clientNote)]
      : []),
  ];

  return buildBaseDoc(
    "3D TARAMA FİYAT TEKLİFİ",
    doc.quoteNo,
    doc.issuedAt,
    doc.validUntil,
    doc.client,
    detailRows,
    doc.lineItems,
    doc.adminNote,
    doc.terms
  );
}

export function buildCustomPrintQuotePdf(
  doc: CustomPrintQuoteDocument
): TDocumentDefinitions {
  const detailRows: TableCell[][] = [
    detailRow("Malzeme", printMaterialLabel(doc.material)),
    detailRow("Renk", doc.color),
    detailRow("Adet", doc.quantity),
    ...(doc.fileName.trim() ? [detailRow("3D dosya", doc.fileName)] : []),
    ...(doc.clientNote.trim()
      ? [detailRow("Müşteri notu", doc.clientNote)]
      : []),
  ];

  return buildBaseDoc(
    "ÖZEL 3D BASKI FİYAT TEKLİFİ",
    doc.quoteNo,
    doc.issuedAt,
    doc.validUntil,
    doc.client,
    detailRows,
    doc.lineItems,
    doc.adminNote,
    doc.terms
  );
}

export async function generateScanQuotePdfBuffer(
  doc: ScanQuoteDocument
): Promise<Buffer> {
  return pdfToBuffer(buildScanQuotePdf(doc));
}

export async function generateCustomPrintQuotePdfBuffer(
  doc: CustomPrintQuoteDocument
): Promise<Buffer> {
  return pdfToBuffer(buildCustomPrintQuotePdf(doc));
}
