-- Fix 1: Add missing approved column to video_content table
ALTER TABLE public.video_content 
ADD COLUMN IF NOT EXISTS approved boolean DEFAULT true;

-- Fix 2: Update video_content records to have approved = true
UPDATE public.video_content 
SET approved = true 
WHERE approved IS NULL;

-- Fix 3: Ensure proper user creation flow with consolidated trigger
-- Drop existing conflicting trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create or replace the unified user creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, role, subscription_tier)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user'),
    'free'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role;

  -- Insert into user_roles table with proper enum mapping
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN (NEW.raw_user_meta_data ->> 'role') = 'tutor' THEN 'tutor'::app_role
      WHEN (NEW.raw_user_meta_data ->> 'role') = 'admin' THEN 'admin'::app_role
      ELSE 'user'::app_role
    END
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create the trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix 4: Ensure proper RLS policies for profiles table
-- Drop existing conflicting policies and recreate them properly
DROP POLICY IF EXISTS "Allow insert for authenticated users on profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- Create a single, clear insert policy for profiles
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);