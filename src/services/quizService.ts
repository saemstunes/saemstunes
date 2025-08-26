// services/quizService.ts
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
    .lte('access_level', userTier); // Only include quizzes accessible to user

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
