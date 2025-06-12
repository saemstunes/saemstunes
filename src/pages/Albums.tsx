
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';

const AlbumsPage = () => {
  return (
    <>
      <Helmet>
        <title>Albums - Saem's Tunes</title>
        <meta name="description" content="Browse music albums" />
      </Helmet>
      
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Albums</h1>
            <p className="text-muted-foreground">Browse our collection of albums.</p>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default AlbumsPage;
