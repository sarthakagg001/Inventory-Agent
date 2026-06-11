import { useState } from "react";

export default function InventoryForm({
  onAnalyze,
}) {
  const [inventoryFile, setInventoryFile] =
    useState(null);

  const [salesFile, setSalesFile] =
    useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !inventoryFile ||
      !salesFile
    ) {
      alert(
        "Please upload both files."
      );
      return;
    }

    onAnalyze(
      inventoryFile,
      salesFile
    );
  };

  return (
    <form onSubmit={handleSubmit}>

      <div>
        <label>
          Inventory CSV
        </label>

        <br />

        <input
          type="file"
          accept=".csv"
          onChange={(e) =>
            setInventoryFile(
              e.target.files[0]
            )
          }
        />
      </div>

      <br />

      <div>
        <label>
          Sales CSV
        </label>

        <br />

        <input
          type="file"
          accept=".csv"
          onChange={(e) =>
            setSalesFile(
              e.target.files[0]
            )
          }
        />
      </div>

      <br />

      <button type="submit">
        Analyze Inventory
      </button>

    </form>
  );
}