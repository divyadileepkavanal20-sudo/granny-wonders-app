const container = document.getElementById("productsContainer");
let products = JSON.parse(localStorage.getItem("products")) || [];

renderProducts();

/* ================= RENDER ================= */

function renderProducts() {
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML =
      "<p class='small'>No products saved yet.</p>";
    return;
  }

  products.forEach((product, productIndex) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${product.name}</h3>

      <p class="small">
        Pricing Mode:
        <strong>${product.pricingMode === "manual" ? "Manual" : "Auto"}</strong>
      </p>

      <table class="table">
        <tr>
          <th>Bottle Size</th>
          <th>Cost / Bottle</th>
          <th>Selling Price</th>
          <th>Calculated Margin</th>
          <th>Action</th>
        </tr>

        ${product.pricing.map((p, priceIndex) => `
          <tr data-product="${productIndex}" data-price="${priceIndex}">
            <td>${p.size}</td>

            <td>
              <input
                type="number"
                class="edit-cost"
                value="${num(p.cost)}"
                oninput="updateMargin(${productIndex}, ${priceIndex})"
              />
            </td>

            <td>
              <input
                type="number"
                class="edit-price"
                value="${num(p.price)}"
                oninput="updateMargin(${productIndex}, ${priceIndex})"
              />
            </td>

            <td class="margin-cell">
              ${calcMargin(p.cost, p.price)}
            </td>

            <td>
              <button class="secondary" onclick="saveRow(${productIndex}, ${priceIndex})">
                Save
              </button>
            </td>
          </tr>
        `).join("")}
      </table>

      <div class="action-bar">
        <button class="danger" onclick="deleteProduct(${productIndex})">
          Delete Product
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ================= HELPERS ================= */

function num(value) {
  return parseFloat(String(value).replace("₹", "")) || 0;
}

function calcMargin(costText, priceText) {
  const cost = num(costText);
  const price = num(priceText);

  if (!cost) return "-";
  const margin = ((price - cost) / cost) * 100;
  return margin.toFixed(1) + "%";
}

/* ================= LIVE UPDATE ================= */

function updateMargin(productIndex, priceIndex) {
  const row = document.querySelector(
    `tr[data-product="${productIndex}"][data-price="${priceIndex}"]`
  );

  const cost = +row.querySelector(".edit-cost").value || 0;
  const price = +row.querySelector(".edit-price").value || 0;
  const marginCell = row.querySelector(".margin-cell");

  if (!cost) {
    marginCell.innerText = "-";
    marginCell.style.color = "#999";
    return;
  }

  const margin = ((price - cost) / cost) * 100;
  marginCell.innerText = margin.toFixed(1) + "%";
  marginCell.style.color = margin < 0 ? "#dc2626" : "#2e7d32";
}

/* ================= SAVE ================= */

function saveRow(productIndex, priceIndex) {
  const row = document.querySelector(
    `tr[data-product="${productIndex}"][data-price="${priceIndex}"]`
  );

  const cost = +row.querySelector(".edit-cost").value;
  const price = +row.querySelector(".edit-price").value;

  if (!cost || !price) {
    alert("Cost and Selling Price are required");
    return;
  }

  const margin = ((price - cost) / cost) * 100;

  products[productIndex].pricing[priceIndex] = {
    ...products[productIndex].pricing[priceIndex],
    cost: "₹" + cost.toFixed(2),
    price: "₹" + price.toFixed(2),
    margin: margin.toFixed(1) + "%"
  };

  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

/* ================= DELETE ================= */

function deleteProduct(index) {
  if (!confirm("Delete this product? Orders will not be affected.")) return;

  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}