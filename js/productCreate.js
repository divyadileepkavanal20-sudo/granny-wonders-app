/* ================= DOM ELEMENTS ================= */
const ingredientEl = document.getElementById("ingredient");
const gasEl = document.getElementById("gas");
const labourEl = document.getElementById("labour");
const packagingEl = document.getElementById("packaging");
const otherEl = document.getElementById("other");

const distanceEl = document.getElementById("distance");
const mileageEl = document.getElementById("mileage");
const fuelPriceEl = document.getElementById("fuelPrice");

const fuelCostEl = document.getElementById("fuelCostEl");
const totalBatchCostEl = document.getElementById("totalBatchCostEl");
const batchWeightEl = document.getElementById("batchWeight");

const productNameEl = document.getElementById("productName");
const saveBtn = document.getElementById("saveBtn");
const suggestionsEl = document.getElementById("pricingSuggestions");

/* ================= CONFIG ================= */
const MARGIN = {
  100: 30,
  250: 28,
  500: 18,   // ↓ realistic
  1000: 12   // ↓ realistic
};

const MARKET_PRICE_LIMIT = {
  100: 120,
  250: 250,
  500: 300,
  1000: 550
};

/* ================= EVENTS ================= */
document.addEventListener("input", calculateAll);

/* ================= LOGIC ================= */
function calculateAll() {
  suggestionsEl.innerHTML = "";

  // ----- COST INPUTS -----
  const ingredient = +ingredientEl.value || 0;
  const gas = +gasEl.value || 0;
  const labour = +labourEl.value || 0;
  const packaging = +packagingEl.value || 0;
  const other = +otherEl.value || 0;

  // ----- FUEL COST -----
  const distance = +distanceEl.value || 0;
  const mileage = +mileageEl.value || 0;
  const fuelPrice = +fuelPriceEl.value || 0;

  const fuelCost =
    distance && mileage && fuelPrice
      ? (distance / mileage) * fuelPrice
      : 0;

  fuelCostEl.innerText = "₹" + fuelCost.toFixed(2);

  // ----- TOTAL BATCH COST -----
  const totalBatchCost =
    ingredient + gas + labour + packaging + other + fuelCost;

  totalBatchCostEl.innerText = "₹" + totalBatchCost.toFixed(2);

  // ----- BATCH WEIGHT -----
  const batchWeight = +batchWeightEl.value || 0;
  if (!batchWeight) return;

  const costPerGram = totalBatchCost / batchWeight;

  // 🔔 Suggestion: cost per gram insight
  if (costPerGram > 0.4) {
    addSuggestion(
      `⚠️ Cost per gram is ₹${costPerGram.toFixed(
        2
      )}. Increase batch size to reduce pricing.`
    );
  }

  let usedGrams = 0;
  let invalid = false;

  document.querySelectorAll("tr[data-size]").forEach(row => {
    const size = +row.dataset.size;
    const count = +row.querySelector(".count").value || 0;

    const costEl = row.querySelector(".cost");
    const priceEl = row.querySelector(".price");
    const statusEl = row.querySelector(".status");

    // reset row
    costEl.innerText = "";
    priceEl.innerText = "";
    statusEl.innerText = "";

    if (!count) return;

    const gramsNeeded = size * count;
    usedGrams += gramsNeeded;

    // ❌ Exceeds batch
    if (usedGrams > batchWeight) {
      statusEl.innerText = "❌ Exceeds batch";
      statusEl.style.color = "red";
      invalid = true;
      return;
    }

    // ✅ Valid bottle
    const bottleCost = costPerGram * size;
    const margin = MARGIN[size];
    const sellingPrice = bottleCost * (1 + margin / 100);

    costEl.innerText = "₹" + bottleCost.toFixed(2);
    priceEl.innerText = "₹" + sellingPrice.toFixed(2);
    statusEl.innerText = margin + "%";
    statusEl.style.color = "green";

    // 🔔 Market price sanity check
    if (sellingPrice > MARKET_PRICE_LIMIT[size]) {
      addSuggestion(
        `⚠️ ${size}g bottle price ₹${sellingPrice.toFixed(
          0
        )} may feel expensive. Reduce margin or increase batch size.`
      );
    }
  });

  // 🔔 Suggestion: unused batch
  if (usedGrams && usedGrams < batchWeight * 0.8) {
    addSuggestion(
      "💡 Large portion of batch unused. Add smaller bottles to spread cost."
    );
  }

  saveBtn.disabled = invalid;
}

/* ================= HELPERS ================= */
function addSuggestion(text) {
  const li = document.createElement("li");
  li.textContent = text;
  suggestionsEl.appendChild(li);
}

/* ================= SAVE ================= */
function saveProduct() {
  if (!productNameEl.value.trim()) {
    alert("Please enter product name");
    return;
  }

  if (saveBtn.disabled) {
    alert("Fix batch size issues before saving");
    return;
  }

  const batchWeight = +batchWeightEl.value || 0;
  const totalBatchCostText = totalBatchCostEl.innerText;

  const totalBatchCost = parseFloat(
    totalBatchCostText.replace("₹", "")
  );

  const costPerGram = totalBatchCost / batchWeight;

  const products = JSON.parse(localStorage.getItem("products") || "[]");

  const product = {
    name: productNameEl.value.trim(),

    // ✅ CRITICAL FIELD
    manualEffort: +labourEl.value || 0,

    batchWeight,
    totalBatchCost: totalBatchCostText,
    pricing: []
  };

  document.querySelectorAll("tr[data-size]").forEach(row => {
    const size = +row.dataset.size;
    const margin = MARGIN[size];

    const cost = costPerGram * size;
    const price = cost * (1 + margin / 100);

    product.pricing.push({
      size: size + " g",
      cost: "₹" + cost.toFixed(2),
      price: "₹" + price.toFixed(2),
      margin: margin + "%"
    });
  });

  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  alert("✅ Product pricing saved successfully");
  window.location.href = "products-list.html";
}