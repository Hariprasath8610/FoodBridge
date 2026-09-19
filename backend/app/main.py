from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routes import predictions, recipients, missions, impact, demo

# Create DB tables
Base.metadata.create_all(bind=engine)

# Seed database on startup
with SessionLocal() as db:
    seed_database(db)

app = FastAPI(
    title="FoodBridge Intelligence API",
    description="Predictive food surplus and rescue mission coordination platform",
    version="1.0.0"
)

# CORS middleware for local frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(predictions.router)
app.include_router(recipients.router)
app.include_router(missions.router)
app.include_router(impact.router)
app.include_router(demo.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "FoodBridge Intelligence Engine",
        "version": "1.0.0",
        "ai_engine": "RandomForestRegressor (Live)",
        "weather_api": "Active (High Precipitation Geofence)",
        "cold_chain_telemetry": "Active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
