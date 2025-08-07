-- Enable RLS and add policies/columns for media_files, access_tiers, missing_artist_requests
-- Also create media_access_logs table and add access_tier_id to profiles

-- 1) media_files hardening
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Add commonly used columns if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='media_files' AND column_name='updated_at'
  ) THEN
    ALTER TABLE public.media_files ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='media_files' AND column_name='orphan_check'
  ) THEN
    ALTER TABLE public.media_files ADD COLUMN orphan_check boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Ensure updated_at trigger
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_media_files_updated_at'
  ) THEN
    CREATE TRIGGER update_media_files_updated_at
    BEFORE UPDATE ON public.media_files
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Policies for media_files
DROP POLICY IF EXISTS "Tier-based media access" ON public.media_files;
CREATE POLICY "Tier-based media access"
  ON public.media_files
  FOR SELECT
  USING (
    CASE
      WHEN auth.role() = 'anon' THEN access_tier_id <= 1
      ELSE access_tier_id <= COALESCE((SELECT access_tier_id FROM public.profiles WHERE id = auth.uid()), 1)
    END
  );

DROP POLICY IF EXISTS "Admins can insert media files" ON public.media_files;
CREATE POLICY "Admins can insert media files"
  ON public.media_files
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can update media files" ON public.media_files;
CREATE POLICY "Admins can update media files"
  ON public.media_files
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can delete media files" ON public.media_files;
CREATE POLICY "Admins can delete media files"
  ON public.media_files
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- 2) access_tiers RLS
ALTER TABLE public.access_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Access tiers are viewable by everyone" ON public.access_tiers;
CREATE POLICY "Access tiers are viewable by everyone"
  ON public.access_tiers
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage access tiers" ON public.access_tiers;
CREATE POLICY "Admins manage access tiers"
  ON public.access_tiers
  FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Seed basic tiers (id values are auto-assigned; match by unique name)
INSERT INTO public.access_tiers (name, priority, max_quality, download_limit, features, price_monthly)
VALUES
  ('Free', 1, 'low', 50, '{"streams_per_day": 25}'::jsonb, 0),
  ('Premium', 2, 'high', 200, '{"streams_per_day": 100}'::jsonb, 4.99),
  ('Pro', 3, 'lossless', 1000, '{"streams_per_day": 500}'::jsonb, 9.99)
ON CONFLICT (name) DO UPDATE
SET priority = EXCLUDED.priority,
    max_quality = EXCLUDED.max_quality,
    download_limit = EXCLUDED.download_limit,
    features = EXCLUDED.features,
    price_monthly = EXCLUDED.price_monthly;

-- 3) Add access_tier_id to profiles if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='profiles' AND column_name='access_tier_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN access_tier_id integer REFERENCES public.access_tiers(id) DEFAULT 1;
  END IF;
END $$;

-- 4) missing_artist_requests RLS
ALTER TABLE public.missing_artist_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can report missing artist" ON public.missing_artist_requests;
CREATE POLICY "Anyone can report missing artist"
  ON public.missing_artist_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view missing artist reports" ON public.missing_artist_requests;
CREATE POLICY "Admins can view missing artist reports"
  ON public.missing_artist_requests
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- 5) media_access_logs table and RLS
CREATE TABLE IF NOT EXISTS public.media_access_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  file_id uuid NULL REFERENCES public.media_files(id) ON DELETE SET NULL,
  accessed_at timestamptz NOT NULL DEFAULT now(),
  action text NOT NULL CHECK (action IN ('play','download','view')) DEFAULT 'view',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.media_access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own media access logs" ON public.media_access_logs;
CREATE POLICY "Users can view their own media access logs"
  ON public.media_access_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all media access logs" ON public.media_access_logs;
CREATE POLICY "Admins can view all media access logs"
  ON public.media_access_logs
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Users can insert their own media access logs" ON public.media_access_logs;
CREATE POLICY "Users can insert their own media access logs"
  ON public.media_access_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Note: Edge functions using service role bypass RLS for inserts if needed.
