from supabase import Client
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer

from . import schemas
from .config import settings
from .supabase_client import get_supabase_client

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_admin_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return {"email": email}

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_categories(supabase: Client = Depends(get_supabase_client)) -> list[schemas.Category]:
    response = supabase.table("categories").select("*").execute()
    return response.data

def get_category(category_id: int, supabase: Client = Depends(get_supabase_client)) -> schemas.Category | None:
    response = supabase.table("categories").select("*").eq("id", category_id).execute()
    return response.data[0] if response.data else None

def create_category(category: schemas.CategoryCreate, supabase: Client = Depends(get_supabase_client)) -> schemas.Category:
    response = supabase.table("categories").insert(category.model_dump()).execute()
    return response.data[0]

def update_category(category_id: int, category: schemas.CategoryCreate, supabase: Client = Depends(get_supabase_client)) -> schemas.Category | None:
    response = supabase.table("categories").update(category.model_dump()).eq("id", category_id).execute()
    return response.data[0] if response.data else None

def delete_category(category_id: int, supabase: Client = Depends(get_supabase_client)) -> bool:
    response = supabase.table("categories").delete().eq("id", category_id).execute()
    return bool(response.data)

def get_products(supabase: Client = Depends(get_supabase_client)) -> list[schemas.Product]:
    response = supabase.table("products").select("*, category:categories(*), product_images(*), product_variants(*)").execute()
    return response.data

def get_product(product_id: int, supabase: Client = Depends(get_supabase_client)) -> schemas.Product | None:
    response = supabase.table("products").select("*, category:categories(*), product_images(*), product_variants(*)").eq("id", product_id).execute()
    return response.data[0] if response.data else None

def create_product(product: schemas.ProductCreate, supabase: Client = Depends(get_supabase_client)) -> schemas.Product:
    # Insert the new product
    insert_response = supabase.table("products").insert(product.model_dump()).execute()

    # Check if the insert was successful and get the new product's ID
    if not insert_response.data:
        raise HTTPException(status_code=500, detail="Failed to create the product.")

    new_product_id = insert_response.data[0]['id']

    # Fetch the newly created product with its category relation
    select_response = supabase.table("products").select("*, category:categories(*)").eq("id", new_product_id).execute()

    if not select_response.data:
        raise HTTPException(status_code=404, detail="Newly created product not found.")

    return select_response.data[0]

def update_product(product_id: int, product: schemas.ProductUpdate, supabase: Client = Depends(get_supabase_client)) -> schemas.Product | None:
    product_data = product.model_dump(exclude_unset=True)

    # Handle product_images update
    if "product_images" in product_data:
        images_data = product_data.pop("product_images")
        image_ids_from_request = {img['id'] for img in images_data}

        # Fetch current images from DB
        response = supabase.table("product_images").select("id, image_url").eq("product_id", product_id).execute()
        current_images = response.data
        current_image_ids = {img['id'] for img in current_images}

        # Determine which images to delete
        images_to_delete = [img for img in current_images if img['id'] not in image_ids_from_request]

        if images_to_delete:
            image_ids_to_delete = [img['id'] for img in images_to_delete]

            # Extract file paths and remove from storage
            file_paths_to_delete = ["/".join(img['image_url'].split("/")[-2:]) for img in images_to_delete]
            if file_paths_to_delete:
                supabase.storage.from_("products").remove(file_paths_to_delete)

            # Delete from database
            supabase.table("product_images").delete().in_("id", image_ids_to_delete).execute()

        # Reset all is_primary flags for the product
        supabase.table("product_images").update({"is_primary": False}).eq("product_id", product_id).execute()

        # Set the new primary image
        primary_image = next((img for img in images_data if img.get('is_primary')), None)
        if primary_image:
            supabase.table("product_images").update({"is_primary": True}).eq("id", primary_image['id']).execute()
        else:
            # If no primary is specified, make the first image primary
            remaining_images_response = supabase.table("product_images").select("id").eq("product_id", product_id).order("created_at").execute()
            if remaining_images_response.data:
                first_image_id = remaining_images_response.data[0]['id']
                supabase.table("product_images").update({"is_primary": True}).eq("id", first_image_id).execute()

    # Handle product_variants update
    if "product_variants" in product_data:
        variants_data = product_data.pop("product_variants")
        response = supabase.table("product_variants").select("id").eq("product_id", product_id).execute()
        current_variant_ids = {item['id'] for item in response.data}
        upserted_variant_ids = set()

        for variant in variants_data:
            variant_id = variant.get("id")
            # Ensure image_url is included in the upsert data if it exists
            upsert_data = {k: v for k, v in variant.items() if k != 'id'}
            if variant_id:
                upserted_variant_ids.add(variant_id)
                supabase.table("product_variants").update(upsert_data).eq("id", variant_id).execute()
            else:
                upsert_data["product_id"] = product_id
                response = supabase.table("product_variants").insert(upsert_data).execute()
                if response.data:
                    upserted_variant_ids.add(response.data[0]['id'])

        variants_to_delete = current_variant_ids - upserted_variant_ids
        if variants_to_delete:
            # Check if any of the variants to be deleted are in an order
            response = supabase.table("order_items").select("id").in_("product_variant_id", list(variants_to_delete)).execute()
            if response.data:
                # If there are order items associated with the variants, raise an error
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Cannot delete product variants that are part of an existing order."
                )
            supabase.table("product_variants").delete().in_("id", list(variants_to_delete)).execute()

    # Update product details
    if product_data:
        response = supabase.table("products").update(product_data).eq("id", product_id).execute()
        if not response.data:
            return None

    return get_product(product_id=product_id, supabase=supabase)

