export default function ResultCard({
  results,
}) {

  if (
    !results ||
    results.length === 0
  ) {
    return null;
  }

  return (
    <table>

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

            <td>{row.status}</td>

            <td>
              {row.current_stock}
            </td>

            <td>
              {row.days_of_inventory.toFixed(
                1
              )}
            </td>

            <td>
              {row.recommendation}
            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}