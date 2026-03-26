-- Add LINE ID to customers for LINE messaging
ALTER TABLE customers ADD COLUMN line_id varchar(255);

-- Add messaging credentials to shops table
ALTER TABLE shops ADD COLUMN twilio_account_sid varchar(100);
ALTER TABLE shops ADD COLUMN twilio_auth_token varchar(255);
ALTER TABLE shops ADD COLUMN twilio_phone_number varchar(20);
ALTER TABLE shops ADD COLUMN twilio_whatsapp_from varchar(20);
ALTER TABLE shops ADD COLUMN line_channel_access_token varchar(500);
ALTER TABLE shops ADD COLUMN line_user_id varchar(255);

-- Create index for faster LINE lookups
CREATE INDEX idx_customers_line_id ON customers(line_id) WHERE line_id IS NOT NULL;
