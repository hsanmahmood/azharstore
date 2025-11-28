-- Make min_for_free_delivery in delivery_areas nullable
ALTER TABLE delivery_areas ALTER COLUMN min_for_free_delivery DROP NOT NULL;

-- Add new settings for custom messages, safe to re-run
INSERT INTO app_settings (key, value) VALUES ('delivery_message', '') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_settings (key, value) VALUES ('pickup_message', '') ON CONFLICT (key) DO NOTHING;

-- Create translations table
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    lang VARCHAR(10) NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE (lang, key)
);
