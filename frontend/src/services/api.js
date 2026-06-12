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

export const downloadPDF = (results) => {
  if (!results || results.length === 0) return;

  // dynamic import to keep bundle small when not used
  // jsPDF and autotable are in dependencies
  const { jsPDF } = require("jspdf");
  const autoTable = require("jspdf-autotable");

  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const columns = [
    { header: "SKU", dataKey: "sku" },
    { header: "Status", dataKey: "status" },
    { header: "Stock", dataKey: "current_stock" },
    { header: "Days", dataKey: "days_of_inventory" },
    { header: "Recommendation", dataKey: "recommendation" },
  ];

  const data = results.map((r) => ({
    sku: r.sku,
    status: r.status,
    current_stock: r.current_stock,
    days_of_inventory: Number(r.days_of_inventory).toFixed(1),
    recommendation: r.recommendation,
  }));

  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: data.map((d) => columns.map((c) => d[c.dataKey])),
    startY: 40,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.text("Inventory Analysis Results", 40, 24);
  doc.save(`inventory-results-${Date.now()}.pdf`);
};