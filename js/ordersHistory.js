const table = document.getElementById("ordersTable");

let orders = JSON.parse(localStorage.getItem("orders")) || [];
let editIndex = null;

render();

/* ================= RENDER ================= */

function render() {
  table.innerHTML = "";

  if (!orders.length) {
    table.innerHTML =
      "<tr><td colspan='8' class='small'>No orders yet</td></tr>";
    return;
  }

  orders.forEach((o, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${o.date}</td>
      <td>${o.product}</td>
      <td>${o.size}</td>
      <td>${o.quantity}</td>
      <td>${o.deliveryMethod}</td>
      <td>₹${o.revenue.toFixed(2)}</td>
      <td style="color:${o.profit >= 0 ? "green" : "red"}">
        ₹${o.profit.toFixed(2)}
      </td>
      <td>
      
        <button class="danger" onclick="deleteOrder(${index})">Delete</button>
      </td>
    `;

    table.appendChild(tr);
  });
}

/* ================= DELETE ================= */

function deleteOrder(index) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  orders.splice(index, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  render();
}

/* ================= EDIT ================= */

function editOrder(index) {
  editIndex = index;
  const order = orders[index];

  document.getElementById("editQty").value = order.quantity;
  document.getElementById("editDelivery").value =
    order.deliveryCost || 0;

  // ✅ OPEN MODAL (correct way)
  document.getElementById("editModal").classList.remove("hidden");
}

function closeModal() {
  // ✅ CLOSE MODAL (correct way)
  document.getElementById("editModal").classList.add("hidden");
  editIndex = null;
}

function saveEdit() {
  const qty = +document.getElementById("editQty").value || 0;
  const delivery = +document.getElementById("editDelivery").value || 0;

  if (!qty) {
    alert("Quantity required");
    return;
  }

  const order = orders[editIndex];

  /* 🔁 RECALCULATE SAFELY */
  const pricePerUnit = order.revenue / order.quantity;
  const costPerUnit = order.cost / order.quantity;

  order.quantity = qty;
  order.revenue = pricePerUnit * qty;
  order.cost = costPerUnit * qty;
  order.deliveryCost = delivery;
  order.profit =
    order.revenue - order.cost - order.deliveryCost;

  orders[editIndex] = order;
  localStorage.setItem("orders", JSON.stringify(orders));

  closeModal();
  render();
}