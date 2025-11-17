CREATE TABLE IF NOT EXISTS public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name character varying NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.customers (
  id integer NOT NULL DEFAULT nextval('customers_id_seq'::regclass),
  name character varying NOT NULL,
  phone_number character varying NOT NULL CHECK (char_length(phone_number::text) = 8),
  town character varying,
  address_home character varying,
  address_road character varying,
  address_block character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.products (
  id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  price real NOT NULL,
  stock_quantity integer,
  category_id integer,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id integer NOT NULL DEFAULT nextval('product_images_id_seq'::regclass),
  product_id integer NOT NULL,
  image_url text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id integer NOT NULL DEFAULT nextval('product_variants_id_seq'::regclass),
  product_id integer NOT NULL,
  name text NOT NULL,
  stock_quantity integer NOT NULL,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('processing', 'ready', 'delivered', 'shipped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE shipping_method AS ENUM ('delivery', 'pick_up');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    customer_id integer NOT NULL,
    status order_status NOT NULL DEFAULT 'processing',
    shipping_method shipping_method NOT NULL,
    comments text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id SERIAL PRIMARY KEY,
    order_id integer NOT NULL,
    product_variant_id integer NOT NULL,
    quantity integer NOT NULL,
    price real NOT NULL,
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
    CONSTRAINT order_items_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id)
);
