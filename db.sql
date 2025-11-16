CREATE TABLE public.customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(8) NOT NULL,
    town VARCHAR(255),
    address_home VARCHAR(255),
    address_road VARCHAR(255),
    address_block VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT phone_number_length CHECK (char_length(phone_number) = 8)
);
