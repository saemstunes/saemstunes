
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuizSelection } from '@/components/quiz/QuizSelection';
import { DynamicMusicQuiz } from '@/components/quiz/DynamicMusicQuiz';
import { MusicQuiz } from '@/components/quiz/MusicQuiz';

const MusicQuizPage = () => {
  const { quizId } = useParams();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {quizId ? (
          <DynamicMusicQuiz quizId={quizId} />
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Music Quizzes
              </h1>
              <p className="text-muted-foreground">
                Test your musical knowledge with our interactive quizzes
              </p>
            </div>
            <QuizSelection />
            <div className="mt-8">
              <MusicQuiz />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MusicQuizPage;
