export function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export function formatPercent(value) {
  return `${value}%`;
}