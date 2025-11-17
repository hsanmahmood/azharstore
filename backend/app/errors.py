from fastapi import Request, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import structlog
import traceback
import sys
import os

logger = structlog.get_logger(__name__)

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

def add_cors_headers(response: JSONResponse, request: Request) -> JSONResponse:
    origin = request.headers.get("origin")
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
    return response

async def http_exception_handler(request: Request, exc: HTTPException):
    response = JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=exc.headers,
    )
    return add_cors_headers(response, request)

async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, RequestValidationError):
        logger.error(
            "validation_error",
            errors=exc.errors(),
            request_method=request.method,
            request_url=str(request.url),
        )
        response = JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors()},
        )
        return add_cors_headers(response, request)

    try:
        logger.error(
            "unhandled_exception",
            error=str(exc),
            traceback=traceback.format_exc(),
            request_method=request.method,
            request_url=str(request.url),
        )
    except Exception as log_exc:
        print("--- FAILSAFE: LOGGER FAILED ---", file=sys.stderr)
        print(f"Original Exception: {exc}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        print("--- Logging Exception ---", file=sys.stderr)
        print(f"Logging Exception: {log_exc}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)

    response = JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected internal server error occurred."},
    )
    return add_cors_headers(response, request)
