const canvas = document.getElementById("chart");
if (!canvas) return;

const ctx = canvas.getContext("2d");
const orders = JSON.parse(localStorage.getItem("orders")) || [];

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// No data
if (!orders.length) {
  ctx.fillStyle = "#6b7280";
  ctx.font = "14px Arial";
  ctx.fillText("No data available", 20, 40);
  return;
}

// Group by date
const daily = {};
orders.forEach(o => {
  if (!daily[o.date]) daily[o.date] = { revenue: 0, profit: 0 };
  daily[o.date].revenue += o.revenue;
  daily[o.date].profit += o.profit;
});

const dates = Object.keys(daily);
const values = dates.map(d =>
  Math.max(daily[d].revenue, daily[d].profit)
);
const max = Math.max(...values);

// Draw axes
ctx.strokeStyle = "#e5e7eb";
ctx.beginPath();
ctx.moveTo(40, 10);
ctx.lineTo(40, canvas.height - 30);
ctx.lineTo(canvas.width - 10, canvas.height - 30);
ctx.stroke();

// Helper to draw line or dot
function drawSeries(key, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  dates.forEach((d, i) => {
    const x =
      dates.length === 1
        ? canvas.width / 2
        : 40 +
          (i / (dates.length - 1)) * (canvas.width - 60);

    const y =
      canvas.height -
      30 -
      (daily[d][key] / max) * (canvas.height - 60);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    // draw point
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  ctx.stroke();
}

// Revenue & Profit
drawSeries("revenue", "#2e7d32");
drawSeries("profit", "#2563eb");

// Legend
ctx.font = "12px Arial";
ctx.fillStyle = "#2e7d32";
ctx.fillText("Revenue", 50, 15);
ctx.fillStyle = "#2563eb";
ctx.fillText("Profit", 130, 15);