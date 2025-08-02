-- Add alternate_audio_path column to tracks table
ALTER TABLE public.tracks
ADD COLUMN alternate_audio_path text;

-- Update Pale Ulipo track with alternate path
UPDATE public.tracks
SET alternate_audio_path = 'Tracks/Cover_Tracks/Pale Ulipo cover.m4a'
WHERE title = 'Pale Ulipo';