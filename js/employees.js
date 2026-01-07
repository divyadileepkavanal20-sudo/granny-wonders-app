/* ================= STORAGE ================= */
const employees = JSON.parse(localStorage.getItem("employees")) || [];
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const products = JSON.parse(localStorage.getItem("products")) || [];

/* ================= DOM ================= */
const empTable = document.getElementById("empTable");
const empNameEl = document.getElementById("empName");

/* ================= DATE ================= */
const now = new Date();
const currentMonth =
  now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

/* ================= CONFIG ================= */
// ✅ DEFAULT manual effort for OLD products (₹ per order)
const DEFAULT_MANUAL_EFFORT = 10;

/* ================= INIT ================= */
renderEmployees();

/* ================= HELPERS ================= */

// 🔑 SAFE manual effort lookup
function getManualEffort(productName) {
  const product = products.find(p => p.name === productName);

  // New products (correct)
  if (product && typeof product.manualEffort === "number") {
    return product.manualEffort;
  }

  // Old products (fallback)
  return DEFAULT_MANUAL_EFFORT;
}

// Orders of current month
function getMonthlyOrders() {
  return orders.filter(o => o.date.startsWith(currentMonth));
}

/* ================= MAIN ================= */

function renderEmployees() {
  empTable.innerHTML = "";

  const monthlyOrders = getMonthlyOrders();

  employees.forEach((emp, index) => {
    let ordersHandled = monthlyOrders.length;
    let payable = 0;

   monthlyOrders.forEach(order => {
  payable += order.manualEffort || DEFAULT_MANUAL_EFFORT;
});

    const isPaid = emp.paidTill === currentMonth;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.name}</td>
      <td>${currentMonth}</td>
      <td>${ordersHandled}</td>
      <td>₹${payable.toFixed(2)}</td>
      <td class="${isPaid ? "badge-good" : "badge-warn"}">
        ${isPaid ? "Paid" : "Pending"}
      </td>
      <td>
        ${
          isPaid
            ? "-"
            : `<button class="secondary" onclick="markPaid(${index})">
                Mark Paid
              </button>`
        }
      </td>
    `;

    empTable.appendChild(tr);
  });
}

/* ================= ACTIONS ================= */

function addEmployee() {
  if (!empNameEl.value.trim()) {
    alert("Enter employee name");
    return;
  }

  employees.push({
    name: empNameEl.value.trim(),
    paidTill: null
  });

  localStorage.setItem("employees", JSON.stringify(employees));
  empNameEl.value = "";
  renderEmployees();
}

function markPaid(index) {
  employees[index].paidTill = currentMonth;
  localStorage.setItem("employees", JSON.stringify(employees));
  renderEmployees();
}