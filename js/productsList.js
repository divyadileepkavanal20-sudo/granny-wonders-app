const container = document.getElementById("productsContainer");

// 🔑 MUST MATCH save key EXACTLY
const products = JSON.parse(localStorage.getItem("products")) || [];

// 🧪 DEBUG (IMPORTANT)
console.log("Loaded products from storage:", products);

if (!products.length) {
  container.innerHTML =
    "<p class='small'>No products saved yet. Add a product first.</p>";
} else {
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p class="small">Total Batch Cost: ${product.totalBatchCost}</p>

      <table class="table">
        <tr>
          <th>Bottle Size</th>
          <th>Cost / Bottle</th>
          <th>Selling Price</th>
          <th>Margin</th>
        </tr>

        ${product.pricing
          .map(
            p => `
          <tr>
            <td>${p.size}</td>
            <td>${p.cost}</td>
            <td><strong>${p.price}</strong></td>
            <td>${p.margin}</td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;

    container.appendChild(card);
  });
}