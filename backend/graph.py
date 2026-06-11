from typing import TypedDict

from langgraph.graph import StateGraph
from langgraph.graph import END


class InventoryState(TypedDict):
    current_stock: int
    total_sales_last_30_days: int

    avg_daily_sales: float
    days_of_inventory: float
    status: str
    recommendation: str


def analyze_inventory(state: InventoryState):

    avg_daily_sales = (
        state["total_sales_last_30_days"] / 30
    )

    days_of_inventory = (
        state["current_stock"] / avg_daily_sales
    )

    if days_of_inventory < 15:
        status = "REORDER"
    else:
        status = "HEALTHY"

    return {
        "avg_daily_sales": avg_daily_sales,
        "days_of_inventory": days_of_inventory,
        "status": status
    }


def generate_recommendation(state: InventoryState):

    if state["status"] == "REORDER":
        recommendation = (
            "Inventory is low. Reorder stock soon."
        )
    else:
        recommendation = (
            "Inventory levels look healthy."
        )

    return {
        "recommendation": recommendation
    }


builder = StateGraph(InventoryState)

builder.add_node(
    "inventory_analysis",
    analyze_inventory
)

builder.add_node(
    "recommendation",
    generate_recommendation
)

builder.set_entry_point(
    "inventory_analysis"
)

builder.add_edge(
    "inventory_analysis",
    "recommendation"
)

builder.add_edge(
    "recommendation",
    END
)

graph = builder.compile()