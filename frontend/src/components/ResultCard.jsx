import { downloadCSV, downloadPDF } from "../services/api";

export default function ResultCard({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="results-wrapper">
      <div className="results-actions">
        <div>
          <strong>{results.length}</strong> items
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
              <th>SKU</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Days</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.sku}>
                <td>{row.sku}</td>
                <td className={
                  row.status === "HEALTHY"
                    ? "status-healthy"
                    : "status-reorder"
                }>
                  {row.status}
                </td>
                <td>{row.current_stock}</td>
                <td>{Number(row.days_of_inventory).toFixed(1)}</td>
                <td>{row.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}