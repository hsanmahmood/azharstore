-- Set database timezone to GMT+3 (Arabia Standard Time)
ALTER DATABASE postgres SET timezone TO 'Asia/Riyadh';

-- Ensure orders table created_at column uses timestamptz (timestamp with timezone)
-- If the column already exists as timestamp without timezone, this will convert it
ALTER TABLE orders 
ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';

-- Set default value to use current timestamp in GMT+3
ALTER TABLE orders 
ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Riyadh');

-- Note: All existing timestamps will be interpreted as UTC and converted to GMT+3
-- New orders will automatically use GMT+3 timezone
