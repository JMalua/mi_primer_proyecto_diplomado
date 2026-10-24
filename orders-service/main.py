from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import httpx
import os

app = FastAPI(title="Orders Service")

CATALOG_SERVICE_URL = os.getenv("CATALOG_SERVICE_URL", "http://catalog-service:8001")

ORDERS = []
SPACE_AVAILABILITY = {}

class SpaceEvent(BaseModel):
    event: str
    space_id: int
    name: str
    available: bool
    timestamp: str

@app.get("/health")
def health():
    return {"status": "ok", "service": "orders-service"}

@app.post("/events/space-changed")
def handle_space_changed(event: SpaceEvent):
    SPACE_AVAILABILITY[event.space_id] = event.available
    print(f"[Orders Event-Driven] Evento recibido: Espacio {event.space_id} disponible={event.available}")
    return {"status": "event_processed", "space_id": event.space_id, "available": event.available}

@app.post("/orders")
async def create_order(space_id: int, user_email: str, hours: int):
    # Validacion por evento recibido
    if SPACE_AVAILABILITY.get(space_id) is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Space {space_id} is currently marked as unavailable via SpaceChanged event"
        )

    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            res = await client.get(f"{CATALOG_SERVICE_URL}/spaces/{space_id}")
            if res.status_code == 404:
                raise HTTPException(status_code=404, detail="Space not found")
            res.raise_for_status()
            space_data = res.json()
    except httpx.RequestError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Catalog service is down")

    try:
        price_per_hour = space_data["price_per_hour"]
    except KeyError:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Contract mismatch")

    order = {
        "id": len(ORDERS) + 1,
        "space_id": space_id,
        "space_name": space_data["name"],
        "user_email": user_email,
        "hours": hours,
        "total_price": price_per_hour * hours
    }
    ORDERS.append(order)
    return order

@app.get("/orders")
def list_orders():
    return ORDERS
