"""CityMind - Core FastAPI Application Entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CityMind API",
    description="A Git-inspired AI Memory Operating System for Smart Cities",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "CityMind OS",
        "version": "0.1.0",
        "message": "Git-inspired Smart City Memory Engine Initialized",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
