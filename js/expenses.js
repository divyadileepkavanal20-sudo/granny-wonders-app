/* ================= STORAGE ================= */
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/* ================= DOM ================= */
const nameEl = document.getElementById("expenseName");
const amountEl = document.getElementById("expenseAmount");
const typeEl = document.getElementById("expenseType");
const dateEl = document.getElementById("expenseDate"); // ✅ optional
const tableEl = document.getElementById("expenseTable");
const totalEl = document.getElementById("totalExpenses");

/* ================= DATE ================= */
const now = new Date();
const today = now.toISOString().split("T")[0];

const currentMonth =
  now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

/* ================= INIT ================= */
render();

/* ================= ACTION ================= */
function addExpense() {
  if (!nameEl.value || !amountEl.value) return;

  expenses.push({
    name: nameEl.value.trim(),
    amount: +amountEl.value,
    type: typeEl.value,
    date: dateEl?.value || today // ✅ use input date or fallback
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));

  nameEl.value = "";
  amountEl.value = "";
  if (dateEl) dateEl.value = today;

  render();
}

/* ================= RENDER ================= */
function render() {
  tableEl.innerHTML = "";
  let total = 0;

  expenses
    .filter(e => (e.date || "").startsWith(currentMonth))
    .forEach(e => {
      total += e.amount;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.date || "-"}</td>
        <td>${e.name}</td>
        <td>${e.type}</td>
        <td>₹${e.amount.toFixed(2)}</td>
      `;

      tableEl.appendChild(tr);
    });

  totalEl.innerText = "₹" + total.toFixed(2);
}