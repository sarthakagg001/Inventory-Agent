import { useState } from "react";

import InventoryForm from "./components/InventoryForm";
import ResultCard from "./components/ResultCard";

import { uploadFiles } from "./services/api";

function App() {

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const handleAnalyze =
    async (
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

  return (
    <div
      style={{
        padding: "2rem",
      }}
    >
      <h1>
        Inventory Agent
      </h1>

      <InventoryForm
        onAnalyze={
          handleAnalyze
        }
      />

      <hr />

      {loading && (
        <p>Analyzing...</p>
      )}

      <ResultCard
        results={results}
      />

    </div>
  );
}

export default App;