-- Create service_areas table in Supabase
CREATE TABLE IF NOT EXISTS service_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  postcode TEXT UNIQUE NOT NULL,
  postcode_prefix TEXT NOT NULL, 
  area_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on service_areas" ON service_areas 
FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_areas_postcode ON service_areas(postcode);
CREATE INDEX IF NOT EXISTS idx_service_areas_prefix ON service_areas(postcode_prefix);
CREATE INDEX IF NOT EXISTS idx_service_areas_active ON service_areas(is_active);

-- Add some sample postcodes (you can modify these)
INSERT INTO service_areas (postcode, postcode_prefix, area_name) VALUES
('M1', 'M1', 'Manchester City Centre'),
('M2', 'M2', 'Manchester City Centre'),
('M3', 'M3', 'Manchester City Centre'),
('OL1', 'OL', 'Oldham'),
('OL2', 'OL', 'Oldham'),
('SK1', 'SK', 'Stockport'),
('WA1', 'WA', 'Warrington')
ON CONFLICT (postcode) DO NOTHING;
