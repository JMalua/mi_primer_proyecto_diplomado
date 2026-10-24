import os
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Orders Service")

CATALOG_SERVICE_URL = os.getenv("CATALOG_SERVICE_URL", "http://localhost:8001")
orders = []

class Order(BaseModel):
    id: int
    space_id: int
    space_name: str
    user_email: str
    hours: int
    total_price: float

@app.get("/health")
def health():
    return {"status": "ok", "service": "orders-service"}

@app.get("/orders")
def get_orders():
    return orders

@app.post("/orders")
def create_order(space_id: int, user_email: str, hours: int):
    try:
        with httpx.Client(timeout=3.0) as client:
            response = client.get(f"{CATALOG_SERVICE_URL}/spaces/{space_id}")
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Space not found in catalog")
            response.raise_for_status()
            space = response.json()
    except (httpx.ConnectError, httpx.TimeoutException):
        raise HTTPException(status_code=503, detail="Catalog service unavailable")
    except KeyError:
        raise HTTPException(status_code=500, detail="Contract error: missing expected attributes")

    total_price = space["price_per_hour"] * hours

    order = {
        "id": len(orders) + 1,
        "space_id": space_id,
        "space_name": space["name"],
        "user_email": user_email,
        "hours": hours,
        "total_price": total_price,
    }
    orders.append(order)
    return order

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
