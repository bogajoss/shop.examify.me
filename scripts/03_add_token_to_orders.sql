-- Migration: Add assigned_token to orders
-- Date: 2026-01-17

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS assigned_token varchar(50);
