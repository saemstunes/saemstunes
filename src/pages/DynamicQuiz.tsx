
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DynamicMusicQuiz from '@/components/quiz/DynamicMusicQuiz';
import { Helmet } from 'react-helmet';

const DynamicQuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`Quiz completed with score: ${score}/${total}`);
  };

  return (
    <>
      <Helmet>
        <title>Dynamic Quiz - Saem's Tunes</title>
        <meta name="description" content="Take a dynamic music quiz" />
      </Helmet>
      
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {quizId ? (
              <DynamicMusicQuiz 
                quizId={quizId} 
                onComplete={handleQuizComplete}
              />
            ) : (
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
                <p>Please select a valid quiz.</p>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default DynamicQuizPage;
