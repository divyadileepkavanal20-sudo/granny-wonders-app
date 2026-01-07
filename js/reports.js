const orders = JSON.parse(localStorage.getItem("orders")) || [];
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const employees = JSON.parse(localStorage.getItem("employees")) || [];

const monthEl = document.getElementById("monthSelect");

const revEl = document.getElementById("rev");
const costEl = document.getElementById("cost");
const deliveryEl = document.getElementById("delivery");
const expEl = document.getElementById("exp");
const salaryEl = document.getElementById("salary");
const netEl = document.getElementById("net");

const insightsEl = document.getElementById("aiInsights");

// Default current month
monthEl.value = new Date().toISOString().slice(0, 7);
render();

monthEl.addEventListener("change", render);

function render() {
  insightsEl.innerHTML = "";

  const month = monthEl.value;

  let revenue = 0;
  let productCost = 0;
  let deliveryCost = 0;
  let expenseTotal = 0;
  let salaryTotal = 0;

  // Orders
  const monthlyOrders = orders.filter(o => o.date.startsWith(month));
  monthlyOrders.forEach(o => {
    revenue += o.revenue || 0;
    productCost += o.cost || 0;
    deliveryCost += o.deliveryCost || 0;
  });

  // Expenses
  expenses
    .filter(e => e.date.startsWith(month))
    .forEach(e => {
      expenseTotal += e.amount || 0;
    });

  // Employee salary
  monthlyOrders.forEach(() => {
    employees.forEach(e => {
      salaryTotal += e.rate || 0;
    });
  });

  const netProfit =
    revenue -
    productCost -
    deliveryCost -
    expenseTotal -
    salaryTotal;

  // Render P&L
  revEl.innerText = "₹" + revenue.toFixed(2);
  costEl.innerText = "₹" + productCost.toFixed(2);
  deliveryEl.innerText = "₹" + deliveryCost.toFixed(2);
  expEl.innerText = "₹" + expenseTotal.toFixed(2);
  salaryEl.innerText = "₹" + salaryTotal.toFixed(2);

  netEl.innerText = "₹" + netProfit.toFixed(2);
  netEl.style.color = netProfit >= 0 ? "green" : "red";

  // ================= AI INSIGHTS =================
  generateAIInsights({
    revenue,
    productCost,
    deliveryCost,
    expenseTotal,
    salaryTotal,
    netProfit
  });
}

/* ================= AI LOGIC ================= */
function generateAIInsights(data) {
  const {
    revenue,
    productCost,
    deliveryCost,
    expenseTotal,
    salaryTotal,
    netProfit
  } = data;

  if (revenue === 0) {
    addInsight("ℹ️ No sales this month. Focus on marketing and outreach.");
    return;
  }

  const margin = (netProfit / revenue) * 100;

  if (netProfit < 0) {
    addInsight("❌ Business is running at a loss this month.");
    addInsight("👉 Review pricing and reduce unnecessary expenses.");
  }

  if (margin > 0 && margin < 15) {
    addInsight(
      `⚠️ Low profit margin (${margin.toFixed(
        1
      )}%). Consider increasing prices slightly.`
    );
  }

  if (salaryTotal > revenue * 0.3) {
    addInsight(
      "⚠️ Employee cost is high compared to revenue. Review workload or pricing."
    );
  }

  if (expenseTotal > revenue * 0.25) {
    addInsight(
      "⚠️ Expenses are consuming a large portion of revenue. Audit monthly expenses."
    );
  }

  if (deliveryCost > revenue * 0.15) {
    addInsight(
      "🚚 Delivery cost is high. Consider charging customers or switching courier."
    );
  }

  if (margin >= 25) {
    addInsight("✅ Healthy profit margin. Business is performing well.");
    addInsight("💰 Safe to withdraw profit or reinvest in growth.");
  }

  if (!insightsEl.children.length) {
    addInsight("✅ Business metrics look balanced. No immediate action needed.");
  }
}

/* ================= HELPERS ================= */
function addInsight(text) {
  const li = document.createElement("li");
  li.innerText = text;
  insightsEl.appendChild(li);
}