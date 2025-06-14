
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import QuizSelection from '@/components/quiz/QuizSelection';

const QuizzesPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Music Quizzes</h1>
        <QuizSelection />
      </div>
    </MainLayout>
  );
};

export default QuizzesPage;
