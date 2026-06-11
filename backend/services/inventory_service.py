import pandas as pd

from graph import graph


def analyze_inventory_files(
    inventory_file,
    sales_file
):

    inventory_df = pd.read_csv(inventory_file.file)

    sales_df = pd.read_csv(sales_file.file)

    merged_df = inventory_df.merge(
        sales_df,
        on="sku"
    )

    results = []

    for _, row in merged_df.iterrows():

        result = graph.invoke(
            {
                "current_stock": int(row["current_stock"]),
                "total_sales_last_30_days": int(
                    row["total_sales_last_30_days"]
                )
            }
        )

        result["sku"] = row["sku"]

        results.append(result)

    return results