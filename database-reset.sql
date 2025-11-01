-- DATABASE RESET SCRIPT
-- Run this SQL in your Supabase SQL editor to clean up test data
-- This will remove all photos and reset the database to a clean state

-- Delete all photos from the database
DELETE FROM photos;

-- Reset the sequence (if using auto-increment IDs)
-- Note: Supabase uses UUIDs by default, so this may not be necessary
-- ALTER SEQUENCE photos_id_seq RESTART WITH 1;

-- Verify the table is empty
SELECT COUNT(*) as remaining_photos FROM photos;

-- Show the current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;

-- Note: This will also clean up any file uploads in Supabase Storage
-- You may want to manually delete files from the storage bucket as well
-- Go to: Supabase Dashboard > Storage > photos bucket > Delete all files
