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

    stored_password = response.data[0]['value']

    # Plaintext comparison
    if delivery_login.password != stored_password:
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

    # We are now storing the plaintext password for simplicity, so return it directly.
    # In a real-world scenario, you would never do this. This is a temporary measure.
    # The value stored in the database is the actual password, not a hash.

    # Check if 'value' exists and is not empty
    password_value = response.data[0].get('value')
    if not password_value:
        return {"password": ""}

    return {"password": password_value}

def update_delivery_password(password_data: schemas.DeliveryPasswordUpdate, supabase: Client = Depends(get_supabase_client)):
    # Storing plaintext password for simplicity.
    # This is not secure and should not be done in a production environment.
    supabase.table("system_settings").upsert({
        "key": "delivery_password",
        "value": password_data.password
    }).execute()
    return {"message": "Password updated successfully"}
