function getAIAdvice() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  let profit = orders.reduce((s, o) => s + o.profit, 0);
  let expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
  let pendingSalary = employees.reduce((s, e) => s + (e.pending || 0), 0);

  const advice = [];

  if (profit <= 0) {
    advice.push("❌ Business is running at a loss. Do not withdraw profit.");
  }

  if (expenseTotal > profit * 0.4) {
    advice.push("⚠️ Expenses are high. Review recurring costs.");
  }

  if (pendingSalary > profit * 0.3) {
    advice.push("⚠️ Employee payments are pending. Clear before withdrawal.");
  }

  if (profit > expenseTotal * 2) {
    advice.push("✅ Business is healthy. Safe to reinvest or withdraw.");
  }

  return advice;
}

function pricingOptimizer(products) {
  const suggestions = [];

  products.forEach(p => {
    p.pricing.forEach(price => {
      const selling = parseFloat(price.price.replace("₹", ""));
      const cost = parseFloat(price.cost.replace("₹", ""));
      const margin = ((selling - cost) / cost) * 100;

      if (margin < 15) {
        suggestions.push(
          `⚠️ ${p.name} ${price.size} margin low (${margin.toFixed(
            1
          )}%). Consider price increase.`
        );
      }

      if (margin > 40) {
        suggestions.push(
          `⚠️ ${p.name} ${price.size} may be overpriced.`
        );
      }
    });
  });

  return suggestions;
}

function detectLossOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  return orders.filter(o => o.profit < 0);
}