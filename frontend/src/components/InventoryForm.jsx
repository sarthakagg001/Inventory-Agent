import { useState } from "react";

export default function InventoryForm({ onAnalyze }) {
  const [currentStock, setCurrentStock] = useState("");
  const [sales, setSales] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onAnalyze({
      current_stock: Number(currentStock),
      total_sales_last_30_days: Number(sales),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Current Stock</label>
        <br />
        <input
          type="number"
          value={currentStock}
          onChange={(e) => setCurrentStock(e.target.value)}
          required
        />
      </div>

      <br />

      <div>
        <label>Total Sales Last 30 Days</label>
        <br />
        <input
          type="number"
          value={sales}
          onChange={(e) => setSales(e.target.value)}
          required
        />
      </div>

      <br />

      <button type="submit">Analyze</button>
    </form>
  );
}