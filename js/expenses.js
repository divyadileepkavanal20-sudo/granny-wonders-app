const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const nameEl = document.getElementById("expenseName");
const amountEl = document.getElementById("expenseAmount");
const typeEl = document.getElementById("expenseType");
const tableEl = document.getElementById("expenseTable");
const totalEl = document.getElementById("totalExpenses");

const now = new Date();
const currentMonth =
  now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

render();

function addExpense() {
  if (!nameEl.value || !amountEl.value) return;

  expenses.push({
    name: nameEl.value,
    amount: +amountEl.value,
    type: typeEl.value,
    date: new Date().toISOString().split("T")[0]
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
  nameEl.value = "";
  amountEl.value = "";
  render();
}

function render() {
  tableEl.innerHTML = "";
  let total = 0;

  expenses
    .filter(e => e.date.startsWith(currentMonth))
    .forEach(e => {
      total += e.amount;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.name}</td>
        <td>${e.type}</td>
        <td>₹${e.amount}</td>
      `;
      tableEl.appendChild(tr);
    });

  totalEl.innerText = "₹" + total.toFixed(2);
}