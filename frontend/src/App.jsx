import { useState } from "react";

import InventoryForm from "./components/InventoryForm";
import ResultCard from "./components/ResultCard";

import { analyzeInventory } from "./api";

function App() {
  const [result, setResult] = useState(null);

  const handleAnalyze = async (data) => {
    const response = await analyzeInventory(data);

    setResult(response);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Inventory Agent</h1>

      <InventoryForm onAnalyze={handleAnalyze} />

      <hr />

      <ResultCard result={result} />
    </div>
  );
}

export default App;