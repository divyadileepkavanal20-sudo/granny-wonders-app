const orders = JSON.parse(localStorage.getItem("orders")) || [];
const withdrawals = JSON.parse(localStorage.getItem("withdrawals")) || [];
const employees = JSON.parse(localStorage.getItem("employees")) || [];

/* ================= DOM ================= */
const totalProfitEl = document.getElementById("totalProfit");
const withdrawnEl = document.getElementById("withdrawn");
const pendingPaymentsEl = document.getElementById("pendingPayments");
const safeAmountEl = document.getElementById("safeAmount");
const withdrawAmountEl = document.getElementById("withdrawAmount");
const statusEl = document.getElementById("withdrawStatus");

/* ================= CALCULATIONS ================= */

// Total profit from all orders
const totalProfit = orders.reduce((sum, o) => sum + (o.profit || 0), 0);

// Total already withdrawn
const totalWithdrawn = withdrawals.reduce(
  (sum, w) => sum + (w.amount || 0),
  0
);

// Pending employee payments
const pendingEmployeePayments = employees.reduce(
  (sum, e) => sum + (e.pending || 0),
  0
);

// Safety buffer (30%)
const safetyBuffer = totalProfit * 0.3;

// Safe withdrawable amount
let safeWithdrawable =
  totalProfit - totalWithdrawn - pendingEmployeePayments - safetyBuffer;

if (safeWithdrawable < 0) safeWithdrawable = 0;

/* ================= RENDER ================= */
totalProfitEl.innerText = "₹" + totalProfit.toFixed(2);
withdrawnEl.innerText = "₹" + totalWithdrawn.toFixed(2);
pendingPaymentsEl.innerText =
  "₹" + pendingEmployeePayments.toFixed(2);
safeAmountEl.innerText =
  "₹" + safeWithdrawable.toFixed(2);

/* ================= ACTION ================= */
function withdrawProfit() {
  const amount = +withdrawAmountEl.value || 0;

  if (!amount) {
    statusEl.innerText = "Enter withdrawal amount";
    statusEl.style.color = "orange";
    return;
  }

  if (amount > safeWithdrawable) {
    statusEl.innerText =
      "⚠️ Unsafe withdrawal. This may impact business stability.";
    statusEl.style.color = "red";
    return;
  }

  withdrawals.push({
    date: new Date().toISOString().split("T")[0],
    amount
  });

  localStorage.setItem("withdrawals", JSON.stringify(withdrawals));

  alert("✅ Withdrawal recorded safely");
  location.reload();
}