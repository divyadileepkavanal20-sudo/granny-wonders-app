/* ================= DOM ================= */
const orderDateEl = document.getElementById("orderDate");
const summaryDateEl = document.getElementById("summaryDate");

const productSelect = document.getElementById("productSelect");
const sizeSelect = document.getElementById("sizeSelect");
const quantityEl = document.getElementById("quantity");

const deliveryMethodEl = document.getElementById("deliveryMethod");
const selfDeliveryEl = document.getElementById("selfDelivery");
const courierDeliveryEl = document.getElementById("courierDelivery");
const pickupDeliveryEl = document.getElementById("pickupDelivery");

const deliveryDistanceEl = document.getElementById("deliveryDistance");
const deliveryMileageEl = document.getElementById("deliveryMileage");
const deliveryFuelPriceEl = document.getElementById("deliveryFuelPrice");
const courierChargeEl = document.getElementById("courierCharge");

const revenueEl = document.getElementById("revenue");
const costEl = document.getElementById("cost");
const deliveryCostEl = document.getElementById("deliveryCost");
const profitEl = document.getElementById("profit");
const statusEl = document.getElementById("orderStatus");

const saveOrderBtn = document.getElementById("saveOrderBtn");

/* ================= DATA ================= */
const products = JSON.parse(localStorage.getItem("products")) || [];
let currentOrder = null;

/* ================= INIT ================= */
orderDateEl.value = new Date().toISOString().split("T")[0];
summaryDateEl.innerText = orderDateEl.value;

initProducts();

document.addEventListener("input", calculateOrder);
deliveryMethodEl.addEventListener("change", toggleDelivery);
orderDateEl.addEventListener("change", () => {
  summaryDateEl.innerText = orderDateEl.value;
});
saveOrderBtn.addEventListener("click", saveOrder);

/* ================= FUNCTIONS ================= */

function initProducts() {
  productSelect.innerHTML = "<option value=''>Select product</option>";
  products.forEach((p, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = p.name;
    productSelect.appendChild(opt);
  });
}

productSelect.addEventListener("change", () => {
  sizeSelect.innerHTML = "<option value=''>Select size</option>";
  const product = products[productSelect.value];
  if (!product) return;

  product.pricing.forEach(p => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify(p);
    opt.textContent = p.size;
    sizeSelect.appendChild(opt);
  });
});

/* ================= DELIVERY ================= */

function toggleDelivery() {
  const method = deliveryMethodEl.value;
  selfDeliveryEl.style.display = method === "self" ? "block" : "none";
  courierDeliveryEl.style.display = method === "courier" ? "block" : "none";
  pickupDeliveryEl.style.display = method === "pickup" ? "block" : "none";
}

/* ================= CALCULATION ================= */

function calculateOrder() {
  saveOrderBtn.disabled = true;
  statusEl.innerText = "";

  const qty = +quantityEl.value || 0;
  if (!qty) return;

  const sizeData = sizeSelect.value ? JSON.parse(sizeSelect.value) : null;
  if (!sizeData) return;

  const price = parseFloat(sizeData.price.replace("₹", ""));
  const cost = parseFloat(sizeData.cost.replace("₹", ""));

  const productRevenue = price * qty;
  const productCost = cost * qty;

  let deliveryCost = 0;
  let totalRevenue = productRevenue;

  if (deliveryMethodEl.value === "self") {
    const d = +deliveryDistanceEl.value || 0;
    const m = +deliveryMileageEl.value || 0;
    const f = +deliveryFuelPriceEl.value || 0;
    if (d && m && f) deliveryCost = (d / m) * f;
  }

  if (deliveryMethodEl.value === "courier") {
    const courierCharge = +courierChargeEl.value || 0;
    totalRevenue += courierCharge;
  }

  const profit = totalRevenue - productCost - deliveryCost;

  revenueEl.innerText = "₹" + totalRevenue.toFixed(2);
  costEl.innerText = "₹" + productCost.toFixed(2);
  deliveryCostEl.innerText = "₹" + deliveryCost.toFixed(2);
  profitEl.innerText = "₹" + profit.toFixed(2);

  if (profit > 0 && profit / totalRevenue > 0.15) {
    statusEl.innerText = "✅ Profitable order";
    statusEl.style.color = "green";
  } else if (profit > 0) {
    statusEl.innerText = "⚠️ Low margin order";
    statusEl.style.color = "orange";
  } else {
    statusEl.innerText = "❌ Loss-making order";
    statusEl.style.color = "red";
  }

 const product = products[productSelect.value];

currentOrder = {
  date: orderDateEl.value,
  product: product.name,
  size: sizeData.size,
  quantity: qty,
  deliveryMethod: deliveryMethodEl.value,

  // 🔑 STORE LABOUR SNAPSHOT
  manualEffort:
    typeof product.manualEffort === "number"
      ? product.manualEffort
      : 10,

  revenue: totalRevenue,
  cost: productCost,
  deliveryCost,
  profit
};

  saveOrderBtn.disabled = false;
}

/* ================= SAVE ================= */

function saveOrder() {
  if (!currentOrder) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(currentOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("✅ Order saved successfully");

  quantityEl.value = "";
  saveOrderBtn.disabled = true;
}