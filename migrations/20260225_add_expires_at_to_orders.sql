-- Migration: Add expires_at to orders
-- Date: 2026-02-25

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;

CREATE INDEX IF NOT EXISTS idx_orders_expires_at ON orders(expires_at);
