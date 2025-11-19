-- 1. Add a nullable product_id column to order_items
ALTER TABLE public.order_items
ADD COLUMN product_id INTEGER,
ADD CONSTRAINT fk_order_items_product_id FOREIGN KEY (product_id) REFERENCES public.products(id);

-- 2. Make the existing product_variant_id column nullable
ALTER TABLE public.order_items
ALTER COLUMN product_variant_id DROP NOT NULL;

-- 3. Add a check constraint to ensure either product_id or product_variant_id is set, but not both
ALTER TABLE public.order_items
ADD CONSTRAINT check_product_or_variant CHECK (
  (product_id IS NOT NULL AND product_variant_id IS NULL) OR
  (product_id IS NULL AND product_variant_id IS NOT NULL)
);
