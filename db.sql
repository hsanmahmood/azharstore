-- Insert the default delivery password into the system_settings table
INSERT INTO system_settings (key, value)
VALUES ('delivery_password', '$2b$12$mtxBFNVWho4EdtLr0fZQqe2./Y5zFFTt.LlkQnQfxo6.qOFdyThci')
ON CONFLICT (key) DO UPDATE SET value = '$2b$12$mtxBFNVWho4EdtLr0fZQqe2./Y5zFFTt.LlkQnQfxo6.qOFdyThci';
