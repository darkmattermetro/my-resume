-- Add banner_url column to profile table (if not exists)
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS banner_url text;
