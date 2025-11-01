-- Add support for video URLs and social media platforms
-- Run this SQL in your Supabase SQL editor

-- Add new columns for video URL support
ALTER TABLE photos ADD COLUMN IF NOT EXISTS media_type VARCHAR(10) DEFAULT 'image';
ALTER TABLE photos ADD COLUMN IF NOT EXISTS platform VARCHAR(50);
ALTER TABLE photos ADD COLUMN IF NOT EXISTS video_id VARCHAR(255);

-- Update existing records to have default values
UPDATE photos SET media_type = 'image' WHERE media_type IS NULL;
UPDATE photos SET platform = 'direct_upload' WHERE platform IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_photos_platform ON photos(platform);
CREATE INDEX IF NOT EXISTS idx_photos_video_id ON photos(video_id);

-- Add comments for documentation
COMMENT ON COLUMN photos.platform IS 'Social media platform: youtube, tiktok, instagram, facebook, direct_upload, file_upload';
COMMENT ON COLUMN photos.video_id IS 'Platform-specific video ID for embedding';

-- Example query to see the updated structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'photos' 
-- ORDER BY ordinal_position;
