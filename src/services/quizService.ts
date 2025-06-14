
import { canAccessContent, type AccessLevel } from '@/lib/contentAccess';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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

// Mock quiz data with access levels
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Basic Music Theory',
    description: 'Test your knowledge of fundamental music theory concepts',
    difficulty: 1,
    category: 'Music Theory',
    access_level: 'free',
    questions: [
      {
        id: 'q1',
        question: 'How many notes are in a major scale?',
        options: ['6', '7', '8', '12'],
        correctAnswer: 1,
        explanation: 'A major scale contains 7 distinct notes before repeating the octave.'
      },
      {
        id: 'q2',
        question: 'What is the interval between C and E?',
        options: ['Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th'],
        correctAnswer: 2,
        explanation: 'C to E is a major third interval.'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Vocal Techniques',
    description: 'Assess your understanding of vocal training methods',
    difficulty: 2,
    category: 'Vocal Development',
    access_level: 'auth',
    questions: [
      {
        id: 'q1',
        question: 'What is the primary purpose of vocal warm-ups?',
        options: ['Increase volume', 'Prepare vocal cords', 'Change pitch range', 'Improve rhythm'],
        correctAnswer: 1,
        explanation: 'Vocal warm-ups prepare the vocal cords for singing and prevent strain.'
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'Advanced Harmony',
    description: 'Challenge your knowledge of complex harmonic concepts',
    difficulty: 4,
    category: 'Music Theory',
    access_level: 'basic',
    questions: [
      {
        id: 'q1',
        question: 'What is a secondary dominant?',
        options: ['V/V', 'ii/V', 'IV/V', 'vi/V'],
        correctAnswer: 0,
        explanation: 'A secondary dominant is the dominant chord of a scale degree other than the tonic.'
      }
    ]
  },
  {
    id: 'quiz-4',
    title: 'Professional Composition',
    description: 'Master-level composition techniques and analysis',
    difficulty: 5,
    category: 'Composition',
    access_level: 'premium',
    questions: [
      {
        id: 'q1',
        question: 'What compositional technique is primarily used in Bach\'s fugues?',
        options: ['Sonata form', 'Counterpoint', 'Theme and variations', 'Rondo form'],
        correctAnswer: 1,
        explanation: 'Bach\'s fugues primarily use contrapuntal techniques with imitative polyphony.'
      }
    ]
  },
  {
    id: 'quiz-5',
    title: 'Music Industry Mastery',
    description: 'Professional-level music business and industry knowledge',
    difficulty: 5,
    category: 'Music Business',
    access_level: 'professional',
    questions: [
      {
        id: 'q1',
        question: 'What is the difference between mechanical and performance royalties?',
        options: ['Nothing', 'Source of income', 'Payment frequency', 'Tax implications'],
        correctAnswer: 1,
        explanation: 'Mechanical royalties come from recordings/reproductions, while performance royalties come from public performances.'
      }
    ]
  }
];

// Mock functions that would normally interact with a backend
export const fetchQuizzes = async (): Promise<Quiz[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockQuizzes;
};

export const fetchQuizById = async (id: string): Promise<Quiz | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockQuizzes.find(quiz => quiz.id === id) || null;
};

export const fetchUserQuizAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  // Return mock attempts - in a real app this would fetch from database
  return [];
};

export const saveQuizAttempt = async (
  userId: string, 
  quizId: string, 
  score: number, 
  answers: Record<number, number>, 
  completed: boolean
): Promise<QuizAttempt> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would save to database and return the saved attempt
  const attempt: QuizAttempt = {
    id: `attempt-${Date.now()}`,
    user_id: userId,
    quiz_id: quizId,
    score,
    answers,
    completed,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return attempt;
};

export const getAccessibleQuizzes = (user: any, userSubscriptionTier: string = 'free'): Quiz[] => {
  return mockQuizzes.filter(quiz => 
    canAccessContent(quiz.access_level, user, userSubscriptionTier as any)
  );
};
