-- Make min_for_free_delivery in delivery_areas nullable
ALTER TABLE delivery_areas ALTER COLUMN min_for_free_delivery DROP NOT NULL;

-- Add new settings for custom messages, safe to re-run
INSERT INTO app_settings (key, value) VALUES ('delivery_message', '') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_settings (key, value) VALUES ('pickup_message', '') ON CONFLICT (key) DO NOTHING;
