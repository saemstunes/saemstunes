
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DynamicMusicQuiz from '@/components/quiz/DynamicMusicQuiz';

const DynamicQuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();

  if (!quizId) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-serif font-bold mb-8">Quiz Not Found</h1>
          <p className="text-muted-foreground">The quiz you're looking for could not be found.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <DynamicMusicQuiz quizId={quizId} />
      </div>
    </MainLayout>
  );
};

export default DynamicQuizPage;
