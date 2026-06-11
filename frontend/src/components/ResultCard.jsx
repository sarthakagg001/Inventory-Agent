export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div>
      <h2>Analysis Result</h2>

      <p>
        <strong>Status:</strong> {result.status}
      </p>

      <p>
        <strong>Days of Inventory:</strong>{" "}
        {result.days_of_inventory}
      </p>

      <p>
        <strong>Recommendation:</strong>{" "}
        {result.recommendation}
      </p>
    </div>
  );
}