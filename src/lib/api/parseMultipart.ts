export type MultipartForm = {
  entries(): IterableIterator<[string, string | File | Blob]>;
};

export function asMultipartForm(fd: unknown): MultipartForm {
  return fd as MultipartForm;
}

/** Next.js 16 FormData — alan okuma (entries üzerinden). */
export function readFormString(
  fd: MultipartForm,
  key: string,
  fallback = ""
): string {
  for (const [k, value] of fd.entries()) {
    if (k !== key) continue;
    if (typeof value === "string") return value.trim();
  }
  return fallback;
}

export function readFormFile(fd: MultipartForm, key: string): File | null {
  for (const [k, value] of fd.entries()) {
    if (k !== key) continue;
    if (typeof value === "object" && value !== null && "size" in value) {
      const f = value as File;
      if (f.size > 0) return f;
    }
  }
  return null;
}

export function readFormBool(fd: MultipartForm, key: string): boolean {
  return readFormString(fd, key) === "true";
}
