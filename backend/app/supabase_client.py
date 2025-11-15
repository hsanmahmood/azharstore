import os
import httpx
from supabase import create_client, Client, ClientOptions
from .config import settings
from httpx import Limits, Timeout

# Configure retry logic for httpx
# This will help mitigate transient network errors, including DNS resolution failures.
retry_transport = httpx.HTTPTransport(
    retries=3,  # Number of retries
)

# Custom httpx client with the retry transport and increased timeouts
# The default timeout of 5 seconds can be too short for a cold start
# or network hiccups.
http_client = httpx.Client(
    transport=retry_transport,
    timeout=Timeout(15.0, connect=10.0), # 15s total, 10s for connect
    limits=Limits(max_connections=100, max_keepalive_connections=20)
)

def get_supabase_client() -> Client:
    """
    Creates and returns a Supabase client configured with a custom
    httpx client that includes retry logic and longer timeouts.
    """
    supabase_url = os.getenv("SUPABASE_URL", settings.SUPABASE_URL)
    options = ClientOptions(http_client=http_client)
    return create_client(
        supabase_url,
        settings.SUPABASE_KEY,
        options=options
    )
