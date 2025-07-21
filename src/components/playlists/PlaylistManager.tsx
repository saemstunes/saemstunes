
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlaylistCreationModal from './PlaylistCreationModal';
import PlaylistGrid from './PlaylistGrid';
import { useAuth } from '@/context/AuthContext';

const PlaylistManager: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();

  const handlePlaylistCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePlaylistSelect = (playlist: any) => {
    // Navigate to playlist detail view
    console.log('Selected playlist:', playlist);
  };

  const handlePlaylistEdit = (playlist: any) => {
    // Open edit modal
    console.log('Edit playlist:', playlist);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium mb-2">Sign in required</h3>
          <p className="text-muted-foreground mb-4">
            Please sign in to create and manage your playlists
          </p>
          <Button className="bg-gold hover:bg-gold-dark">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">My Playlists</h1>
          <p className="text-muted-foreground">Create and manage your music collections</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gold hover:bg-gold-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Playlist
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="covers">Covers</TabsTrigger>
          <TabsTrigger value="originals">Originals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <PlaylistGrid
            onPlaylistSelect={handlePlaylistSelect}
            onPlaylistEdit={handlePlaylistEdit}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>
        
        <TabsContent value="personal" className="mt-6">
          <PlaylistGrid
            onPlaylistSelect={handlePlaylistSelect}
            onPlaylistEdit={handlePlaylistEdit}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>
        
        <TabsContent value="covers" className="mt-6">
          <PlaylistGrid
            onPlaylistSelect={handlePlaylistSelect}
            onPlaylistEdit={handlePlaylistEdit}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>
        
        <TabsContent value="originals" className="mt-6">
          <PlaylistGrid
            onPlaylistSelect={handlePlaylistSelect}
            onPlaylistEdit={handlePlaylistEdit}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>
      </Tabs>

      {/* Creation Modal */}
      <PlaylistCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPlaylistCreated={handlePlaylistCreated}
      />
    </div>
  );
};

export default PlaylistManager;
