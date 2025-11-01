-- Photos table for gallery management
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    thumbnail TEXT,
    caption TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('before', 'after', 'process')),
    customer_name TEXT,
    location TEXT,
    is_public BOOLEAN DEFAULT true,
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for photos (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS (Row Level Security) policies
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Allow public read access to public photos
CREATE POLICY "Public photos are viewable by everyone" ON photos
    FOR SELECT USING (is_public = true);

-- Allow admin users to do everything (you'll need to adjust this based on your auth setup)
CREATE POLICY "Admins can manage all photos" ON photos
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS photos_is_public_idx ON photos(is_public);
CREATE INDEX IF NOT EXISTS photos_type_idx ON photos(type);

-- Storage policies for photos bucket
CREATE POLICY "Anyone can view photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Admins can upload photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Admins can delete photos" ON storage.objects
    FOR DELETE USING (bucket_id = 'photos');

-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_photos_updated_at 
    BEFORE UPDATE ON photos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
