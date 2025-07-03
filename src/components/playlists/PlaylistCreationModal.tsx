import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface PlaylistCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PlaylistCreationModal: React.FC<PlaylistCreationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'personal_playlist' as 'covers' | 'originals_by_saems_tunes' | 'personal_playlist',
    isPublic: false
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadCoverArt = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(`playlist-covers/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('tracks')
        .getPublicUrl(`playlist-covers/${fileName}`);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading cover art:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Playlist name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let coverArtUrl = null;
      
      if (coverFile) {
        coverArtUrl = await uploadCoverArt(coverFile);
      }

      const { error } = await supabase.from('playlists').insert({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        user_id: user.id,
        is_public: formData.isPublic,
        cover_art_url: coverArtUrl,
        play_count: 0,
        total_duration: 0
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Playlist created successfully!",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'personal_playlist',
        isPublic: false
      });
      setCoverFile(null);
      setPreviewUrl('');
      
      onSuccess();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Art Upload */}
          <div>
            <Label htmlFor="cover-upload">Cover Art (Optional)</Label>
            <div className="mt-2">
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="cover-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Image className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload cover art</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Playlist Name */}
          <div>
            <Label htmlFor="name">Playlist Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter playlist name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your playlist..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: 'covers' | 'originals_by_saems_tunes' | 'personal_playlist') =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal_playlist">Personal Playlist</SelectItem>
                <SelectItem value="covers">Covers</SelectItem>
                <SelectItem value="originals_by_saems_tunes">Saem's Originals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public">Make Public</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to discover and listen to this playlist
              </p>
            </div>
            <Switch
              id="public"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim()}
              className="flex-1 bg-gold hover:bg-gold-dark text-white"
            >
              {loading ? "Creating..." : "Create Playlist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistCreationModal;