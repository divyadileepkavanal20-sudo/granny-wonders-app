/* ================= STORAGE ================= */
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/* ================= DOM ================= */
const reportTypeEl = document.getElementById("reportType");
const fromDateEl = document.getElementById("fromDate");
const toDateEl = document.getElementById("toDate");
const customDatesEl = document.getElementById("customDates");

const revenueEl = document.getElementById("revenue");
const productCostEl = document.getElementById("productCost");
const deliveryCostEl = document.getElementById("deliveryCost");
const expensesEl = document.getElementById("expenses");
const profitEl = document.getElementById("profit");
const aiInsightsEl = document.getElementById("aiInsights");

/* ================= DATE HELPERS ================= */
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  return {
    from: start.toISOString().split("T")[0],
    to: todayStr()
  };
}

function getMonthRange() {
  const now = new Date();
  const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,"0")}-01`;
  return { from, to: todayStr() };
}

function getYearRange() {
  const now = new Date();
  return { from: `${now.getFullYear()}-01-01`, to: todayStr() };
}

/* ================= EVENTS ================= */
reportTypeEl.addEventListener("change", handleTypeChange);
document.addEventListener("input", calculateReport);

handleTypeChange();
calculateReport();

/* ================= FILTER ================= */
function getDateRange() {
  switch (reportTypeEl.value) {
    case "daily":
      return { from: todayStr(), to: todayStr() };

    case "weekly":
      return getWeekRange();

    case "monthly":
      return getMonthRange();

    case "yearly":
      return getYearRange();

    case "custom":
      if (!fromDateEl.value || !toDateEl.value) return null;
      return { from: fromDateEl.value, to: toDateEl.value };
  }
}

/* ================= MAIN CALCULATION ================= */
function calculateReport() {
  const range = getDateRange();
  if (!range) return;

  let revenue = 0;
  let productCost = 0;
  let deliveryCost = 0;

  orders.forEach(o => {
    if (o.date >= range.from && o.date <= range.to) {
      revenue += o.revenue || 0;
      productCost += o.cost || 0;
      deliveryCost += o.deliveryCost || 0;
    }
  });

  const totalExpenses = expenses
    .filter(e => e.date >= range.from && e.date <= range.to)
    .reduce((sum, e) => sum + e.amount, 0);

  const netProfit =
    revenue - productCost - deliveryCost - totalExpenses;

  revenueEl.innerText = "₹" + revenue.toFixed(2);
  productCostEl.innerText = "₹" + productCost.toFixed(2);
  deliveryCostEl.innerText = "₹" + deliveryCost.toFixed(2);
  expensesEl.innerText = "₹" + totalExpenses.toFixed(2);
  profitEl.innerText = "₹" + netProfit.toFixed(2);

  renderAI(revenue, totalExpenses, netProfit);
}

/* ================= AI ================= */
function renderAI(revenue, expenses, profit) {
  aiInsightsEl.innerHTML = "";

  if (profit < 0) addAI("❌ Business is running at a loss.");
  if (expenses > revenue * 0.3 && revenue > 0)
    addAI("⚠️ Expenses exceed 30% of revenue.");
  if (profit > 0 && profit / revenue > 0.25)
    addAI("✅ Healthy profit margin.");

  if (!aiInsightsEl.children.length)
    addAI("✅ No critical issues detected.");
}

function addAI(text) {
  const li = document.createElement("li");
  li.innerText = text;
  aiInsightsEl.appendChild(li);
}

/* ================= UI ================= */
function handleTypeChange() {
  customDatesEl.style.display =
    reportTypeEl.value === "custom" ? "block" : "none";
  calculateReport();
}