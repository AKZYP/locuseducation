-- Supabase Schema for Methods Free
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  topic TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'Unit 1',
  subject TEXT NOT NULL DEFAULT 'Methods',
  description TEXT,
  date_added DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'Unit 1',
  subject TEXT NOT NULL DEFAULT 'Methods',
  date_added DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Livestreams table (only one active at a time)
CREATE TABLE IF NOT EXISTS livestreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  youtube_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestreams ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Allow public read access to videos" ON videos;
DROP POLICY IF EXISTS "Allow public read access to resources" ON resources;
DROP POLICY IF EXISTS "Allow public read access to livestreams" ON livestreams;
DROP POLICY IF EXISTS "Allow authenticated insert to videos" ON videos;
DROP POLICY IF EXISTS "Allow authenticated delete from videos" ON videos;
DROP POLICY IF EXISTS "Allow authenticated insert to resources" ON resources;
DROP POLICY IF EXISTS "Allow authenticated delete from resources" ON resources;
DROP POLICY IF EXISTS "Allow authenticated insert to livestreams" ON livestreams;
DROP POLICY IF EXISTS "Allow authenticated delete from livestreams" ON livestreams;

-- Create policies for public read access
CREATE POLICY "Allow public read access to videos" ON videos
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read access to resources" ON resources
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read access to livestreams" ON livestreams
  FOR SELECT TO anon USING (true);

-- Create policies for authenticated admin write access
-- Note: Admin email check should be done in application layer
CREATE POLICY "Allow authenticated insert to videos" ON videos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated delete from videos" ON videos
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert to resources" ON resources
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated delete from resources" ON resources
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert to livestreams" ON livestreams
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated delete from livestreams" ON livestreams
  FOR DELETE TO authenticated USING (true);
