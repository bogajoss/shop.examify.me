-- Migration: Add offer_expires_at to batches table
-- Date: 2026-02-16

ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS offer_expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_batches_offer_expires ON batches(offer_expires_at);
