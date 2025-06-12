
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MusicQuiz from '@/components/quiz/MusicQuiz';
import { Helmet } from 'react-helmet';

const MusicQuizPage = () => {
  return (
    <>
      <Helmet>
        <title>Music Quiz - Saem's Tunes</title>
        <meta name="description" content="Test your music knowledge with our interactive quiz" />
      </Helmet>
      
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Music Knowledge Quiz</h1>
            <MusicQuiz />
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default MusicQuizPage;
