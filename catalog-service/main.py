from fastapi import FastAPI, HTTPException
import uvicorn

app = FastAPI(title="Catalog Service")

spaces = [
    {"id": 1, "name": "Hot Desk Alpha", "capacity": 1, "price_per_hour": 15.0},
    {"id": 2, "name": "Private Office Beta", "capacity": 4, "price_per_hour": 45.0},
    {"id": 3, "name": "Meeting Room Gamma", "capacity": 10, "price_per_hour": 75.0},
]

@app.get("/health")
def health():
    return {"status": "ok", "service": "catalog-service"}

@app.get("/spaces")
def get_spaces():
    return spaces

@app.get("/spaces/{space_id}")
def get_space(space_id: int):
    for space in spaces:
        if space["id"] == space_id:
            return space
    raise HTTPException(status_code=404, detail="Space not found")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
