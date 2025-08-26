import { supabase } from '@/integrations/supabase/client';
import { canAccessContent, type AccessLevel } from '@/lib/contentAccess';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  quizDifficulty?: number;
  quizAccessLevel?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  category: string;
  questions: QuizQuestion[];
  access_level: AccessLevel;
  estimatedTime?: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  answers: Record<number, number>;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const getDifficultyLabel = (difficulty: number): string => {
  if (difficulty <= 2) return 'Beginner';
  if (difficulty <= 4) return 'Intermediate';
  return 'Advanced';
};

export const getDifficultyColor = (difficulty: number): string => {
  if (difficulty <= 2) return 'bg-green-100 text-green-800';
  if (difficulty <= 4) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const fetchQuestionsByTier = async (userTier: string): Promise<QuizQuestion[]> => {
  let difficultyRange: number[];
  let questionCount: number;

  // Define parameters based on user tier
  switch (userTier) {
    case 'free':
      difficultyRange = [1];
      questionCount = 10;
      break;
    case 'basic':
      difficultyRange = [1, 2];
      questionCount = 20;
      break;
    case 'premium':
      difficultyRange = [1, 2, 3, 4];
      questionCount = 30;
      break;
    case 'professional':
      difficultyRange = [1, 2, 3, 4];
      questionCount = 50;
      break;
    default:
      difficultyRange = [1];
      questionCount = 10;
  }

  // Fetch questions from Supabase
  const { data, error } = await supabase
    .from('quizzes')
    .select('questions, difficulty, access_level')
    .in('difficulty', difficultyRange)
    .lte('access_level', userTier);

  if (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }

  // Extract and flatten questions
  let allQuestions: QuizQuestion[] = [];
  data.forEach(quiz => {
    if (quiz.questions && Array.isArray(quiz.questions)) {
      quiz.questions.forEach((q: any) => {
        allQuestions.push({
          ...q,
          quizDifficulty: quiz.difficulty,
          quizAccessLevel: quiz.access_level
        });
      });
    }
  });

  // Shuffle questions and select the required number
  const shuffledQuestions = shuffleArray(allQuestions);
  return shuffledQuestions.slice(0, questionCount);
};

// Helper function to shuffle array
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const saveQuizAttempt = async (
  userId: string, 
  quizId: string, 
  score: number, 
  answers: Record<number, number>, 
  completed: boolean
): Promise<QuizAttempt> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score,
      answers,
      completed,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }

  return data as QuizAttempt;
};

export const fetchUserQuizAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user quiz attempts:', error);
    return [];
  }

  return data as QuizAttempt[];
};

export const getAccessibleQuizzes = async (user: any, userSubscriptionTier: string = 'free'): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('difficulty', { ascending: true });

  if (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }

  return data.filter(quiz => 
    canAccessContent(quiz.access_level, user, userSubscriptionTier as any)
  ) as Quiz[];
};
