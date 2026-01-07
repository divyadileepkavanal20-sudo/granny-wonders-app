export function calculateUnitCost(costs, units) {
  return +(costs / units).toFixed(2);
}

export function suggestSellingPrice(cost, margin) {
  return +(cost + (cost * margin / 100)).toFixed(2);
}

export function calculateFuelCost(distance, mileage, fuelPrice) {
  return +((distance / mileage) * fuelPrice).toFixed(2);
}

export function calculateNetProfit(price, cost, qty, delivery) {
  return +(price * qty - (cost * qty + delivery)).toFixed(2);
}

export function employeePay(type, rate, qty) {
  return type === "PER_KG" ? rate * qty : rate;
}

export function costPerGram(totalBatchCost, batchWeightGrams) {
  return +(totalBatchCost / batchWeightGrams).toFixed(4);
}

export function costPerBottle(costPerGram, bottleSizeGrams) {
  return +(costPerGram * bottleSizeGrams).toFixed(2);
}

export function sellingPrice(cost, marginPercent) {
  return +(cost + (cost * marginPercent) / 100).toFixed(2);
}