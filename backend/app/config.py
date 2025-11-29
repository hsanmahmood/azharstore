import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    SUPABASE_URL: str
    SUPABASE_KEY: str
    AZHAR_ADMIN_EMAIL: str
    AZHAR_ADMIN_INITIAL_PASSWORD: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: str = ""

settings = Settings()

# Centralized CORS origins configuration
essential_origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://az-rosy.vercel.app",
    "https://azhar.store",
    "https://admin.azhar.store",
    "https://orders.azhar.store",
}

additional_origins = {origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()}
allowed_origins = list(essential_origins.union(additional_origins))
