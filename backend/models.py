from pydantic import BaseModel


class InventoryRequest(BaseModel):
    current_stock: int
    total_sales_last_30_days: int