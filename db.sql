-- Add a check constraint to ensure either product_id or product_variant_id is set, but not both
ALTER TABLE public.order_items
ADD CONSTRAINT check_product_or_variant CHECK (
  (product_id IS NOT NULL AND product_variant_id IS NULL) OR
  (product_id IS NULL AND product_variant_id IS NOT NULL)
);
