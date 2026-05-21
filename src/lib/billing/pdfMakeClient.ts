import { createRequire } from "node:module";
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

const nodeRequire = createRequire(import.meta.url);

/** pdfmake 0.2: pdfMake.vfs — pdfmake 0.3: modül doğrudan { "Roboto-Regular.ttf": base64 } */
function resolveVfsFromModule(mod: unknown): Record<string, string> {
  if (!mod || typeof mod !== "object") return {};

  const legacy = mod as {
    pdfMake?: { vfs?: Record<string, string> };
    default?: { pdfMake?: { vfs?: Record<string, string> } };
  };
  if (legacy.pdfMake?.vfs && typeof legacy.pdfMake.vfs === "object") {
    return legacy.pdfMake.vfs;
  }
  if (legacy.default?.pdfMake?.vfs && typeof legacy.default.pdfMake.vfs === "object") {
    return legacy.default.pdfMake.vfs;
  }

  const candidates: unknown[] = [mod, legacy.default];
  for (const src of candidates) {
    if (!src || typeof src !== "object") continue;
    const entries = Object.entries(src as Record<string, unknown>).filter(
      ([name, data]) =>
        /\.(ttf|otf)$/i.test(name) && typeof data === "string" && data.length > 0
    );
    if (entries.length > 0) {
      return Object.fromEntries(entries) as Record<string, string>;
    }
  }

  return {};
}

async function loadPdfMakeVfs(): Promise<Record<string, string>> {
  try {
    const vfsMod = await import("pdfmake/build/vfs_fonts.js");
    const vfs = resolveVfsFromModule(vfsMod.default ?? vfsMod);
    if (Object.keys(vfs).length > 0) return vfs;
  } catch {
    /* dynamic import — fallback require */
  }

  try {
    const vfsMod = nodeRequire("pdfmake/build/vfs_fonts.js");
    const vfs = resolveVfsFromModule(vfsMod);
    if (Object.keys(vfs).length > 0) return vfs;
  } catch {
    /* ignore */
  }

  throw new Error("PDF yazı tipleri (vfs) yüklenemedi.");
}

let pdfMakeInstance: PdfMakeModule | null = null;

async function getPdfMake(): Promise<PdfMakeModule> {
  if (pdfMakeInstance) return pdfMakeInstance;

  const mod = await import("pdfmake");
  const pdfmake = (mod.default ?? mod) as unknown as PdfMakeModule;

  if (typeof pdfmake.createPdf !== "function") {
    throw new Error("pdfmake modülü geçersiz.");
  }

  const vfs = await loadPdfMakeVfs();

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
