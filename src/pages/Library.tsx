import React, { useState, useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock, Music2, Search, BookOpenCheck, BookOpen, GraduationCap, ListChecks } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

// Define types for quizzes and questions
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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

const DynamicMusicQuiz: React.FC<MusicQuizProps> = ({ quizId, onComplete }) => {
  const [quizzes, setQuizzes] = useState<DatabaseQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<DatabaseQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers: any] = useState<{ [key: number]: number }>({});
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

  const handleQuizComplete = (score: number, total: number, quizId: string) => {
    console.log(`Quiz ${quizId} completed with score: ${score}/${total}`);
    setShowResults(false);
    setSelectedQuiz(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setScore(0);
    fetchQuizzes();
  };

  if (loading) {
    return <div className="text-center">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!selectedQuiz) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Quizzes</h2>
        {quizzes.length === 0 ? (
          <p>No quizzes available at the moment.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <li key={quiz.id} className="bg-card rounded-lg shadow-md p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedQuiz(quiz)}>
                <h3 className="font-medium text-lg">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{selectedQuiz.title}</h2>
      <p className="text-muted-foreground">{selectedQuiz.description}</p>

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="text-xl font-medium mb-2">Question {currentQuestionIndex + 1}/{selectedQuiz.questions.length}</h3>
        <p>{currentQuestion.text}</p>

        <div className="mt-4 space-y-2">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-3">
              <input
                type="radio"
                className="radio-sm"
                name={`question-${currentQuestionIndex}`}
                value={index}
                checked={selectedAnswers[currentQuestionIndex] === index}
                onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz} disabled={Object.keys(selectedAnswers).length < selectedQuiz.questions.length}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>Next</Button>
        )}
      </div>

      {showResults && selectedQuiz && (
        <div className="bg-green-100 border border-green-500 text-green-900 px-4 py-3 rounded-md">
          <h4 className="font-semibold">Quiz Results</h4>
          <p>You scored {score} out of {selectedQuiz.questions.length} correct answers!</p>
          <Button onClick={() => handleQuizComplete(score, selectedQuiz.questions.length, selectedQuiz.id)}>
            Close Results
          </Button>
        </div>
      )}
    </div>
  );
};

const Library = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<DatabaseQuiz | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
          <p className="text-muted-foreground">Please log in to access your library.</p>
          <Button onClick={() => navigate("/login")}>Log In</Button>
        </div>
      </div>
    );
  }

  const handleQuizComplete = (score: number, total: number, quizId: string) => {
    console.log(`Quiz ${quizId} completed with score: ${score}/${total}`);
    setSelectedQuiz(null);
  };

  return (
    <MainLayout>
      <motion.div className="space-y-8" {...pageTransition}>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Your <span className="text-gold">Learning Library</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Access your courses, quizzes, and learning resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="text-gold h-6 w-6" />
              <h2 className="text-xl font-semibold">Enrolled Courses</h2>
            </div>
            <p className="text-muted-foreground">
              Start where you left off or explore new courses.
            </p>
            <Button className="mt-4 bg-gold hover:bg-gold/90 text-white w-full">
              View Courses <GraduationCap className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ListChecks className="text-gold h-6 w-6" />
              <h2 className="text-xl font-semibold">Practice Quizzes</h2>
            </div>
            <p className="text-muted-foreground">
              Test your knowledge and track your progress with quizzes.
            </p>
            <Button className="mt-4 bg-gold hover:bg-gold/90 text-white w-full">
              Start a Quiz <BookOpenCheck className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedQuiz && (
          <DynamicMusicQuiz
            quizId={selectedQuiz.id}
            onComplete={handleQuizComplete}
          />
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Library;
