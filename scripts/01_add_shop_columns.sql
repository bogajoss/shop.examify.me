-- Migration: Add Shop columns to batches table
-- Date: 2026-01-17

ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS old_price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]';

-- Add index for filtering by category
CREATE INDEX IF NOT EXISTS idx_batches_category ON batches(category);
