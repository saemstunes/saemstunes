// src/components/artists/ArtistMetadataManager.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ArtistMetadataForm {
  name: string;
  bio: string;
  genre: string;
  location: string;
  profileImage: File | null;
}

export const ArtistMetadataManager = ({ trackId }: { trackId: string }) => {
  const [form, setForm] = useState<ArtistMetadataForm>({
    name: '',
    bio: '',
    genre: '',
    location: '',
    profileImage: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Upload image if exists
      let imageUrl = '';
      if (form.profileImage) {
        const fileName = `artists/${Date.now()}-${form.profileImage.name}`;
        const { error } = await supabase.storage
          .from('artist-images')
          .upload(fileName, form.profileImage);
        
        if (error) throw error;
        imageUrl = supabase.storage.from('artist-images').getPublicUrl(fileName).data.publicUrl;
      }

      // Create metadata submission
      const { error } = await supabase.from('artist_metadata_submissions').insert({
        track_id: trackId,
        name: form.name,
        bio: form.bio,
        genre: form.genre,
        location: form.location,
        profile_image_url: imageUrl,
        status: 'pending'
      });

      if (error) throw error;
      
      toast({
        title: "Submission Sent!",
        description: "Your artist metadata update is under review",
      });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Couldn't submit artist metadata",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-3">Update Artist Info</h3>
      
      <Input 
        placeholder="Artist Name" 
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
        className="mb-2"
      />
      
      <Textarea
        placeholder="Bio"
        value={form.bio}
        onChange={(e) => setForm({...form, bio: e.target.value})}
        className="mb-2"
      />
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Input 
          placeholder="Genre" 
          value={form.genre}
          onChange={(e) => setForm({...form, genre: e.target.value})}
        />
        <Input 
          placeholder="Location" 
          value={form.location}
          onChange={(e) => setForm({...form, location: e.target.value})}
        />
      </div>
      
      <input 
        type="file"
        accept="image/*"
        onChange={(e) => setForm({...form, profileImage: e.target.files?.[0] || null})}
        className="mb-3"
      />
      
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Suggest Update"}
      </Button>
    </div>
  );
};
