const orders = JSON.parse(localStorage.getItem("orders")) || [];

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
const healthEl = document.getElementById("healthStatus");

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

let totals = {
  todayOrders: 0,
  todayRevenue: 0,
  todayProfit: 0,
  weekOrders: 0,
  weekProfit: 0,
  monthOrders: 0,
  monthProfit: 0,
  yearOrders: 0,
  yearProfit: 0
};

orders.forEach(o => {
  const d = new Date(o.date);

  if (o.date === today) {
    totals.todayOrders++;
    totals.todayRevenue += o.revenue;
    totals.todayProfit += o.profit;
  }

  if (isThisWeek(o.date)) {
    totals.weekOrders++;
    totals.weekProfit += o.profit;
  }

  if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
    totals.monthOrders++;
    totals.monthProfit += o.profit;
  }

  if (d.getFullYear() === currentYear) {
    totals.yearOrders++;
    totals.yearProfit += o.profit;
  }

  if (o.profit < 0) {
    addAlert(`❌ Loss-making order: ${o.product} (${o.size})`);
  }
});

todayOrdersEl.innerText = totals.todayOrders;
todayRevenueEl.innerText = "₹" + totals.todayRevenue.toFixed(2);
todayProfitEl.innerText = "₹" + totals.todayProfit.toFixed(2);

weekOrdersEl.innerText = totals.weekOrders;
weekProfitEl.innerText = "₹" + totals.weekProfit.toFixed(2);

monthOrdersEl.innerText = totals.monthOrders;
monthProfitEl.innerText = "₹" + totals.monthProfit.toFixed(2);

yearOrdersEl.innerText = totals.yearOrders;
yearProfitEl.innerText = "₹" + totals.yearProfit.toFixed(2);

// ================= BUSINESS HEALTH =================
if (totals.monthProfit > 0) {
  healthEl.innerText = "✅ Business is healthy and profitable";
  healthEl.style.color = "green";
} else {
  healthEl.innerText = "⚠️ Business needs attention";
  healthEl.style.color = "orange";
}

// ================= AI ADVICE =================
if (typeof getAIAdvice === "function") {
  getAIAdvice().forEach(msg => addAlert(msg));
}

if (!alertsEl.children.length) {
  addAlert("✅ No critical alerts");
}

function addAlert(text) {
  const li = document.createElement("li");
  li.innerText = text;
  alertsEl.appendChild(li);
}

