from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List
from supabase import Client
import secrets
import uuid

from . import services, schemas, customer_services, delivery_services
from .config import settings
from .supabase_client import get_supabase_client

main_router = APIRouter()

router = APIRouter(prefix="/api")
admin_router = APIRouter(
    prefix="/api/admin",
    dependencies=[Depends(services.get_current_admin_user)],
)
customers_router = APIRouter(
    prefix="/api/admin",
    dependencies=[Depends(services.get_current_admin_user)],
)

@router.post("/login", response_model=schemas.Token, tags=["Authentication"])
def login_for_access_token(form_data: schemas.AdminLoginRequest):
    is_valid_password = secrets.compare_digest(form_data.password, settings.AZHAR_ADMIN_INITIAL_PASSWORD)
    if not is_valid_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = services.create_access_token(data={"sub": settings.AZHAR_ADMIN_EMAIL})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/products", response_model=List[schemas.Product], tags=["Products"])
def list_products(supabase: Client = Depends(get_supabase_client)):
    return services.get_products(supabase=supabase)

@router.get("/products/{product_id}", response_model=schemas.Product, tags=["Products"])
def get_product(product_id: int, supabase: Client = Depends(get_supabase_client)):
    db_product = services.get_product(product_id=product_id, supabase=supabase)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.get("/categories", response_model=List[schemas.Category], tags=["Categories"])
def list_categories(supabase: Client = Depends(get_supabase_client)):
    return services.get_categories(supabase=supabase)

@router.get("/categories/{category_id}", response_model=schemas.Category, tags=["Categories"])
def get_category(category_id: int, supabase: Client = Depends(get_supabase_client)):
    db_category = services.get_category(category_id=category_id, supabase=supabase)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.get("/delivery-areas", response_model=List[schemas.DeliveryArea], tags=["Delivery Areas"])
def list_delivery_areas_public(supabase: Client = Depends(get_supabase_client)):
    return services.get_delivery_areas(supabase=supabase)

@router.post("/orders", response_model=schemas.Order, tags=["Orders"])
def create_order_public(order: schemas.PublicOrderCreate, supabase: Client = Depends(get_supabase_client)):
    return services.create_public_order(order=order, supabase=supabase)

@router.get("/settings", response_model=schemas.AppSettings, tags=["Settings"])
def get_settings_public(supabase: Client = Depends(get_supabase_client)):
    return services.get_app_settings(supabase=supabase)

@admin_router.post("/products", response_model=schemas.Product, tags=["Admin - Products"])
def create_product(product: schemas.ProductCreate, supabase: Client = Depends(get_supabase_client)):
    return services.create_product(product=product, supabase=supabase)

@admin_router.patch("/products/{product_id}", response_model=schemas.Product, tags=["Admin - Products"])
def update_product(product_id: int, product: schemas.ProductUpdate, supabase: Client = Depends(get_supabase_client)):
    db_product = services.update_product(product_id=product_id, product=product, supabase=supabase)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@admin_router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin - Products"])
def delete_product(product_id: int, supabase: Client = Depends(get_supabase_client)):
    success = services.delete_product(product_id=product_id, supabase=supabase)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return None

@admin_router.post("/categories", response_model=schemas.Category, tags=["Admin - Categories"])
def create_category(category: schemas.CategoryCreate, supabase: Client = Depends(get_supabase_client)):
    return services.create_category(category=category, supabase=supabase)

@admin_router.get("/products", response_model=List[schemas.Product], tags=["Admin - Products"])
def admin_list_products(supabase: Client = Depends(get_supabase_client)):
    return services.get_products(supabase=supabase)

@admin_router.get("/categories", response_model=List[schemas.Category], tags=["Admin - Categories"])
def admin_list_categories(supabase: Client = Depends(get_supabase_client)):
    return services.get_categories(supabase=supabase)

@admin_router.patch("/categories/{category_id}", response_model=schemas.Category, tags=["Admin - Categories"])
def update_category(category_id: int, category: schemas.CategoryCreate, supabase: Client = Depends(get_supabase_client)):
    db_category = services.update_category(category_id=category_id, category=category, supabase=supabase)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@admin_router.post("/products/{product_id}/images", response_model=schemas.ProductImage, tags=["Admin - Products"])
def upload_product_image(product_id: int, file: UploadFile = File(...), supabase: Client = Depends(get_supabase_client)):
    file_path = f"{product_id}/{uuid.uuid4()}{file.filename}"
    try:
        file_content = file.file.read()
        supabase.storage.from_("products").upload(file_path, file_content)
        image_url = supabase.storage.from_("products").get_public_url(file_path)
        return services.create_product_image(product_id=product_id, image_url=image_url, supabase=supabase)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@admin_router.delete("/products/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin - Products"])
def delete_product_image(image_id: int, supabase: Client = Depends(get_supabase_client)):
    success = services.delete_product_image(image_id=image_id, supabase=supabase)
    if not success:
        raise HTTPException(status_code=404, detail="Image not found")
    return None

