import os
from supabase import create_client, Client
from .config import settings

def get_supabase_client() -> Client:
    supabase_url = os.getenv("SUPABASE_URL", settings.SUPABASE_URL)
    return create_client(supabase_url, settings.SUPABASE_KEY)
