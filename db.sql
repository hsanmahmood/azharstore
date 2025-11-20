-- Drop existing tables and types to ensure a clean slate.
-- The CASCADE option will automatically drop any dependent objects.
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Drop custom types if they exist.
DROP TYPE IF EXISTS public.order_status;
DROP TYPE IF EXISTS public.shipping_method;

-- Create custom ENUM types.
CREATE TYPE public.order_status AS ENUM (
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);

CREATE TYPE public.shipping_method AS ENUM (
    'standard',
    'express'
);

-- Create the 'categories' table.
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE
);

-- Create the 'products' table.
CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock_quantity INTEGER,
    category_id INTEGER,
    CONSTRAINT fk_category
        FOREIGN KEY(category_id)
        REFERENCES public.categories(id)
        ON DELETE SET NULL
);

-- Create the 'product_variants' table.
CREATE TABLE public.product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
        REFERENCES public.products(id)
        ON DELETE CASCADE,
    UNIQUE (product_id, name) -- Ensure variant names are unique per product.
);

-- Create the 'product_images' table.
CREATE TABLE public.product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
        REFERENCES public.products(id)
        ON DELETE CASCADE
);

-- Create the 'customers' table.
CREATE TABLE public.customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL UNIQUE CHECK (char_length(phone_number) = 8),
    town VARCHAR,
    address_home VARCHAR,
    address_road VARCHAR,
    address_block VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the 'orders' table.
CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    status order_status NOT NULL DEFAULT 'processing',
    shipping_method shipping_method NOT NULL,
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_customer
        FOREIGN KEY(customer_id)
        REFERENCES public.customers(id)
        ON DELETE RESTRICT
);

-- Create the 'order_items' table.
CREATE TABLE public.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    product_variant_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    CONSTRAINT fk_order
        FOREIGN KEY(order_id)
        REFERENCES public.orders(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
        REFERENCES public.products(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_product_variant
        FOREIGN KEY(product_variant_id)
        REFERENCES public.product_variants(id)
        ON DELETE RESTRICT,
    -- Ensure that either product_id or product_variant_id is provided, but not both.
    CONSTRAINT chk_product_or_variant CHECK (
        (product_id IS NOT NULL AND product_variant_id IS NULL) OR
        (product_id IS NULL AND product_variant_id IS NOT NULL)
    )
);
