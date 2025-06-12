
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';

const ArtistsPage = () => {
  return (
    <>
      <Helmet>
        <title>Artists - Saem's Tunes</title>
        <meta name="description" content="Discover music artists" />
      </Helmet>
      
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Artists</h1>
            <p className="text-muted-foreground">Discover talented artists and their music.</p>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ArtistsPage;
