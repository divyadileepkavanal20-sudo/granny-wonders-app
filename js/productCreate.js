/* ================= DOM ================= */
const pricingModeEl = document.getElementById("pricingMode");
const batchCostsEl = document.getElementById("batchCosts");

const ingredientEl = document.getElementById("ingredient");
const gasEl = document.getElementById("gas");
const labourEl = document.getElementById("labour");
const packagingEl = document.getElementById("packaging");
const otherEl = document.getElementById("other");

const distanceEl = document.getElementById("distance");
const mileageEl = document.getElementById("mileage");
const fuelPriceEl = document.getElementById("fuelPrice");

const fuelCostEl = document.getElementById("fuelCostEl");
const batchWeightEl = document.getElementById("batchWeight");
const totalBatchCostEl = document.getElementById("totalBatchCostEl");

const productNameEl = document.getElementById("productName");

/* ================= CONFIG ================= */
const MARGIN = {
  100: 30,
  250: 28,
  500: 18,
  1000: 12
};

/* ================= EVENTS ================= */
document.addEventListener("input", calculateAll);
pricingModeEl.addEventListener("change", toggleMode);

/* ================= MODE ================= */
function toggleMode() {
  batchCostsEl.style.display =
    pricingModeEl.value === "manual" ? "none" : "block";
  calculateAll();
}

/* ================= CALCULATION ================= */
function calculateAll() {
  const pricingMode = pricingModeEl.value;

  /* ----- BASE COSTS ----- */
  const ingredient = +ingredientEl.value || 0;
  const gas = +gasEl.value || 0;
  const labour = +labourEl.value || 0;
  const packaging = +packagingEl.value || 0;
  const other = +otherEl.value || 0;

  /* ----- FUEL COST ----- */
  const distance = +distanceEl.value || 0;
  const mileage = +mileageEl.value || 0;
  const fuelPrice = +fuelPriceEl.value || 0;

  const fuelCost =
    distance && mileage && fuelPrice
      ? (distance / mileage) * fuelPrice
      : 0;

  fuelCostEl.innerText = "₹" + fuelCost.toFixed(2);

  /* ----- TOTAL BATCH COST ----- */
  const totalBatchCost =
    ingredient + gas + labour + packaging + other + fuelCost;

  totalBatchCostEl.innerText = "₹" + totalBatchCost.toFixed(2);

  const batchWeight = +batchWeightEl.value || 0;
  const costPerGram = batchWeight ? totalBatchCost / batchWeight : 0;

  /* ----- PER BOTTLE PRICING ----- */
  document.querySelectorAll("tr[data-size]").forEach(row => {
    const size = +row.dataset.size;

    const manualCostEl = row.querySelector(".manual-cost");
    const costEl = row.querySelector(".cost");
    const priceEl = row.querySelector(".price");
    const statusEl = row.querySelector(".status");

    costEl.innerText = "";
    priceEl.innerText = "";
    statusEl.innerText = "";

    /* ===== MANUAL MODE ===== */
    if (pricingMode === "manual") {
      const manualCost = +manualCostEl.value || 0;
      if (!manualCost) return;

      costEl.innerText = "₹" + manualCost.toFixed(2);
      priceEl.innerText = "₹" + manualCost.toFixed(2);
      statusEl.innerText = "-";
      return;
    }

    /* ===== AUTO MODE ===== */
    if (!batchWeight) return;

    const cost = costPerGram * size;
    const margin = MARGIN[size];
    const price = cost * (1 + margin / 100);

    costEl.innerText = "₹" + cost.toFixed(2);
    priceEl.innerText = "₹" + price.toFixed(2);
    statusEl.innerText = margin + "%";
  });
}

/* ================= SAVE ================= */
function saveProduct() {
  if (!productNameEl.value.trim()) {
    alert("Enter product name");
    return;
  }

  const pricingMode = pricingModeEl.value;
  const products = JSON.parse(localStorage.getItem("products") || "[]");

  const product = {
    name: productNameEl.value.trim(),
    pricingMode,
    pricing: []
  };

  document.querySelectorAll("tr[data-size]").forEach(row => {
    const size = +row.dataset.size;

    const costText = row.querySelector(".cost").innerText;
    const priceText = row.querySelector(".price").innerText;
    const marginText = row.querySelector(".status").innerText;

    if (!costText || !priceText) return;

    product.pricing.push({
      size: size + " g",
      cost: costText,
      price: priceText,
      margin: pricingMode === "manual" ? "-" : marginText
    });
  });

  if (!product.pricing.length) {
    alert("Please enter pricing details");
    return;
  }

  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  alert("✅ Product saved successfully");
  window.location.href = "products-list.html";
}

/* INIT */
toggleMode();