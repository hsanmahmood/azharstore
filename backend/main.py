import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router, admin_router
from app.config import settings
from app.logging_config import setup_logging
from app.errors import global_exception_handler, http_exception_handler

setup_logging()

app = FastAPI(title="AzharStore API", version="0.1.0")

app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

# Define a set of essential origins that should always be allowed
essential_origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://beta.azhar.store",
    "https://az-rosy.vercel.app",
    "https://azhar.store",
}

# Get additional origins from the environment variable
additional_origins_str = os.getenv("CORS_ORIGINS", "")
additional_origins = {origin.strip() for origin in additional_origins_str.split(",") if origin.strip()}

# Combine the sets to get a unique list of all allowed origins
allowed_origins = list(essential_origins.union(additional_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"name": "AzharStore API", "status": "ok", "version": "0.1.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.head("/health", status_code=200)
async def health_head():
    return None

app.include_router(api_router)
app.include_router(admin_router)
