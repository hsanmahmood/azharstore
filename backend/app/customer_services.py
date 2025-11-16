from supabase import Client
from fastapi import Depends
from . import schemas
from .supabase_client import get_supabase_client

def get_customers(supabase: Client = Depends(get_supabase_client)) -> list[schemas.Customer]:
    response = supabase.table("customers").select("*").execute()
    return response.data

def get_customer(customer_id: int, supabase: Client = Depends(get_supabase_client)) -> schemas.Customer | None:
    response = supabase.table("customers").select("*").eq("id", customer_id).execute()
    return response.data[0] if response.data else None

def create_customer(customer: schemas.CustomerCreate, supabase: Client = Depends(get_supabase_client)) -> schemas.Customer:
    response = supabase.table("customers").insert(customer.model_dump()).execute()
    return response.data[0]

def update_customer(customer_id: int, customer: schemas.CustomerUpdate, supabase: Client = Depends(get_supabase_client)) -> schemas.Customer | None:
    response = supabase.table("customers").update(customer.model_dump(exclude_unset=True)).eq("id", customer_id).execute()
    return response.data[0] if response.data else None

def delete_customer(customer_id: int, supabase: Client = Depends(get_supabase_client)) -> bool:
    response = supabase.table("customers").delete().eq("id", customer_id).execute()
    return bool(response.data)
