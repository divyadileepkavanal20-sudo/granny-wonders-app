const orders = JSON.parse(localStorage.getItem("orders")) || [];
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const withdrawals = JSON.parse(localStorage.getItem("withdrawals")) || [];
const employees = JSON.parse(localStorage.getItem("employees")) || [];

/* ================= DATE ================= */
const now = new Date();
const currentMonth =
  now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

/* ================= CALCULATIONS ================= */

// Order profit (month)
const orderProfit = orders
  .filter(o => o.date.startsWith(currentMonth))
  .reduce((sum, o) => sum + o.profit, 0);

// Expenses (month)
const expenseTotal = expenses
  .filter(e => e.date.startsWith(currentMonth))
  .reduce((sum, e) => sum + e.amount, 0);

// Employee payments (month)
const employeePayable = employees.reduce(
  (sum, e) => sum + (e.pending || 0),
  0
);

// Withdrawals
const withdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);

// Net profit
const netProfit = orderProfit - expenseTotal - employeePayable;

// Safety buffer (10%)
const safeAmount = netProfit * 0.9;

/* ================= DOM ================= */
document.getElementById("totalProfit").innerText = "₹" + netProfit.toFixed(2);
document.getElementById("withdrawn").innerText = "₹" + withdrawn.toFixed(2);
document.getElementById("pendingPayments").innerText =
  "₹" + employeePayable.toFixed(2);
document.getElementById("safeAmount").innerText =
  safeAmount > 0 ? "₹" + safeAmount.toFixed(2) : "₹0";