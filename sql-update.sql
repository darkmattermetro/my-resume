-- Add new columns to profile table for stats and features
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS stat_years text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS stat_projects text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS stat_success text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS feature1_title text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS feature1_desc text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS feature2_title text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS feature2_desc text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS feature3_title text;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS feature3_desc text;
