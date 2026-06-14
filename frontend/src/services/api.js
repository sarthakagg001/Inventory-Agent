import axios from "axios";

const API_URL = "http://127.0.0.1:8003";

export const uploadFiles = async (
  inventoryFile,
  salesFile
) => {

  const formData = new FormData();

  formData.append(
    "inventory_file",
    inventoryFile
  );

  formData.append(
    "sales_file",
    salesFile
  );

  const response = await axios.post(
    `${API_URL}/upload`,
    formData
  );

  return response.data;
};

export const downloadCSV = (results) => {
  if (!results || results.length === 0) return;

  const headers = [
    "sku",
    "status",
    "current_stock",
    "days_of_inventory",
    "recommendation",
  ];

  const rows = results.map((r) => [
    r.sku,
    r.status,
    r.current_stock,
    r.days_of_inventory,
    r.recommendation,
  ]);

  const csvContent = [headers, ...rows]
    .map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `inventory-results-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const downloadPDF = async (results) => {

  const { jsPDF } = await import("jspdf");

  const autoTableModule =
    await import("jspdf-autotable");

  const autoTable =
    autoTableModule.default;

  const doc = new jsPDF();

  autoTable(doc, {
    head: [[
      "SKU",
      "Status",
      "Risk %",
      "Forecast"
    ]],

    body: results.map(item => [
      item.sku,
      item.inventory_status,
      item.stockout_risk,
      item.demand_forecast
    ])
  });

  doc.save("inventory-report.pdf");
};