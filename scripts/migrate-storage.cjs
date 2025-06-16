require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrateFiles() {
  // 1. Fetch all tracks from database
  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('id, audio_path, cover_path, user_id');

  if (error) throw error;

  for (const track of tracks) {
    if (!track.user_id) continue;

    // 2. Process audio file
    if (track.audio_path) {
      const newAudioPath = await moveFile(
        track.audio_path,
        track.user_id,
        'audio'
      );
      
      // Update database record
      await supabase
        .from('tracks')
        .update({ audio_path: newAudioPath })
        .eq('id', track.id);
    }

    // 3. Process cover file
    if (track.cover_path) {
      const newCoverPath = await moveFile(
        track.cover_path,
        track.user_id,
        'cover'
      );
      
      // Update database record
      await supabase
        .from('tracks')
        .update({ cover_path: newCoverPath })
        .eq('id', track.id);
    }
  }
}

async function moveFile(oldPath, userId, fileType) {
  // Extract filename from path
  const filename = oldPath.split('/').pop();
  const newPath = `${userId}/${fileType}-${filename}`;

  try {
    // 4. Copy file to new location
    const { data: copyData, error: copyError } = await supabase.storage
      .from('tracks')
      .copy(oldPath, newPath);

    if (copyError) throw copyError;

    // 5. Delete original file
    const { error: deleteError } = await supabase.storage
      .from('tracks')
      .remove([oldPath]);

    return newPath;
  } catch (error) {
    console.error(`Error moving ${oldPath}:`, error);
    return oldPath; // Return original path on failure
  }
}

migrateFiles().then(() => console.log('Migration complete!'));
