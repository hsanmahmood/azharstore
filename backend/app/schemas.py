from pydantic import BaseModel, validator
from typing import Optional
from enum import Enum

class OrderStatus(str, Enum):
    processing = 'processing'
    ready = 'ready'
    delivered = 'delivered'
    shipped = 'shipped'

class ShippingMethod(str, Enum):
    delivery = 'delivery'
    pick_up = 'pick_up'

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
    price: float
    stock_quantity: int
    image_url: Optional[str] = None
    product: Optional['Product'] = None

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
    price: float
    stock_quantity: int

class ProductVariantUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None

class ProductVariantUpsert(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    stock_quantity: int
    image_url: Optional[str] = None

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

class Customer(BaseModel):
    id: int
    name: str
    phone_number: str
    town: Optional[str] = None
    address_home: Optional[str] = None
    address_road: Optional[str] = None
    address_block: Optional[str] = None

class DeliveryLoginRequest(BaseModel):
    password: str

class DeliveryPasswordUpdate(BaseModel):
    password: str

class DeliveryArea(BaseModel):
    id: int
    name: str
    price: float

class DeliveryAreaCreate(BaseModel):
    name: str
    price: float

class AppSettings(BaseModel):
    free_delivery_threshold: Optional[float] = None
    delivery_message: Optional[str] = None
    pickup_message: Optional[str] = None

class Translation(BaseModel):
    id: int
    key: str
    value: str

class TranslationCreate(BaseModel):
    key: str
    value: str

class TranslationUpdate(BaseModel):
    value: str

class OrderItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_variant_id: Optional[int] = None
    quantity: int

    @validator('product_variant_id', pre=True, always=True)
    def check_product_or_variant(cls, v, values):
        if values.get('product_id') is None and v is None:
            raise ValueError('Either product_id or product_variant_id must be provided')
        if values.get('product_id') is not None and v is not None:
            raise ValueError('Cannot provide both product_id and product_variant_id')
        return v

class OrderItem(OrderItemCreate):
    id: int
    order_id: int
    product_variant: Optional['ProductVariant'] = None
    product: Optional['Product'] = None

class PublicOrderCreate(BaseModel):
    customer: 'CustomerCreate'
    shipping_method: ShippingMethod
    status: OrderStatus = OrderStatus.processing
    comments: Optional[str] = None
    order_items: list[OrderItemCreate]
    delivery_area_id: Optional[int] = None
    delivery_fee: Optional[float] = None

class OrderCreate(BaseModel):
    customer_id: int
    shipping_method: ShippingMethod
    status: OrderStatus = OrderStatus.processing
    comments: Optional[str] = None
    order_items: list[OrderItemCreate]
    delivery_area_id: Optional[int] = None
    delivery_fee: Optional[float] = None

class Order(BaseModel):
    id: int
    customer_id: int
    shipping_method: ShippingMethod
    status: OrderStatus
    comments: Optional[str] = None
    created_at: datetime
    order_items: list[OrderItem] = []
    customer: Customer
    delivery_area_id: Optional[int] = None
    delivery_fee: Optional[float] = None
    delivery_area: Optional[DeliveryArea] = None

    @validator('delivery_area_id', pre=True, always=True)
    def set_delivery_area_id(cls, v, values):
        if 'delivery_area' in values and values['delivery_area']:
            return values['delivery_area'].id
        return v

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    shipping_method: Optional[ShippingMethod] = None
    comments: Optional[str] = None
    order_items: Optional[list[OrderItemCreate]] = None
    delivery_area_id: Optional[int] = None
    delivery_fee: Optional[float] = None

class CustomerCreate(BaseModel):
    name: str
    phone_number: str
    town: Optional[str] = None
    address_home: Optional[str] = None
    address_road: Optional[str] = None
    address_block: Optional[str] = None

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    town: Optional[str] = None
    address_home: Optional[str] = None
    address_road: Optional[str] = None
    address_block: Optional[str] = None
