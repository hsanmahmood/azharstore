import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router, admin_router, customers_router
from app.config import settings, allowed_origins
from app.logging_config import setup_logging
from app.errors import global_exception_handler, http_exception_handler

setup_logging()

app = FastAPI(title="AzharStore API", version="0.1.0")

app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

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
app.include_router(customers_router)

@app.on_event("startup")
def startup_event():
    from app.supabase_client import get_supabase_client
    supabase = get_supabase_client()
    try:
        response = supabase.rpc('get_schema', {}).execute()
        print("Supabase schema:", response)
    except Exception as e:
        print("Error getting schema:", e)
