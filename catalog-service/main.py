from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import httpx
import os
from datetime import datetime

app = FastAPI(title="Catalog Service")

ORDERS_SERVICE_URL = os.getenv("ORDERS_SERVICE_URL", "http://orders-service:8002")

class SpaceStatusUpdate(BaseModel):
    available: bool

SPACES = [
    {"id": 1, "name": "Hot Desk Alpha", "price_per_hour": 15.0, "available": True},
    {"id": 2, "name": "Private Office Beta", "price_per_hour": 45.0, "available": True},
    {"id": 3, "name": "Meeting Room Gamma", "price_per_hour": 30.0, "available": True}
]

@app.get("/health")
def health():
    return {"status": "ok", "service": "catalog-service"}

@app.get("/spaces")
def get_spaces():
    return SPACES

@app.get("/spaces/{space_id}")
def get_space(space_id: int):
    space = next((s for s in SPACES if s["id"] == space_id), None)
    if not space:
        raise HTTPException(status_code=404, detail="Space not found")
    return space

@app.put("/spaces/{space_id}/availability")
async def update_availability(space_id: int, update: SpaceStatusUpdate):
    space = next((s for s in SPACES if s["id"] == space_id), None)
    if not space:
        raise HTTPException(status_code=404, detail="Space not found")
    
    space["available"] = update.available

    # Event-Driven: Emitir evento SpaceChanged
    event_payload = {
        "event": "SpaceChanged",
        "space_id": space_id,
        "name": space["name"],
        "available": update.available,
        "timestamp": datetime.utcnow().isoformat()
    }

    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            await client.post(f"{ORDERS_SERVICE_URL}/events/space-changed", json=event_payload)
    except Exception as e:
        print(f"[Event Dispatch Error] No se pudo enviar el evento a orders-service: {e}")

    return {"message": "Availability updated and event dispatched", "space": space}
