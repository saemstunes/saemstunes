
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MusicQuiz from '@/components/quiz/MusicQuiz';

const MusicQuizPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Music Quiz</h1>
        <MusicQuiz />
      </div>
    </MainLayout>
  );
};

export default MusicQuizPage;
