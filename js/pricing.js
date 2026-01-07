const PROFIT_PERCENT = {
  100: 30,
  250: 28,
  500: 25,
  1000: 22
};

document.addEventListener("input", calculateAll);

function calculateAll() {
  // ===== BASIC COSTS =====
  const ingredient = +ingredientInput() || 0;
  const gas = +gasInput() || 0;
  const labour = +labourInput() || 0;

  // ===== FUEL COST =====
  const distance = +distanceInput() || 0;
  const mileage = +mileageInput() || 0;
  const fuelPrice = +fuelPriceInput() || 0;

  let fuelCostValue = 0;
  if (distance && mileage && fuelPrice) {
    fuelCostValue = (distance / mileage) * fuelPrice;
  }

  document.getElementById("fuelCost").innerText =
    "₹" + fuelCostValue.toFixed(2);

  // ===== TOTAL BATCH COST =====
  const totalBatchCostValue =
    ingredient + gas + labour + fuelCostValue;

  document.getElementById("totalBatchCost").innerText =
    "₹" + totalBatchCostValue.toFixed(2);

  // ===== COST PER GRAM =====
  const batchWeight = +batchWeightInput() || 0;
  if (!batchWeight) return;

  const costPerGram = totalBatchCostValue / batchWeight;

  // ===== BOTTLE CALCULATIONS =====
  document.querySelectorAll(".count").forEach(input => {
    const size = +input.dataset.size;
    const count = +input.value || 0;

    const row = input.closest("tr");
    if (!count) {
      clearRow(row);
      return;
    }

    const bottleCost = costPerGram * size;
    const marginPercent = PROFIT_PERCENT[size];
    const sellingPrice =
      bottleCost + (bottleCost * marginPercent / 100);

    row.querySelector(".cost").innerText =
      "₹" + bottleCost.toFixed(2);

    row.querySelector(".price").innerText =
      "₹" + sellingPrice.toFixed(2);

    row.querySelector(".margin").innerText =
      marginPercent + "%";
  });
}

/* ===== HELPERS ===== */

function clearRow(row) {
  row.querySelector(".cost").innerText = "";
  row.querySelector(".price").innerText = "";
  row.querySelector(".margin").innerText = "";
}

function ingredientInput() {
  return document.getElementById("ingredient").value;
}
function gasInput() {
  return document.getElementById("gas").value;
}
function labourInput() {
  return document.getElementById("labour").value;
}
function distanceInput() {
  return document.getElementById("distance").value;
}
function mileageInput() {
  return document.getElementById("mileage").value;
}
function fuelPriceInput() {
  return document.getElementById("fuelPrice").value;
}
function batchWeightInput() {
  return document.getElementById("batchWeight").value;
}