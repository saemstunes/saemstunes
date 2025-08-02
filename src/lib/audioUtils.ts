// Audio utilities for handling primary and alternate audio paths
const SUPABASE_URL = "https://uxyvhqtwkutstihtxdsv.supabase.co";

interface TrackWithAudio {
  audio_path?: string | null;
  alternate_audio_path?: string | null;
}

export const getAudioUrl = (track: TrackWithAudio): string | null => {
  if (!track) return null;

  // Helper to generate full URL
  const makeUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');
    return `${SUPABASE_URL}/storage/v1/object/public/tracks/${encodedPath}`;
  };
  
  // Try primary path first
  if (track.audio_path) return makeUrl(track.audio_path);
  
  // Fallback to alternate path
  if (track.alternate_audio_path) return makeUrl(track.alternate_audio_path);
  
  // Final fallback
  return null;
};

export const getStorageUrl = (path: string | null | undefined, bucket = 'tracks'): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Handle special characters in paths
  const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodedPath}`;
};