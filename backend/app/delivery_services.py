from supabase import Client
from fastapi import Depends, HTTPException, status
from passlib.context import CryptContext
import secrets
from . import schemas
from .supabase_client import get_supabase_client
from .services import create_access_token # Reusing the access token creation

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def login(delivery_login: schemas.DeliveryLoginRequest, supabase: Client = Depends(get_supabase_client)):
    response = supabase.table("system_settings").select("value").eq("key", "delivery_password").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Delivery password not set")

    hashed_password = response.data[0]['value']

    if not verify_password(delivery_login.password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
        )

    access_token = create_access_token(data={"sub": "delivery_user"})
    return {"access_token": access_token, "token_type": "bearer"}

def get_delivery_password(supabase: Client = Depends(get_supabase_client)):
    response = supabase.table("system_settings").select("value").eq("key", "delivery_password").execute()
    if not response.data:
        return {"password": ""}
    # Return a dummy value, not the hash
    return {"password": "********"}

def update_delivery_password(password_data: schemas.DeliveryPasswordUpdate, supabase: Client = Depends(get_supabase_client)):
    hashed_password = get_password_hash(password_data.password)
    supabase.table("system_settings").upsert({"key": "delivery_password", "value": hashed_password}).execute()
    return {"message": "Password updated successfully"}
