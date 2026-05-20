import Busboy from "busboy";
import { Readable } from "node:stream";

export type ParsedMultipartFile = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
};

export type ParsedMultipart = {
  fields: Record<string, string>;
  files: Record<string, ParsedMultipartFile>;
};

function fileFromBuffer(
  buffer: Buffer,
  filename: string,
  mimeType: string
): ParsedMultipartFile {
  return {
    buffer,
    filename: filename || "file",
    mimeType: mimeType || "application/octet-stream",
    size: buffer.length,
  };
}

/** req.formData() yerine — undici/Next.js multipart hatalarını önler */
export async function parseMultipartRequest(
  req: Request
): Promise<ParsedMultipart> {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    throw new Error("multipart/form-data bekleniyor.");
  }
  if (!/boundary=/i.test(contentType)) {
    throw new Error(
      "Geçersiz form gönderimi (boundary eksik). Sayfayı yenileyip tekrar deneyin."
    );
  }

  const body = Buffer.from(await req.arrayBuffer());
  if (!body.length) {
    throw new Error("Boş form gövdesi.");
  }

  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: Record<string, ParsedMultipartFile> = {};
    const pending: Promise<void>[] = [];

    const busboy = Busboy({
      headers: { "content-type": contentType },
      limits: { fileSize: 52 * 1024 * 1024 },
    });

    busboy.on("field", (name, value) => {
      fields[name] = String(value);
    });

    busboy.on("file", (name, stream, info) => {
      const chunks: Buffer[] = [];
      const done = new Promise<void>((res, rej) => {
        stream.on("data", (chunk: Buffer) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          if (buffer.length) {
            files[name] = fileFromBuffer(
              buffer,
              info.filename,
              info.mimeType
            );
          }
          res();
        });
        stream.on("error", rej);
      });
      pending.push(done);
    });

    busboy.on("finish", () => {
      void Promise.all(pending)
        .then(() => resolve({ fields, files }))
        .catch(reject);
    });

    busboy.on("error", (err) => {
      reject(
        err instanceof Error
          ? err
          : new Error("Form verisi okunamadı. Dosya boyutunu kontrol edin.")
      );
    });

    Readable.from(body).pipe(busboy);
  });
}

export function multipartFileToWebFile(
  parsed: ParsedMultipartFile,
  fieldName: string
): File {
  const blob = new Blob([new Uint8Array(parsed.buffer)], {
    type: parsed.mimeType,
  });
  return new File([blob], parsed.filename || fieldName, {
    type: parsed.mimeType,
  });
}
