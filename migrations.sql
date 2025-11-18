-- Add product_id to order_items, making it nullable
ALTER TABLE order_items
ADD COLUMN product_id INTEGER REFERENCES products(id);

-- Make product_variant_id nullable
ALTER TABLE order_items
ALTER COLUMN product_variant_id DROP NOT NULL;

-- Add a check constraint to ensure either product_id or product_variant_id is set
ALTER TABLE order_items
ADD CONSTRAINT check_product_or_variant CHECK (
  (product_id IS NOT NULL AND product_variant_id IS NULL) OR
  (product_id IS NULL AND product_variant_id IS NOT NULL)
);
