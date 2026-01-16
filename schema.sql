-- Database Schema Tracking (PostgreSQL Format)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  uid UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  userId TEXT UNIQUE NOT NULL, -- Appwrite Auth ID reference
  name TEXT,
  roll TEXT UNIQUE NOT NULL,
  phone TEXT,
  enrolled_batches UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: In Appwrite, this corresponds to:
-- Collection: users
-- Attributes:
--   userId: string (required)
--   name: string
--   roll: string (required, unique)
--   phone: string
--   enrolled_batches: string array (default [])
--   created_at: string (ISO)
--   updated_at: string (ISO)

