import { supabase } from "@/integrations/supabase/client";

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // For external URLs (Imgur)
  return supabase.storage.from('tracks').getPublicUrl(path).data.publicUrl; // For Supabase paths
};
