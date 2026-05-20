/** 3D baskı birim maliyet ve satış fiyatı hesabı (kar marjı yok — satış = üretim maliyeti) */

export const PRINT_COST_DEFAULTS = {
  filamentPricePerKg: 450,
  printGrams: 50,
  printHours: 2,
  printMinutes: 30,
  powerWatts: 150,
  electricityPricePerKwh: 3.2,
  quantity: 1,
} as const;

export interface PrintCostInputs {
  filamentPricePerKg: number;
  printGrams: number;
  printHours: number;
  printMinutes: number;
  powerWatts: number;
  electricityPricePerKwh: number;
  quantity: number;
}

export interface PrintCostBreakdown {
  printDurationHours: number;
  costPerGram: number;
  filamentCost: number;
  energyKwh: number;
  electricityCost: number;
  productionCost: number;
  unitSalePrice: number;
  totalSalePrice: number;
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function getPrintDurationHours(hours: number, minutes: number): number {
  const h = Math.max(0, hours);
  const m = Math.max(0, Math.min(59, minutes));
  return roundMoney(h + m / 60);
}

/** Kayıtlı ayarlardan yüklerken eski kar marjı alanını yok sayar */
export function parsePrintCostInputs(raw: unknown): PrintCostInputs {
  const r =
    raw && typeof raw === "object"
      ? (raw as Record<string, unknown>)
      : {};
  const num = (key: keyof PrintCostInputs, fallback: number) => {
    const v = r[key];
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
  };
  return {
    filamentPricePerKg: num("filamentPricePerKg", PRINT_COST_DEFAULTS.filamentPricePerKg),
    printGrams: num("printGrams", PRINT_COST_DEFAULTS.printGrams),
    printHours: num("printHours", PRINT_COST_DEFAULTS.printHours),
    printMinutes: num("printMinutes", PRINT_COST_DEFAULTS.printMinutes),
    powerWatts: num("powerWatts", PRINT_COST_DEFAULTS.powerWatts),
    electricityPricePerKwh: num(
      "electricityPricePerKwh",
      PRINT_COST_DEFAULTS.electricityPricePerKwh
    ),
    quantity: Math.max(1, Math.floor(num("quantity", PRINT_COST_DEFAULTS.quantity))),
  };
}

export function calculatePrintCost(
  inputs: PrintCostInputs
): PrintCostBreakdown {
  const grams = Math.max(0, inputs.printGrams);
  const pricePerKg = Math.max(0, inputs.filamentPricePerKg);
  const qty = Math.max(1, Math.floor(inputs.quantity) || 1);

  const printDurationHours = getPrintDurationHours(
    inputs.printHours,
    inputs.printMinutes
  );

  const costPerGram = pricePerKg > 0 ? pricePerKg / 1000 : 0;
  const filamentCost = roundMoney(costPerGram * grams);

  const watts = Math.max(0, inputs.powerWatts);
  const kwhPrice = Math.max(0, inputs.electricityPricePerKwh);
  const energyKwh = roundMoney((watts / 1000) * printDurationHours);
  const electricityCost = roundMoney(energyKwh * kwhPrice);

  const productionCost = roundMoney(filamentCost + electricityCost);
  const unitSalePrice = productionCost;
  const totalSalePrice = roundMoney(unitSalePrice * qty);

  return {
    printDurationHours,
    costPerGram: roundMoney(costPerGram),
    filamentCost,
    energyKwh,
    electricityCost,
    productionCost,
    unitSalePrice,
    totalSalePrice,
  };
}
