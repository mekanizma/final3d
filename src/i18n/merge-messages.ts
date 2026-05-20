export function mergeMessages(
  base: Record<string, unknown>,
  ext: Record<string, unknown>
): Record<string, unknown> {
  const out = { ...base };
  for (const key of Object.keys(ext)) {
    const bv = ext[key];
    const av = base[key];
    if (
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv) &&
      av &&
      typeof av === "object" &&
      !Array.isArray(av)
    ) {
      out[key] = mergeMessages(
        av as Record<string, unknown>,
        bv as Record<string, unknown>
      );
    } else {
      out[key] = bv;
    }
  }
  return out;
}
