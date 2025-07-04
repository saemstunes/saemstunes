
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Music, Users, Heart, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PlaylistCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated: (playlist: any) => void;
}

const PlaylistCreationModal: React.FC<PlaylistCreationModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'covers' | 'originals_by_saems_tunes' | 'personal_playlist'>('personal_playlist');
  const [isPublic, setIsPublic] = useState(false);
  const [coverArtUrl, setCoverArtUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `playlist-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setCoverArtUrl(data.publicUrl);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload cover art",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!name.trim() || !user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          category,
          cover_art_url: coverArtUrl || null,
          is_public: isPublic,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      onPlaylistCreated(data);
      toast({
        title: "Playlist created",
        description: `${name} has been created successfully`
      });
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Failed to create playlist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('personal_playlist');
    setIsPublic(false);
    setCoverArtUrl('');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'covers': return <Music className="h-4 w-4" />;
      case 'originals_by_saems_tunes': return <Heart className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-xl shadow-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold">Create Playlist</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Cover Art */}
              <div className="flex flex-col items-center space-y-3">
                <div 
                  className="w-32 h-32 border-2 border-dashed border-gold/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-gold/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {coverArtUrl ? (
                    <img src={coverArtUrl} alt="Cover" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Add Cover</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="bg-muted/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your playlist"
                  className="bg-muted/50 resize-none"
                  rows={3}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal_playlist">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon('personal_playlist')}
                        Personal Playlist
                      </div>
                    </SelectItem>
                    <SelectItem value="covers">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon('covers')}
                        Covers
                      </div>
                    </SelectItem>
                    <SelectItem value="originals_by_saems_tunes">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon('originals_by_saems_tunes')}
                        Saem's Originals
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Make Public</label>
                  <p className="text-xs text-muted-foreground">Others can discover this playlist</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePlaylist} 
                disabled={!name.trim() || isLoading}
                className="flex-1 bg-gold hover:bg-gold-dark"
              >
                {isLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaylistCreationModal;
