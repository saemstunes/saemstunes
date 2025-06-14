
import React from 'react';
import { useParams } from 'react-router-dom';
import MusicQuiz from '@/components/quiz/MusicQuiz';
import MainLayout from '@/components/layout/MainLayout';

const MusicQuizPage = () => {
  const { quizId } = useParams();

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <MusicQuiz />
      </div>
    </MainLayout>
  );
};

export default MusicQuizPage;
