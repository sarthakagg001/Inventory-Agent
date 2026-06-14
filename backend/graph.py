from typing import TypedDict

from langgraph.graph import StateGraph
from langgraph.graph import END


class InventoryState(TypedDict):
    current_stock: int
    total_sales_last_30_days: int

    avg_daily_sales: float
    days_of_inventory: float
    stockout_risk: int
    status: str


def analyze_inventory(state: InventoryState):

    avg_daily_sales = (
        state["total_sales_last_30_days"] / 30
    )

    if avg_daily_sales == 0:

        days_of_inventory = 9999

    else:

        days_of_inventory = (
            state["current_stock"] / avg_daily_sales
        )

    if days_of_inventory < 1:

        status = "CRITICAL"
        stockout_risk = 95

    elif days_of_inventory < 3:

        status = "AT_RISK"
        stockout_risk = 80

    elif days_of_inventory < 7:

        status = "AT_RISK"
        stockout_risk = 60

    elif days_of_inventory < 15:

        status = "REORDER"
        stockout_risk = 40

    else:

        status = "HEALTHY"
        stockout_risk = 10

    return {
        "avg_daily_sales": avg_daily_sales,
        "days_of_inventory": days_of_inventory,
        "stockout_risk": stockout_risk,
        "status": status
    }


builder = StateGraph(
    InventoryState
)

builder.add_node(
    "inventory_analysis",
    analyze_inventory
)

builder.set_entry_point(
    "inventory_analysis"
)

builder.add_edge(
    "inventory_analysis",
    END
)

graph = builder.compile()