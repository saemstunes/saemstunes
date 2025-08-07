-- Fix the foreign key constraint by first seeding access_tiers
INSERT INTO public.access_tiers (name, priority, max_quality, download_limit, features, price_monthly)
VALUES
  ('Free', 1, 'low', 50, '{"streams_per_day": 25}'::jsonb, 0),
  ('Premium', 2, 'high', 200, '{"streams_per_day": 100}'::jsonb, 4.99),
  ('Pro', 3, 'lossless', 1000, '{"streams_per_day": 500}'::jsonb, 9.99)
ON CONFLICT (name) DO NOTHING;

-- Now add the foreign key column
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='profiles' AND column_name='access_tier_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN access_tier_id integer DEFAULT 1;
    -- Add the foreign key constraint after the column exists
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_access_tier_id_fkey
      FOREIGN KEY (access_tier_id) REFERENCES public.access_tiers(id);
  END IF;
END $$;