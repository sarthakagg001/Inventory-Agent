import os
import json

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_inventory_with_ai(results):

    prompt = f"""
You are an inventory optimization expert.

Analyze each inventory item and return ONLY a valid JSON array.

Input:
{json.dumps(results)}

For each item return:

- sku
- inventory_status
- demand_forecast
- recommended_action
- reorder_quantity
- explanation

Rules:

inventory_status must be:
- Critical
- At Risk
- Healthy

demand_forecast:
Expected demand for next 30 days.

recommended_action:
Specific business action.

reorder_quantity:
Suggested quantity to purchase.

explanation:
2-3 sentence business explanation.

Use:
- current_stock
- total_sales_last_30_days
- days_of_inventory
- stockout_risk

Return ONLY JSON.
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        content = (
            response
            .choices[0]
            .message
            .content
            .strip()
        )

        # Groq sometimes wraps JSON in markdown
        if content.startswith("```json"):
            content = (
                content
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

        ai_results = json.loads(content)

        ai_map = {
            item["sku"]: item
            for item in ai_results
        }

        enhanced_results = []

        for result in results:

            sku = result["sku"]

            if sku in ai_map:

                ai = ai_map[sku]

                result["inventory_status"] = ai.get(
                    "inventory_status",
                    result.get("status")
                )

                result["demand_forecast"] = ai.get(
                    "demand_forecast",
                    result["total_sales_last_30_days"]
                )

                result["recommended_action"] = ai.get(
                    "recommended_action",
                    "Monitor inventory."
                )

                result["reorder_quantity"] = ai.get(
                    "reorder_quantity",
                    0
                )

                result["explanation"] = ai.get(
                    "explanation",
                    ""
                )

            else:

                result["inventory_status"] = (
                    result.get("status")
                )

                result["demand_forecast"] = (
                    result["total_sales_last_30_days"]
                )

                result["recommended_action"] = (
                    "Monitor inventory."
                )

                result["reorder_quantity"] = 0

                result["explanation"] = (
                    "No AI analysis available."
                )

            enhanced_results.append(result)

        return enhanced_results

    except Exception as e:

        print(
            f"Groq error: {e}"
        )

        for result in results:

            result["inventory_status"] = (
                result.get("status")
            )

            result["demand_forecast"] = (
                result["total_sales_last_30_days"]
            )

            result["recommended_action"] = (
                "Monitor inventory."
            )

            result["reorder_quantity"] = 0

            result["explanation"] = (
                "AI analysis unavailable."
            )

        return results