import pandas as pd
import logging

from graph import graph
from .groq_service import analyze_inventory_with_ai

logger = logging.getLogger(__name__)


def analyze_inventory_files(
    inventory_file,
    sales_file
):
    try:

        inventory_df = pd.read_csv(
            inventory_file.file
        )

        sales_df = pd.read_csv(
            sales_file.file
        )

        merged_df = inventory_df.merge(
            sales_df,
            on="sku",
            how="inner"
        )

        results = []

        for _, row in merged_df.iterrows():

            result = graph.invoke(
                {
                    "current_stock": int(
                        row["current_stock"]
                    ),
                    "total_sales_last_30_days": int(
                        row["total_sales_last_30_days"]
                    )
                }
            )

            result["sku"] = row["sku"]

            # Generic inventory name support
            if "item_name" in row:
                result["item_name"] = row["item_name"]

            elif "medicine_name" in row:
                result["item_name"] = row["medicine_name"]

            else:
                result["item_name"] = row["sku"]

            result["current_stock"] = int(
                row["current_stock"]
            )

            result["total_sales_last_30_days"] = int(
                row["total_sales_last_30_days"]
            )

            results.append(result)

        enhanced_results = (
            analyze_inventory_with_ai(
                results
            )
        )

        return enhanced_results

    except Exception as e:

        logger.error(
            f"Inventory processing error: {e}"
        )

        raise