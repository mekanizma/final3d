import type { Content, TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import type { SalesReport } from "@/lib/billing/buildReport";
import { moneyText } from "@/lib/billing/buildReport";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

type PdfMakeInstance = {
  vfs?: Record<string, string>;
  createPdf: (doc: TDocumentDefinitions) => {
    getBuffer: (cb: (buf: Uint8Array) => void) => void;
  };
};

async function getPdfMake(): Promise<PdfMakeInstance> {
  const pdfMake = (await import("pdfmake/build/pdfmake"))
    .default as PdfMakeInstance;
  const pdfFonts = await import("pdfmake/build/vfs_fonts");
  const vfs =
    (pdfFonts as { pdfMake?: { vfs?: Record<string, string> } }).pdfMake?.vfs ??
    (pdfFonts as { default?: { pdfMake?: { vfs?: Record<string, string> } } })
      .default?.pdfMake?.vfs;
  if (vfs) pdfMake.vfs = vfs;
  return pdfMake;
}

function cell(text: string, extra?: Partial<TableCell>): TableCell {
  return { text, ...(extra ?? {}) } as TableCell;
}

function sectionTitle(text: string): Content {
  return {
    text,
    style: "sectionHeader",
    margin: [0, 14, 0, 6] as [number, number, number, number],
  };
}

function tableLayout(light = false) {
  return {
    hLineWidth: () => (light ? 0.5 : 1),
    vLineWidth: () => 0,
    hLineColor: () => "#cccccc",
    paddingLeft: () => 6,
    paddingRight: () => 6,
    paddingTop: () => 4,
    paddingBottom: () => 4,
  };
}

export function buildPdfDocument(report: SalesReport): TDocumentDefinitions {
  const { summary, range } = report;

  const summaryTable: Content = {
    table: {
      widths: ["*", "*", "*", "*"],
      body: [
        [
          { text: "Sipariş adedi", style: "tableHeader" },
          { text: "Satılan birim", style: "tableHeader" },
          { text: "Ara toplam", style: "tableHeader" },
          { text: "Toplam ciro", style: "tableHeader" },
        ],
        [
          String(summary.orderCount),
          String(summary.unitsSold),
          moneyText(summary.subtotal),
          moneyText(summary.revenue),
        ],
        [
          { text: "Kargo toplamı", style: "tableHeader" },
          { text: "Ort. sipariş", style: "tableHeader" },
          { text: "Kalem satırı", style: "tableHeader" },
          { text: "Dönem", style: "tableHeader" },
        ],
        [
          moneyText(summary.shippingTotal),
          moneyText(summary.avgOrderValue),
          String(summary.lineItemCount),
          range.label,
        ],
      ],
    },
    layout: tableLayout(),
    margin: [0, 0, 0, 8] as [number, number, number, number],
  };

  const statusBody: TableCell[][] = [
    [
      cell("Durum", { style: "tableHeader" }),
      cell("Adet", { style: "tableHeader" }),
      cell("Ciro", { style: "tableHeader" }),
    ],
    ...summary.byStatus.map((row) => [
      cell(ORDER_STATUS_LABELS[row.status]),
      cell(String(row.count)),
      cell(moneyText(row.revenue)),
    ]),
  ];

  const dailyBody: TableCell[][] =
    report.dailyBreakdown.length > 0
      ? [
          [
            cell("Tarih", { style: "tableHeader" }),
            cell("Sipariş", { style: "tableHeader" }),
            cell("Ara toplam", { style: "tableHeader" }),
            cell("Ciro", { style: "tableHeader" }),
          ],
          ...report.dailyBreakdown.map((d) => [
            cell(d.dateLabel),
            cell(String(d.orderCount)),
            cell(moneyText(d.subtotal)),
            cell(moneyText(d.revenue)),
          ]),
        ]
      : [[cell("Bu dönemde günlük kırılım yok.", { colSpan: 4 })]];

  const ordersBody: TableCell[][] = [
    [
      cell("Tarih", { style: "tableHeader" }),
      cell("Sipariş No", { style: "tableHeader" }),
      cell("Müşteri", { style: "tableHeader" }),
      cell("Durum", { style: "tableHeader" }),
      cell("Toplam", { style: "tableHeader" }),
    ],
    ...(report.orders.length > 0
      ? report.orders.map((o) => [
          cell(o.createdAtLabel),
          cell(o.id),
          cell(o.customerName),
          cell(ORDER_STATUS_LABELS[o.status]),
          cell(moneyText(o.total)),
        ])
      : [[cell("Kayıt yok", { colSpan: 5, alignment: "center" })]]),
  ];

  const orderDetailBlocks: Content[] = report.orders.flatMap((o) => {
    const itemRows: TableCell[][] = [
      [
        cell("Ürün", { style: "tableHeader" }),
        cell("Adet", { style: "tableHeader" }),
        cell("Birim", { style: "tableHeader" }),
        cell("Satır", { style: "tableHeader" }),
      ],
      ...o.items.map((it) => [
        cell(it.productName),
        cell(String(it.quantity)),
        cell(moneyText(it.price)),
        cell(moneyText(it.price * it.quantity)),
      ]),
    ];
    return [
      {
        text: `${o.id} — ${o.customerName} (${o.phone})`,
        style: "orderBlockTitle",
        margin: [0, 8, 0, 4] as [number, number, number, number],
      },
      {
        columns: [
          { text: `Tarih: ${o.createdAtLabel}`, width: "*" },
          { text: `Durum: ${ORDER_STATUS_LABELS[o.status]}`, width: "auto" },
          { text: `Toplam: ${moneyText(o.total)}`, width: "auto" },
        ],
        fontSize: 9,
        color: "#444444",
      },
      {
        text: `Adres: ${o.address}`,
        fontSize: 8,
        color: "#666666",
        margin: [0, 2, 0, 4] as [number, number, number, number],
      },
      ...(o.userEmail
        ? [
            {
              text: `E-posta: ${o.userEmail}`,
              fontSize: 8,
              color: "#666666",
            } as Content,
          ]
        : []),
      ...(o.note
        ? [
            {
              text: `Not: ${o.note}`,
              fontSize: 8,
              color: "#666666",
              margin: [0, 2, 0, 4] as [number, number, number, number],
            } as Content,
          ]
        : []),
      {
        table: {
          widths: ["*", 40, 70, 70],
          body: itemRows,
        },
        layout: tableLayout(true),
        margin: [0, 0, 0, 6] as [number, number, number, number],
      },
      {
        columns: [
          { text: `Ara toplam: ${moneyText(o.subtotal)}`, fontSize: 9 },
          { text: `Kargo: ${moneyText(o.shippingFee)}`, fontSize: 9 },
          {
            text: `Genel toplam: ${moneyText(o.total)}`,
            fontSize: 9,
            bold: true,
          },
        ],
      },
    ];
  });

  const lineItemsBody: TableCell[][] = [
    [
      cell("Tarih", { style: "tableHeader" }),
      cell("Sipariş", { style: "tableHeader" }),
      cell("Ürün", { style: "tableHeader" }),
      cell("Adet", { style: "tableHeader" }),
      cell("Birim", { style: "tableHeader" }),
      cell("Satır", { style: "tableHeader" }),
    ],
    ...(report.lineItems.length > 0
      ? report.lineItems.map((li) => [
          cell(li.orderDateLabel),
          cell(li.orderId),
          cell(li.productName),
          cell(String(li.quantity)),
          cell(moneyText(li.unitPrice)),
          cell(moneyText(li.lineTotal)),
        ])
      : [[cell("Kayıt yok", { colSpan: 6, alignment: "center" })]]),
  ];

  const content: Content[] = [
    {
      columns: [
        {
          stack: [
            { text: "FINAL3D", style: "brand" },
            { text: "Satış & Faturalandırma Raporu", style: "subtitle" },
          ],
        },
        {
          stack: [
            { text: range.label, alignment: "right", style: "meta" },
            {
              text: `Oluşturulma: ${report.generatedAtLabel}`,
              alignment: "right",
              style: "metaSmall",
            },
          ],
        },
      ],
      margin: [0, 0, 0, 12] as [number, number, number, number],
    },
    sectionTitle("Özet"),
    summaryTable,
    sectionTitle("Sipariş durumlarına göre"),
    {
      table: { widths: ["*", 60, 90], body: statusBody },
      layout: tableLayout(),
    },
    sectionTitle("Günlük kırılım"),
    {
      table: { widths: [80, 50, "*", 90], body: dailyBody },
      layout: tableLayout(),
    },
    sectionTitle("Sipariş listesi"),
    {
      table: {
        widths: [85, 95, "*", 70, 65],
        body: ordersBody,
      },
      layout: tableLayout(),
    },
    { text: "", pageBreak: "after" as const },
    sectionTitle("Sipariş detayları (kalemler)"),
    ...(orderDetailBlocks.length > 0
      ? orderDetailBlocks
      : [{ text: "Bu dönemde sipariş yok.", italics: true }]),
    { text: "", pageBreak: "after" as const },
    sectionTitle("Tüm satış kalemleri"),
    {
      table: {
        widths: [75, 80, "*", 35, 55, 55],
        body: lineItemsBody,
      },
      layout: tableLayout(true),
    },
    {
      text: "Bu belge FINAL3D yönetim panelinden otomatik üretilmiştir. Resmi fatura yerine geçmez; iç raporlama amaçlıdır.",
      style: "footer",
      margin: [0, 16, 0, 0] as [number, number, number, number],
    },
  ];

  return {
    pageSize: "A4",
    pageMargins: [40, 48, 40, 48],
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
      color: "#1a1a2e",
    },
    styles: {
      brand: { fontSize: 22, bold: true, color: "#7c3aed" },
      subtitle: { fontSize: 12, color: "#4b5563", margin: [0, 4, 0, 0] },
      meta: { fontSize: 10, bold: true },
      metaSmall: { fontSize: 8, color: "#6b7280" },
      sectionHeader: { fontSize: 12, bold: true, color: "#5b21b6" },
      tableHeader: { bold: true, fillColor: "#f3e8ff", fontSize: 9 },
      orderBlockTitle: { fontSize: 10, bold: true, color: "#312e81" },
      footer: { fontSize: 8, color: "#9ca3af", italics: true },
    },
    content,
    footer: (currentPage: number, pageCount: number) => ({
      text: `Sayfa ${currentPage} / ${pageCount}`,
      alignment: "center",
      fontSize: 8,
      color: "#9ca3af",
      margin: [0, 8, 0, 0],
    }),
  };
}

export async function generateSalesPdfBuffer(
  report: SalesReport
): Promise<Buffer> {
  const pdfMake = await getPdfMake();
  const doc = buildPdfDocument(report);
  const pdf = pdfMake.createPdf(doc);
  return new Promise((resolve, reject) => {
    pdf.getBuffer((buffer: Uint8Array) => {
      try {
        resolve(Buffer.from(buffer));
      } catch (e) {
        reject(e);
      }
    });
  });
}
