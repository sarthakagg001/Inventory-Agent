import { useState } from "react";

import "./App.css";

import InventoryForm from "./components/InventoryForm";
import ResultCard from "./components/ResultCard";

import { uploadFiles } from "./services/api";

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (
    inventoryFile,
    salesFile
  ) => {
    try {
      setLoading(true);

      const response =
        await uploadFiles(
          inventoryFile,
          salesFile
        );

      setResults(response);

    } catch (error) {
      console.error(error);

      alert(
        "Upload failed."
      );

    } finally {
      setLoading(false);
    }
  };

  const healthyCount =
    results.filter(
      item => item.status === "HEALTHY"
    ).length;

  const reorderCount =
    results.filter(
      item => item.status === "REORDER"
    ).length;

  return (
    <div className="app-container">

      <div className="dashboard-card">

        <h1 className="page-title">
          Inventory Intelligence Dashboard
        </h1>

        <p className="page-subtitle">
          Analyze inventory health and identify stock risks.
        </p>

        <InventoryForm
          onAnalyze={handleAnalyze}
        />

      </div>

      {loading && (
        <div className="dashboard-card">
          <p className="loading-text">
            Analyzing inventory...
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="summary-grid">

            <div className="summary-card">
              <div className="summary-number">
                {results.length}
              </div>
              <div className="summary-label">
                Total SKUs
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-number">
                {healthyCount}
              </div>
              <div className="summary-label">
                Healthy
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-number">
                {reorderCount}
              </div>
              <div className="summary-label">
                Reorder Needed
              </div>
            </div>

          </div>

          <div className="dashboard-card">
            <ResultCard
              results={results}
            />
          </div>
        </>
      )}

    </div>
  );
}

export default App;