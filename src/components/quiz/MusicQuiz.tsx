import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Confetti } from '@/components/ui/confetti';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface DatabaseQuiz {
  id: string;
  created_at: string;
  created_by: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  access_level: 'free' | 'basic' | 'premium' | 'private';
  questions: Question[];
  updated_at: string;
}

interface MusicQuizProps {
  quizId: string;
  onComplete: (score: number, total: number, quizId: string) => void;
}

const MusicQuiz: React.FC<MusicQuizProps> = ({ quizId, onComplete }) => {
  const [quizzes, setQuizzes] = useState<DatabaseQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<DatabaseQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    category: 'all',
    access: 'all'
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      
      const allowedAccessLevels: ("free" | "basic" | "premium" | "private")[] = 
        user?.subscriptionTier === 'premium' 
          ? ['free', 'basic', 'premium'] 
          : user?.subscriptionTier === 'basic'
          ? ['free', 'basic']
          : ['free'];

      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .in('access_level', allowedAccessLevels)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion with validation for the questions field
      const typedQuizzes = (data || []).map(quiz => ({
        ...quiz,
        questions: Array.isArray(quiz.questions) ? quiz.questions as Question[] : []
      })) as DatabaseQuiz[];

      setQuizzes(typedQuizzes);
      
      if (quizId) {
        const targetQuiz = typedQuizzes.find(q => q.id === quizId);
        if (targetQuiz) {
          setSelectedQuiz(targetQuiz);
        }
      }
    } catch (error: any) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answerIndex });
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;

    let correctAnswersCount = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswersCount++;
      }
    });

    setScore(correctAnswersCount);
    setShowResults(true);
    onComplete(correctAnswersCount, selectedQuiz.questions.length, selectedQuiz.id);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, selectedQuiz?.questions.length ? selectedQuiz.questions.length - 1 : 0));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return <div className="text-center">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!selectedQuiz) {
    return <div className="text-center">No quiz selected.</div>;
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">{selectedQuiz.title}</h2>
      <Progress value={progress} className="mb-4" />
      <p className="text-muted-foreground text-sm mb-4">
        Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
      </p>

      {currentQuestion && (
        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <p className="mb-4 font-medium">{currentQuestion.text}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswers[currentQuestionIndex] === index ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === selectedQuiz.questions.length - 1}
        >
          Next
        </Button>
      </div>

      <div className="mt-6">
        {showResults ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">View Results</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Quiz Results</AlertDialogTitle>
                <AlertDialogDescription>
                  You scored {score} out of {selectedQuiz.questions.length} correct answers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleRetryQuiz}>Retry</AlertDialogCancel>
                <AlertDialogAction onClick={() => {}}>OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button onClick={handleSubmitQuiz} disabled={Object.keys(selectedAnswers).length !== selectedQuiz.questions.length}>
            Submit Quiz
          </Button>
        )}
      </div>
      {showResults && <Confetti />}
    </div>
  );
};

export default MusicQuiz;
