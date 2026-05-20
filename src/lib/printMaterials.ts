export const PRINT_MATERIALS = [
  {
    id: "pla",
    label: "PLA",
    hint: "Detaylı baskı, dekoratif parçalar",
    color: "text-emerald-300",
  },
  {
    id: "abs",
    label: "ABS",
    hint: "Dayanıklı, ısıya daha dirençli",
    color: "text-amber-300",
  },
  {
    id: "petg",
    label: "PETG",
    hint: "Esnek ve sağlam, günlük kullanım",
    color: "text-cyan-300",
  },
  {
    id: "tpu",
    label: "TPU",
    hint: "Esnek, darbe emici parçalar",
    color: "text-fuchsia-300",
  },
] as const;

export type PrintMaterialId = (typeof PRINT_MATERIALS)[number]["id"];

export function getMaterialLabel(id: string): string {
  return PRINT_MATERIALS.find((m) => m.id === id)?.label ?? id.toUpperCase();
}
