
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pageTransition } from '@/lib/animation-utils';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistManager from '@/components/playlists/PlaylistManager';
import CourseCatalog from '@/components/courses/CourseCatalog';
import { BookOpen, Music, Video, Users } from 'lucide-react';

const Library = () => {
  const [activeTab, setActiveTab] = useState('playlists');

  const tabs = [
    {
      id: 'playlists',
      label: 'Playlists',
      icon: Music,
      component: PlaylistManager
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      component: CourseCatalog
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: Video,
      component: () => <div className="text-center py-12">Videos coming soon...</div>
    },
    {
      id: 'artists',
      label: 'Artists',
      icon: Users,
      component: () => <div className="text-center py-12">Artists coming soon...</div>
    }
  ];

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        {...pageTransition}
      >
        <div>
          <h1 className="text-3xl font-serif font-bold">Your Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage your playlists, courses, and saved content
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default Library;
