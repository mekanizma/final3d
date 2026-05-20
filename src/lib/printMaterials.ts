export const PRINT_MATERIALS = [
  { id: "pla", color: "text-emerald-300" },
  { id: "abs", color: "text-amber-300" },
  { id: "petg", color: "text-cyan-300" },
  { id: "tpu", color: "text-fuchsia-300" },
] as const;

export type PrintMaterialId = (typeof PRINT_MATERIALS)[number]["id"];

export function getMaterialLabel(
  id: string,
  t: (key: string) => string
): string {
  const key = `printMaterial.${id}.label`;
  const v = t(key);
  return v === key ? id.toUpperCase() : v;
}