@admin_router.post("/products/images/{image_id}/set-primary", response_model=schemas.ProductImage, tags=["Admin - Products"])
def set_primary_image(image_id: int, supabase: Client = Depends(get_supabase_client)):
    image = services.set_primary_image(image_id=image_id, supabase=supabase)
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return image

@admin_router.post("/products/{product_id}/variants", response_model=schemas.ProductVariant, tags=["Admin - Products"])
def create_variant(product_id: int, variant: schemas.ProductVariantCreate, supabase: Client = Depends(get_supabase_client)):
    return services.create_product_variant(product_id=product_id, variant=variant, supabase=supabase)

@admin_router.patch("/products/variants/{variant_id}", response_model=schemas.ProductVariant, tags=["Admin - Products"])
def update_variant(variant_id: int, variant: schemas.ProductVariantUpdate, supabase: Client = Depends(get_supabase_client)):
    db_variant = services.update_product_variant(variant_id=variant_id, variant=variant, supabase=supabase)
    if db_variant is None:
        raise HTTPException(status_code=404, detail="Variant not found")
    return db_variant

@admin_router.delete("/products/variants/{variant_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin - Products"])
def delete_variant(variant_id: int, supabase: Client = Depends(get_supabase_client)):
    success = services.delete_product_variant(variant_id=variant_id, supabase=supabase)
    if not success:
        raise HTTPException(status_code=404, detail="Variant not found")
    return None

@admin_router.post("/products/variants/{variant_id}/image", response_model=schemas.ProductVariant, tags=["Admin - Products"])
def upload_variant_image(variant_id: int, file: UploadFile = File(...), supabase: Client = Depends(get_supabase_client)):
    file_path = f"variants/{variant_id}/{uuid.uuid4()}{file.filename}"
    try:
        file_content = file.file.read()
        supabase.storage.from_("products").upload(file_path, file_content)
        image_url = supabase.storage.from_("products").get_public_url(file_path)
        return services.update_product_variant_image(variant_id=variant_id, image_url=image_url, supabase=supabase)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@admin_router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin - Categories"])
def delete_category(category_id: int, supabase: Client = Depends(get_supabase_client)):
    success = services.delete_category(category_id=category_id, supabase=supabase)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return None

@customers_router.get("/customers", response_model=List[schemas.Customer], tags=["Admin - Customers"])
def list_customers(supabase: Client = Depends(get_supabase_client)):
    return customer_services.get_customers(supabase=supabase)

@customers_router.get("/customers/{customer_id}", response_model=schemas.Customer, tags=["Admin - Customers"])
def get_customer(customer_id: int, supabase: Client = Depends(get_supabase_client)):
    db_customer = customer_services.get_customer(customer_id=customer_id, supabase=supabase)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@customers_router.post("/customers", response_model=schemas.Customer, tags=["Admin - Customers"])
def create_customer(customer: schemas.CustomerCreate, supabase: Client = Depends(get_supabase_client)):
    return customer_services.create_customer(customer=customer, supabase=supabase)

@customers_router.patch("/customers/{customer_id}", response_model=schemas.Customer, tags=["Admin - Customers"])
def update_customer(customer_id: int, customer: schemas.CustomerUpdate, supabase: Client = Depends(get_supabase_client)):
    db_customer = customer_services.update_customer(customer_id=customer_id, customer=customer, supabase=supabase)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@customers_router.delete("/customers/{customer_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin - Customers"])
def delete_customer(customer_id: int, supabase: Client = Depends(get_supabase_client)):
    success = customer_services.delete_customer(customer_id=customer_id, supabase=supabase)
    if not success:
        raise HTTPException(status_code=404, detail="Customer not found")
    return None

orders_router = APIRouter(
    prefix="/api/admin"
)

@orders_router.post("/orders", response_model=schemas.Order, tags=["Admin - Orders"], dependencies=[Depends(services.get_current_admin_user)])
def create_order(order: schemas.OrderCreate, supabase: Client = Depends(get_supabase_client)):
    return services.create_order(order=order, supabase=supabase)

@orders_router.get("/orders", response_model=List[schemas.Order], tags=["Admin - Orders"], dependencies=[Depends(services.get_current_admin_user)])
def list_orders(supabase: Client = Depends(get_supabase_client)):
    return services.get_orders(supabase=supabase)

@orders_router.get("/orders/{order_id}", response_model=schemas.Order, tags=["Admin - Orders"], dependencies=[Depends(services.get_current_admin_user)])
def get_order(order_id: int, supabase: Client = Depends(get_supabase_client)):
    db_order = services.get_order(order_id=order_id, supabase=supabase)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@orders_router.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin - Orders"], dependencies=[Depends(services.get_current_admin_user)])
def delete_order(order_id: int, supabase: Client = Depends(get_supabase_client)):
    success = services.delete_order(order_id=order_id, supabase=supabase)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return None

