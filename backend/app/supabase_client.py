import os
from supabase import create_client, Client, ClientOptions
from .config import settings

def get_supabase_client() -> Client:
    """
    Creates and returns a Supabase client configured with longer timeouts
    to mitigate transient network errors.
    """
    supabase_url = os.getenv("SUPABASE_URL", settings.SUPABASE_URL)
    options = ClientOptions(
        postgrest_client_timeout=15,  # Timeout for PostgREST requests
        storage_client_timeout=15   # Timeout for Storage requests
    )
    return create_client(
        supabase_url,
        settings.SUPABASE_KEY,
        options=options
    )
