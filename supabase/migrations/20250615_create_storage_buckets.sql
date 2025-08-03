
-- Create storage buckets for tracks
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('tracks', 'tracks', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/aac', 'image/jpeg', 'image/png', 'image/jpg']),
  ('covers', 'covers', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg'])
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for tracks bucket
CREATE POLICY "Allow public read access on tracks" ON storage.objects
FOR SELECT USING (bucket_id = 'tracks');

CREATE POLICY "Allow authenticated users to upload tracks" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'tracks' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own tracks" ON storage.objects
FOR UPDATE USING (bucket_id = 'tracks' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own tracks" ON storage.objects
FOR DELETE USING (bucket_id = 'tracks' AND auth.uid() = owner);

-- Create RLS policies for covers bucket
CREATE POLICY "Allow public read access on covers" ON storage.objects
FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Allow authenticated users to upload covers" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own covers" ON storage.objects
FOR UPDATE USING (bucket_id = 'covers' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own covers" ON storage.objects
FOR DELETE USING (bucket_id = 'covers' AND auth.uid() = owner);
