const orders = JSON.parse(localStorage.getItem("orders")) || [];
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/* ================= DOM ================= */
const todayOrdersEl = document.getElementById("todayOrders");
const todayRevenueEl = document.getElementById("todayRevenue");
const todayProfitEl = document.getElementById("todayProfit");

const weekOrdersEl = document.getElementById("weekOrders");
const weekProfitEl = document.getElementById("weekProfit");

const monthOrdersEl = document.getElementById("monthOrders");
const monthProfitEl = document.getElementById("monthProfit");

const yearOrdersEl = document.getElementById("yearOrders");
const yearProfitEl = document.getElementById("yearProfit");

const alertsEl = document.getElementById("alertsList");
const healthStatusEl = document.getElementById("healthStatus");

/* ================= DATE HELPERS ================= */
const now = new Date();
const today = now.toISOString().split("T")[0];
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

function isThisWeek(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return d >= start;
}

/* ================= TOTALS ================= */
let todayOrders = 0,
  todayRevenue = 0,
  todayProfit = 0;

let weekOrders = 0,
  weekProfit = 0;

let monthOrders = 0,
  monthProfit = 0;

let yearOrders = 0,
  yearProfit = 0;

/* ================= PROCESS ORDERS ================= */
orders.forEach(o => {
  const d = new Date(o.date);

  // TODAY
  if (o.date === today) {
    todayOrders++;
    todayRevenue += o.revenue;
    todayProfit += o.profit;
  }

  // WEEK
  if (isThisWeek(o.date)) {
    weekOrders++;
    weekProfit += o.profit;
  }

  // MONTH
  if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
    monthOrders++;
    monthProfit += o.profit;
  }

  // YEAR
  if (d.getFullYear() === currentYear) {
    yearOrders++;
    yearProfit += o.profit;
  }
});

/* ================= SUBTRACT MONTH/YEAR EXPENSES ================= */
const monthExpenses = expenses
  .filter(e => e.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`))
  .reduce((sum, e) => sum + e.amount, 0);

const yearExpenses = expenses
  .filter(e => e.date.startsWith(String(currentYear)))
  .reduce((sum, e) => sum + e.amount, 0);

monthProfit -= monthExpenses;
yearProfit -= yearExpenses;

/* ================= RENDER ================= */
todayOrdersEl.innerText = todayOrders;
todayRevenueEl.innerText = "₹" + todayRevenue.toFixed(2);
setProfit(todayProfitEl, todayProfit);

weekOrdersEl.innerText = weekOrders;
setProfit(weekProfitEl, weekProfit);

monthOrdersEl.innerText = monthOrders;
setProfit(monthProfitEl, monthProfit);

yearOrdersEl.innerText = yearOrders;
setProfit(yearProfitEl, yearProfit);

/* ================= HEALTH & ALERTS ================= */
alertsEl.innerHTML = "";

if (monthProfit < 0) {
  addAlert("❌ Business is running at a loss. Review pricing & expenses.");
  healthStatusEl.innerText = "Business health: ❌ Loss";
  healthStatusEl.style.color = "var(--danger)";
} else {
  addAlert("✅ Business is healthy. Expenses accounted correctly.");
  healthStatusEl.innerText = "Business health: ✅ Healthy";
  healthStatusEl.style.color = "var(--primary)";
}

/* ================= HELPERS ================= */
function setProfit(el, value) {
  el.innerText = "₹" + value.toFixed(2);
  el.classList.remove("profit-positive", "profit-negative");

  if (value < 0) {
    el.classList.add("profit-negative");
  } else {
    el.classList.add("profit-positive");
  }
}

function addAlert(text) {
  const li = document.createElement("li");
  li.innerText = text;
  alertsEl.appendChild(li);
}