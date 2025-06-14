
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

const Albums = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <Music className="h-8 w-8 text-gold" />
          <div>
            <h1 className="text-3xl font-bold">Albums</h1>
            <p className="text-muted-foreground">Discover and explore music albums</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Album collection feature is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We're working on bringing you an amazing album browsing experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Albums;
