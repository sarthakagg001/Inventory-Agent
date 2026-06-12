import { useState } from "react";

export default function InventoryForm({ onAnalyze }) {
  const [inventoryFile, setInventoryFile] = useState(null);
  const [salesFile, setSalesFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file, fileType) => {
    if (!file.name.endsWith(".csv")) {
      setError(`${fileType} must be a CSV file`);
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`${fileType} is too large (max 10MB)`);
      return false;
    }

    setError("");
    return true;
  };

  const handleFileInput = (e, fileType) => {
    const file = e.target.files[0];

    if (file && validateFile(file, fileType)) {
      if (fileType === "Inventory") {
        setInventoryFile(file);
      } else {
        setSalesFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inventoryFile || !salesFile) {
      setError(
        "Please upload both Inventory and Sales files"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onAnalyze(
        inventoryFile,
        salesFile
      );
    } catch (err) {
      setError(
        "Analysis failed. Please check your files and try again."
      );

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFiles = () => {
    setInventoryFile(null);
    setSalesFile(null);
    setError("");
  };

  return (
    <div className="form-container">

      <form onSubmit={handleSubmit}>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="upload-row">

          <label
            htmlFor="inventory-input"
            className="upload-card"
          >
            <div className="upload-icon">
              📦
            </div>

            <div className="upload-text">
              <strong>
                Inventory CSV
              </strong>

              <span>
                {inventoryFile
                  ? inventoryFile.name
                  : "Click to upload inventory file"}
              </span>
            </div>

            <input
              id="inventory-input"
              type="file"
              accept=".csv"
              onChange={(e) =>
                handleFileInput(
                  e,
                  "Inventory"
                )
              }
              className="hidden-input"
            />
          </label>

          <label
            htmlFor="sales-input"
            className="upload-card"
          >
            <div className="upload-icon">
              📈
            </div>

            <div className="upload-text">
              <strong>
                Sales CSV
              </strong>

              <span>
                {salesFile
                  ? salesFile.name
                  : "Click to upload sales file"}
              </span>
            </div>

            <input
              id="sales-input"
              type="file"
              accept=".csv"
              onChange={(e) =>
                handleFileInput(
                  e,
                  "Sales"
                )
              }
              className="hidden-input"
            />
          </label>

        </div>

        <div className="form-actions">

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !inventoryFile ||
              !salesFile ||
              loading
            }
          >
            {loading
              ? "Analyzing..."
              : "🚀 Analyze Inventory"}
          </button>

          {(inventoryFile || salesFile) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFiles}
            >
              Clear
            </button>
          )}

        </div>

      </form>

    </div>
  );
}