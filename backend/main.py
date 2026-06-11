from fastapi import FastAPI

from models import InventoryRequest
from graph import graph
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Inventory Agent is running"
    }


@app.post("/analyze")
def analyze(data: InventoryRequest):

    result = graph.invoke(
        {
            "current_stock": data.current_stock,
            "total_sales_last_30_days": data.total_sales_last_30_days
        }
    )

    return result