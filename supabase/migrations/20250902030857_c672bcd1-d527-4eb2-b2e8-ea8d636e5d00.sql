-- Add RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Add missing RLS policies for unprotected tables

-- Fix access_tiers table
ALTER TABLE public.access_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view access tiers"
ON public.access_tiers
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage access tiers"
ON public.access_tiers
FOR ALL
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Fix media_files table
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view media files"
ON public.media_files
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upload media"
ON public.media_files
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage all media files"
ON public.media_files
FOR ALL
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Fix missing_artist_requests table
ALTER TABLE public.missing_artist_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view missing artist requests"
ON public.missing_artist_requests
FOR SELECT
USING (public.is_current_user_admin());

CREATE POLICY "Anyone can create missing artist requests"
ON public.missing_artist_requests
FOR INSERT
WITH CHECK (true);

-- Update existing admin function to use new role system
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT public.has_role(user_id, 'admin'::public.app_role);
$$;

-- Create trigger to automatically assign 'user' role to new signups
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();