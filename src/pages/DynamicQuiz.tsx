
import React from 'react';
import { useParams } from 'react-router-dom';
import DynamicMusicQuiz from '@/components/quiz/DynamicMusicQuiz';
import MainLayout from '@/components/layout/MainLayout';

const DynamicQuizPage = () => {
  const { quizId } = useParams();

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <DynamicMusicQuiz quizId={quizId} />
      </div>
    </MainLayout>
  );
};

export default DynamicQuizPage;
