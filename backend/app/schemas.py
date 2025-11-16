from pydantic import BaseModel
from typing import Optional

class AdminLoginRequest(BaseModel):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Category(BaseModel):
    id: int
    name: str

class CategoryCreate(BaseModel):
    name: str

from datetime import datetime

class ProductImage(BaseModel):
    id: int
    product_id: int
    image_url: str
    is_primary: bool
    created_at: datetime

class ProductVariant(BaseModel):
    id: int
    product_id: int
    name: str
    stock_quantity: int
    image_url: Optional[str] = None

class Product(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: Optional[int] = None
    category_id: Optional[int] = None
    category: Optional[Category] = None
    product_images: list[ProductImage] = []
    product_variants: list[ProductVariant] = []

class ProductVariantCreate(BaseModel):
    name: str
    stock_quantity: int

class ProductVariantUpdate(BaseModel):
    name: Optional[str] = None
    stock_quantity: Optional[int] = None

class ProductVariantUpsert(BaseModel):
    id: Optional[int] = None
    name: str
    stock_quantity: int

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: Optional[int] = None
    category_id: Optional[int] = None

class ProductImageUpdate(BaseModel):
    id: int
    is_primary: bool

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    category_id: Optional[int] = None
    product_variants: Optional[list[ProductVariantUpsert]] = None
    product_images: Optional[list[ProductImageUpdate]] = None