@orders_router.patch("/orders/{order_id}", response_model=schemas.Order, tags=["Admin - Orders"], dependencies=[Depends(services.get_current_admin_user)])
def update_order(order_id: int, order: schemas.OrderUpdate, supabase: Client = Depends(get_supabase_client)):
    db_order = services.update_order(order_id=order_id, order=order, supabase=supabase)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@admin_router.get("/delivery-areas", response_model=List[schemas.DeliveryArea], tags=["Admin - Delivery Areas"])
def list_delivery_areas(supabase: Client = Depends(get_supabase_client)):
    return services.get_delivery_areas(supabase=supabase)

@admin_router.post("/delivery-areas", response_model=schemas.DeliveryArea, tags=["Admin - Delivery Areas"])
def create_delivery_area(delivery_area: schemas.DeliveryAreaCreate, supabase: Client = Depends(get_supabase_client)):
    return services.create_delivery_area(delivery_area=delivery_area, supabase=supabase)

@admin_router.patch("/delivery-areas/{delivery_area_id}", response_model=schemas.DeliveryArea, tags=["Admin - Delivery Areas"])
def update_delivery_area(delivery_area_id: int, delivery_area: schemas.DeliveryAreaCreate, supabase: Client = Depends(get_supabase_client)):
    db_delivery_area = services.update_delivery_area(delivery_area_id=delivery_area_id, delivery_area=delivery_area, supabase=supabase)
    if db_delivery_area is None:
        raise HTTPException(status_code=404, detail="Delivery area not found")
    return db_delivery_area

@admin_router.delete("/delivery-areas/{delivery_area_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin - Delivery Areas"])
def delete_delivery_area(delivery_area_id: int, supabase: Client = Depends(get_supabase_client)):
    success = services.delete_delivery_area(delivery_area_id=delivery_area_id, supabase=supabase)
    if not success:
        raise HTTPException(status_code=404, detail="Delivery area not found")
    return None

@admin_router.get("/settings", response_model=schemas.AppSettings, tags=["Admin - Settings"])
def get_settings(supabase: Client = Depends(get_supabase_client)):
    return services.get_app_settings(supabase=supabase)

@admin_router.patch("/settings", response_model=schemas.AppSettings, tags=["Admin - Settings"])
def update_settings(settings_data: schemas.AppSettings, supabase: Client = Depends(get_supabase_client)):
    return services.update_app_settings(settings_data=settings_data, supabase=supabase)

@router.get("/translations/all", response_model=List[schemas.Translation], tags=["Translations"])
def list_all_translations(supabase: Client = Depends(get_supabase_client)):
    return services.get_all_translations(supabase=supabase)

@admin_router.patch("/translations/{translation_id}", response_model=schemas.Translation, tags=["Admin - Translations"])
def update_translation(translation_id: int, translation: schemas.TranslationUpdate, supabase: Client = Depends(get_supabase_client)):
    db_translation = services.update_translation(translation_id=translation_id, translation=translation, supabase=supabase)
    if db_translation is None:
        raise HTTPException(status_code=404, detail="Translation not found")
    return db_translation

@admin_router.post("/translations", response_model=schemas.Translation, tags=["Admin - Translations"])
def create_translation(translation: schemas.TranslationCreate, supabase: Client = Depends(get_supabase_client)):
    return services.create_translation(translation=translation, supabase=supabase)

@admin_router.post("/upload-image", tags=["Admin - General"])
def upload_image(file: UploadFile = File(...), supabase: Client = Depends(get_supabase_client)):
    file_path = f"messages/{uuid.uuid4()}_{file.filename}"
    try:
        file_content = file.file.read()
        content_type = file.content_type if file.content_type else "application/octet-stream"
        supabase.storage.from_("products").upload(
            file_path,
            file_content,
            {"content-type": content_type}
        )
        image_url = supabase.storage.from_("products").get_public_url(file_path)
        return {"location": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

main_router.include_router(router)
main_router.include_router(admin_router)
main_router.include_router(customers_router)
main_router.include_router(orders_router)

delivery_router = APIRouter(prefix="/api/delivery")

@delivery_router.post("/login", response_model=schemas.Token, tags=["Delivery - Authentication"])
def delivery_login(form_data: schemas.DeliveryLoginRequest, supabase: Client = Depends(get_supabase_client)):
    return delivery_services.login(delivery_login=form_data, supabase=supabase)

@delivery_router.get("/orders", response_model=List[schemas.Order], tags=["Delivery - Orders"], dependencies=[Depends(delivery_services.get_current_delivery_user)])
def delivery_list_orders(supabase: Client = Depends(get_supabase_client)):
    return services.get_orders(supabase=supabase)

@admin_router.get("/system/delivery-password", response_model=dict, tags=["Admin - System"])
def get_delivery_password(supabase: Client = Depends(get_supabase_client)):
    return delivery_services.get_delivery_password(supabase=supabase)

@admin_router.patch("/system/delivery-password", response_model=dict, tags=["Admin - System"])
def update_delivery_password(password_data: schemas.DeliveryPasswordUpdate, supabase: Client = Depends(get_supabase_client)):
    return delivery_services.update_delivery_password(password_data=password_data, supabase=supabase)

main_router.include_router(delivery_router)
