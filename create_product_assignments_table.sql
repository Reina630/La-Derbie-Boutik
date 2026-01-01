-- Create a table to store product assignments (one admin per product)
CREATE TABLE IF NOT EXISTS product_assignments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Unique constraint to allow only one assignment per product
ALTER TABLE IF EXISTS product_assignments ADD CONSTRAINT unique_product_assignment UNIQUE (product_id);

-- Optionally create function to update updated_at on change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON product_assignments;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON product_assignments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
