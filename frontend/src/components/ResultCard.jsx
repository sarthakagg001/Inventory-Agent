import { downloadCSV, downloadPDF } from "../services/api";

export default function ResultCard({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="results-wrapper">

      <div className="results-actions">
        <div>
          <strong>{results.length}</strong> items analyzed
        </div>

        <div>
          <button
            className="download-button"
            onClick={() => downloadCSV(results)}
          >
            Download CSV
          </button>

          <button
            className="download-button"
            onClick={() => downloadPDF(results)}
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="results-table-container">

        <table className="results-table">

          <thead>
            <tr>
              <th>Item</th>
              <th>Status</th>
              <th>Risk %</th>
              <th>Stock</th>
              <th>Days</th>
              <th>Forecast</th>
              <th>Action</th>
              <th>AI Insight</th>
            </tr>
          </thead>

          <tbody>

            {results.map((row) => (

              <tr key={row.sku}>

                <td className="sku-cell">
                  {row.item_name || row.sku}
                </td>

                <td
                  className={
                    row.inventory_status === "Healthy"
                      ? "status-healthy"
                      : row.inventory_status === "At Risk"
                      ? "status-at-risk"
                      : "status-critical"
                  }
                >
                  {row.inventory_status}
                </td>

                <td>
                  {row.stockout_risk}%
                </td>

                <td>
                  {row.current_stock}
                </td>

                <td>
                  {Number(
                    row.days_of_inventory
                  ).toFixed(1)}
                </td>

                <td>
                  {row.demand_forecast}
                </td>

                <td>
                  {row.recommended_action}
                </td>

                <td className="explanation-cell">
                  {row.explanation}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}