def delete_product(product_id: int, supabase: Client = Depends(get_supabase_client)) -> bool:
    response = supabase.table("products").delete().eq("id", product_id).execute()
    return bool(response.data)

def create_product_image(product_id: int, image_url: str, supabase: Client = Depends(get_supabase_client)) -> schemas.ProductImage:
    existing_primary_image = supabase.table("product_images").select("id").eq("product_id", product_id).eq("is_primary", True).execute()
    is_primary = not existing_primary_image.data
    response = supabase.table("product_images").insert({"product_id": product_id, "image_url": image_url, "is_primary": is_primary}).execute()
    return response.data[0]

def delete_product_image(image_id: int, supabase: Client = Depends(get_supabase_client)) -> bool:
    image_response = supabase.table("product_images").select("image_url, product_id, is_primary").eq("id", image_id).execute()
    if not image_response.data:
        return False

    image_data = image_response.data[0]
    image_url = image_data["image_url"]
    product_id = image_data["product_id"]
    was_primary = image_data["is_primary"]

    file_path = "/".join(image_url.split("/")[-2:])

    supabase.storage.from_("products").remove([file_path])

    response = supabase.table("product_images").delete().eq("id", image_id).execute()

    return bool(response.data)

def set_primary_image(image_id: int, supabase: Client = Depends(get_supabase_client)) -> schemas.ProductImage | None:
    image_response = supabase.table("product_images").select("product_id").eq("id", image_id).execute()
    if not image_response.data:
        return None
    product_id = image_response.data[0]["product_id"]

    supabase.table("product_images").update({"is_primary": False}).eq("product_id", product_id).execute()

    response = supabase.table("product_images").update({"is_primary": True}).eq("id", image_id).execute()
    return response.data[0] if response.data else None

def create_product_variant(product_id: int, variant: schemas.ProductVariantCreate, supabase: Client = Depends(get_supabase_client)) -> schemas.ProductVariant:
    response = supabase.table("product_variants").insert({"product_id": product_id, **variant.model_dump()}).execute()
    return response.data[0]

def update_product_variant(variant_id: int, variant: schemas.ProductVariantUpdate, supabase: Client = Depends(get_supabase_client)) -> schemas.ProductVariant | None:
    response = supabase.table("product_variants").update(variant.model_dump(exclude_unset=True)).eq("id", variant_id).execute()
    return response.data[0] if response.data else None

def delete_product_variant(variant_id: int, supabase: Client = Depends(get_supabase_client)) -> bool:
    response = supabase.table("product_variants").delete().eq("id", variant_id).execute()
    return bool(response.data)

def update_product_variant_image(variant_id: int, image_url: str, supabase: Client = Depends(get_supabase_client)) -> schemas.ProductVariant | None:
    response = supabase.table("product_variants").update({"image_url": image_url}).eq("id", variant_id).execute()
    return response.data[0] if response.data else None

def create_order(order: schemas.OrderCreate, supabase: Client = Depends(get_supabase_client)) -> schemas.Order:
    order_data = order.model_dump(exclude={"order_items"})
    order_response = supabase.table("orders").insert(order_data).execute()
    if not order_response.data:
        raise HTTPException(status_code=500, detail="Failed to create order.")

    new_order = order_response.data[0]

    order_items_data = []
    for item in order.order_items:
        item_data = item.model_dump()
        if item_data.get("product_variant_id"):
            item_data["product_id"] = None
        order_items_data.append({"order_id": new_order['id'], **item_data})

    if order_items_data:
        items_response = supabase.table("order_items").insert(order_items_data).execute()
        if not items_response.data:
            # Rollback order creation if items fail
            supabase.table("orders").delete().eq("id", new_order['id']).execute()
            raise HTTPException(status_code=500, detail="Failed to create order items.")

    return get_order(new_order['id'], supabase)

def get_orders(supabase: Client = Depends(get_supabase_client)) -> list[schemas.Order]:
    response = supabase.table("orders").select("*, customer:customers(*), order_items(*, product:products(*, product_images(*)), product_variant:product_variants(*, product:products(*, product_images(*))))").execute()
    return response.data

def get_order(order_id: int, supabase: Client = Depends(get_supabase_client)) -> schemas.Order | None:
    response = supabase.table("orders").select("*, customer:customers(*), order_items(*, product:products(*, product_images(*)), product_variant:product_variants(*, product:products(*, product_images(*))))").eq("id", order_id).execute()
    return response.data[0] if response.data else None

def update_order(order_id: int, order: schemas.OrderUpdate, supabase: Client = Depends(get_supabase_client)) -> schemas.Order | None:
    order_data = order.model_dump(exclude_unset=True, exclude={"order_items"})
    if order_data:
        response = supabase.table("orders").update(order_data).eq("id", order_id).execute()
        if not response.data:
            return None

    if order.order_items is not None:
        # Delete existing items
        supabase.table("order_items").delete().eq("order_id", order_id).execute()

        # Create new items
        order_items_data = []
        for item in order.order_items:
            item_data = item.model_dump()
            if item_data.get("product_variant_id"):
                item_data["product_id"] = None
            order_items_data.append({"order_id": order_id, **item_data})

        if order_items_data:
            items_response = supabase.table("order_items").insert(order_items_data).execute()
            if not items_response.data:
                raise HTTPException(status_code=500, detail="Failed to update order items.")

    return get_order(order_id, supabase)

def delete_order(order_id: int, supabase: Client = Depends(get_supabase_client)) -> bool:
    # First, delete associated order items
    supabase.table("order_items").delete().eq("order_id", order_id).execute()

    # Then, delete the order itself
    response = supabase.table("orders").delete().eq("id", order_id).execute()

    return bool(response.data)
