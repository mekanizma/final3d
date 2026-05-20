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

function blobToFile(value: Blob, fallbackName: string): File {
  if (typeof File !== "undefined" && value instanceof File && value.name) {
    return value;
  }
  const name =
    typeof File !== "undefined" && value instanceof File && value.name
      ? value.name
      : fallbackName;
  return new File([value], name, {
    type: value.type || "application/octet-stream",
  });
}

export function readFormFile(
  fd: MultipartForm,
  key: string,
  fallbackName = "model.stl"
): File | null {
  for (const [k, value] of fd.entries()) {
    if (k !== key) continue;
    if (typeof value === "string") continue;
    if (value && typeof value === "object" && "size" in value && value.size > 0) {
      return blobToFile(value as Blob, fallbackName);
    }
  }
  return null;
}

export function readFormBool(fd: MultipartForm, key: string): boolean {
  return readFormString(fd, key) === "true";
}
