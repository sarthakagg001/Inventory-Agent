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
You are an inventory analyst.

Analyze each SKU and return ONLY valid JSON.

Input:
{json.dumps(results)}

For each item return:

inventory_status:
- Critical
- At Risk
- Healthy

stockout_risk:
0-100

demand_forecast:
forecast for next 30 days

explanation:
short business explanation

Return ONLY JSON array.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    try:
        ai_results = json.loads(content)

        ai_map = {
            item["sku"]: item
            for item in ai_results
        }

        enhanced = []

        for result in results:

            sku = result["sku"]

            if sku in ai_map:

                ai = ai_map[sku]

                result["inventory_status"] = ai.get(
                    "inventory_status",
                    "Healthy"
                )

                result["stockout_risk"] = ai.get(
                    "stockout_risk",
                    0
                )

                result["demand_forecast"] = ai.get(
                    "demand_forecast",
                    0
                )

                result["explanation"] = ai.get(
                    "explanation",
                    ""
                )

            enhanced.append(result)

        return enhanced

    except Exception:

        for result in results:

            result["inventory_status"] = "Unknown"
            result["stockout_risk"] = 0
            result["demand_forecast"] = 0
            result["explanation"] = "AI analysis unavailable"

        return results