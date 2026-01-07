document.addEventListener("DOMContentLoaded", () => {
  const navHTML = `
    <nav class="nav">
      <a href="dashboard.html" data-page="dashboard">Dashboard</a>
      <a href="product-create.html" data-page="product-create">Add Product</a>
      <a href="products-list.html" data-page="products-list">Products</a>
      <a href="orders.html" data-page="orders">Orders</a>
      <a href="orders-history.html" data-page="orders-history">Orders History</a>
      <a href="reports.html" data-page="reports">Reports</a>
      <a href="employees.html" data-page="employees">Employees</a>
      <a href="owner-profit.html" data-page="owner-profit">Business Profit</a>
      <a href="expenses.html" data-page="expenses">Expenses</a>
      <a href="how-to-use.html" data-page="how-to-use">How To Use</a>
    </nav>
  `;

  document.body.insertAdjacentHTML("afterbegin", navHTML);

  // Highlight active link
  const currentPage = location.pathname.split("/").pop().replace(".html", "");
  document
    .querySelectorAll(".nav a")
    .forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add("active");
      }
    });
});