
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Page Not Found - Saem's Tunes</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Helmet>
      
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate('/')} className="w-full">
                Go Home
              </Button>
              <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default NotFoundPage;
