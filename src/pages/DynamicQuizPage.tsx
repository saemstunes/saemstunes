
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DynamicMusicQuiz from '@/components/quiz/DynamicMusicQuiz';

const DynamicQuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Dynamic Quiz</h1>
          <DynamicMusicQuiz quizId={quizId || ''} />
        </div>
      </div>
    </MainLayout>
  );
};

export default DynamicQuizPage;
