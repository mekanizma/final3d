import type { Content, TableCell, TDocumentDefinitions } from "pdfmake/interfaces";

type PdfMakeModule = {
  virtualfs: {
    writeFileSync: (filename: string, content: Buffer) => void;
  };
  setFonts: (fonts: Record<string, Record<string, string>>) => void;
  createPdf: (doc: TDocumentDefinitions) => {
    getBuffer: () => Promise<Buffer>;
  };
};

let pdfMakeInstance: PdfMakeModule | null = null;

async function getPdfMake(): Promise<PdfMakeModule> {
  if (pdfMakeInstance) return pdfMakeInstance;

  const mod = await import("pdfmake");
  const pdfmake = (mod.default ?? mod) as unknown as PdfMakeModule;

  const vfsMod = await import("pdfmake/build/vfs_fonts.js");
  const vfs =
    (
      vfsMod as {
        pdfMake?: { vfs?: Record<string, string> };
        default?: { pdfMake?: { vfs?: Record<string, string> } };
      }
    ).pdfMake?.vfs ??
    (vfsMod as { default?: { pdfMake?: { vfs?: Record<string, string> } } })
      .default?.pdfMake?.vfs;

  if (!vfs) {
    throw new Error("PDF yazı tipleri (vfs) yüklenemedi.");
  }

  for (const [filename, data] of Object.entries(vfs)) {
    pdfmake.virtualfs.writeFileSync(filename, Buffer.from(data, "base64"));
  }

  pdfmake.setFonts({
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  });

  pdfMakeInstance = pdfmake;
  return pdfmake;
}

export function cell(text: string, extra?: Partial<TableCell>): TableCell {
  return { text, ...(extra ?? {}) } as TableCell;
}

export function sectionTitle(text: string): Content {
  return {
    text,
    style: "sectionHeader",
    margin: [0, 12, 0, 6] as [number, number, number, number],
  };
}

export const PDF_DOC_STYLES = {
  brand: { fontSize: 20, bold: true, color: "#6d28d9" },
  brandSub: {
    fontSize: 11,
    color: "#64748b",
    margin: [0, 2, 0, 0] as [number, number, number, number],
  },
  docTitle: { fontSize: 16, bold: true, color: "#1e1b4b" },
  meta: { fontSize: 9, color: "#475569" },
  metaBold: { fontSize: 9, bold: true, color: "#334155" },
  sectionHeader: { fontSize: 11, bold: true, color: "#5b21b6" },
  tableHeader: {
    bold: true,
    fillColor: "#ede9fe",
    fontSize: 9,
    color: "#4c1d95",
  },
  label: { fontSize: 8, color: "#64748b" },
  value: { fontSize: 10, color: "#1e293b" },
  totalBox: { fontSize: 14, bold: true, color: "#6d28d9" },
  terms: { fontSize: 8, color: "#64748b", lineHeight: 1.25 },
  footer: { fontSize: 7, color: "#94a3b8", italics: true },
} as const;

export function tableLayout(light = false) {
  return {
    hLineWidth: () => (light ? 0.5 : 0.8),
    vLineWidth: () => 0,
    hLineColor: () => "#e2e8f0",
    paddingLeft: () => 6,
    paddingRight: () => 6,
    paddingTop: () => 4,
    paddingBottom: () => 4,
  };
}

export async function pdfToBuffer(doc: TDocumentDefinitions): Promise<Buffer> {
  const pdfmake = await getPdfMake();
  const pdf = pdfmake.createPdf(doc);
  return pdf.getBuffer();
}
