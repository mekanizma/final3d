/** 3D baskı birim maliyet ve satış fiyatı hesabı */

export const PRINT_COST_DEFAULTS = {
  filamentPricePerKg: 450,
  printGrams: 50,
  printHours: 2,
  printMinutes: 30,
  powerWatts: 150,
  electricityPricePerKwh: 3.2,
  profitMarginPercent: 60,
  quantity: 1,
} as const;

export interface PrintCostInputs {
  filamentPricePerKg: number;
  printGrams: number;
  printHours: number;
  printMinutes: number;
  powerWatts: number;
  electricityPricePerKwh: number;
  profitMarginPercent: number;
  quantity: number;
}

export interface PrintCostBreakdown {
  printDurationHours: number;
  costPerGram: number;
  filamentCost: number;
  energyKwh: number;
  electricityCost: number;
  productionCost: number;
  profitAmount: number;
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

export function calculatePrintCost(
  inputs: PrintCostInputs
): PrintCostBreakdown {
  const grams = Math.max(0, inputs.printGrams);
  const pricePerKg = Math.max(0, inputs.filamentPricePerKg);
  const qty = Math.max(1, Math.floor(inputs.quantity) || 1);
  const margin = Math.max(0, inputs.profitMarginPercent) / 100;

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
  const profitAmount = roundMoney(productionCost * margin);
  const unitSalePrice = roundMoney(productionCost + profitAmount);
  const totalSalePrice = roundMoney(unitSalePrice * qty);

  return {
    printDurationHours,
    costPerGram: roundMoney(costPerGram),
    filamentCost,
    energyKwh,
    electricityCost,
    productionCost,
    profitAmount,
    unitSalePrice,
    totalSalePrice,
  };
}
