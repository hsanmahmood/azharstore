-- SQL Script to Remove Delivery Dashboard from Database
-- Run this in your Supabase SQL Editor

-- Drop system_settings table (used only for delivery password)
DROP TABLE IF EXISTS system_settings CASCADE;

-- Note: We're keeping all other tables as they're used by the main application
-- The following tables are NOT affected:
-- - products
-- - categories
-- - customers
-- - orders
-- - order_items
-- - product_images
-- - product_variants
-- - delivery_areas (still used for storefront checkout)
-- - app_settings
-- - translations
