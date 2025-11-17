from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import structlog
import traceback
import sys

logger = structlog.get_logger(__name__)


async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, RequestValidationError):
        logger.error(
            "validation_error",
            errors=exc.errors(),
            request_method=request.method,
            request_url=str(request.url),
        )
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors()},
        )
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

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected internal server error occurred."},
    )
