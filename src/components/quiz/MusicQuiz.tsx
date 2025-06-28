import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, CheckCircle, ChevronRight, HelpCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Music knowledge categories
type QuizCategory =
| 'Music Theory'
| 'Instruments'
| 'Music History'
| 'Vocal Techniques'
| 'Composition';

interface Question {
id: number;
text: string;
options: string[];
correctAnswer: number;
explanation: string;
category: QuizCategory;
}

interface DatabaseQuiz {
id: string;
title: string;
description: string;
difficulty: number;
questions: Question[];
category: string;
access_level: string;
}

interface MusicQuizProps {
category?: QuizCategory;
difficulty?: number;
onComplete?: (score: number, totalQuestions: number) => void;
// Add these props for database connection
supabaseClient?: any; // Replace with your Supabase client type
userAccessLevel?: 'free' | 'basic' | 'premium' | 'private';
}

const MusicQuiz: React.FC<MusicQuizProps> = ({
category,
difficulty,
onComplete,
supabaseClient,
userAccessLevel = 'basic'
}) => {
const [availableQuizzes, setAvailableQuizzes] = useState<DatabaseQuiz[]>([]);
const [currentQuiz, setCurrentQuiz] = useState<DatabaseQuiz | null>(null);
const [questions, setQuestions] = useState<Question[]>([]);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedOption, setSelectedOption] = useState<number | null>(null);
const [isAnswered, setIsAnswered] = useState(false);
const [score, setScore] = useState(0);
const [quizCompleted, setQuizCompleted] = useState(false);
const [showExplanation, setShowExplanation] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Fetch quizzes from database
useEffect(() => {
const fetchQuizzes = async () => {
if (!supabaseClient) {
setError('Database connection not available');
setLoading(false);
return;
}

try {
setLoading(true);
setError(null);

// Build query based on filters
let query = supabaseClient
.from('quizzes')
.select('*');

// Filter by category if provided
if (category) {
query = query.eq('category', category);
}

// Filter by difficulty if provided
if (difficulty) {
query = query.eq('difficulty', difficulty);
}

// Filter by access level (only show quizzes user has access to)
const accessLevels = getAccessibleLevels(userAccessLevel);
query = query.in('access_level', accessLevels);

const { data, error: fetchError } = await query;

if (fetchError) {
throw fetchError;
}

if (!data || data.length === 0) {
setError('No quizzes found matching your criteria');
setLoading(false);
return;
}

setAvailableQuizzes(data);

// Randomly select a quiz from available options
const randomQuiz = data[Math.floor(Math.random() * data.length)];
selectQuiz(randomQuiz);

} catch (err) {
console.error('Error fetching quizzes:', err);
setError('Failed to load quizzes. Please try again.');
} finally {
setLoading(false);
}
};

fetchQuizzes();
}, [category, difficulty, supabaseClient, userAccessLevel]);

// Helper function to determine which access levels user can see
const getAccessibleLevels = (userLevel: string): string[] => {
const levels = {
'free': ['free'],
'basic': ['free', 'basic'],
'premium': ['free', 'basic', 'premium'],
'private': ['free', 'basic', 'premium', 'private']
};
return levels[userLevel as keyof typeof levels] || ['free'];
};

// Select and prepare a quiz
const selectQuiz = (quiz: DatabaseQuiz) => {
setCurrentQuiz(quiz);

// Shuffle questions and take up to 5
const shuffledQuestions = [...quiz.questions].sort(() => Math.random() - 0.5);
const selectedQuestions = shuffledQuestions.slice(0, Math.min(5, shuffledQuestions.length));

setQuestions(selectedQuestions);
};

// Reset quiz state for new quiz
const resetQuizState = () => {
setCurrentQuestionIndex(0);
setSelectedOption(null);
setIsAnswered(false);
setScore(0);
setQuizCompleted(false);
setShowExplanation(false);
};

// Start a new quiz session with different questions
const startNewSession = () => {
if (availableQuizzes.length === 0) return;

// Try to select a different quiz if multiple are available
let newQuiz;
if (availableQuizzes.length > 1) {
const otherQuizzes = availableQuizzes.filter(q => q.id !== currentQuiz?.id);
newQuiz = otherQuizzes[Math.floor(Math.random() * otherQuizzes.length)];
} else {
newQuiz = availableQuizzes[0];
}

resetQuizState();
selectQuiz(newQuiz);
};

const currentQuestion = questions[currentQuestionIndex];

const handleOptionSelect = (optionIndex: number) => {
if (isAnswered) return;

setSelectedOption(optionIndex);
setIsAnswered(true);

if (optionIndex === currentQuestion?.correctAnswer) {
setScore(score + 1);
}

setShowExplanation(true);
};

const handleNextQuestion = () => {
setSelectedOption(null);
setIsAnswered(false);
setShowExplanation(false);

if (currentQuestionIndex < questions.length - 1) {
setCurrentQuestionIndex(currentQuestionIndex + 1);
} else {
setQuizCompleted(true);
if (onComplete) {
onComplete(score, questions.length);
}
}
};

const restartQuiz = () => {
resetQuizState();
// Keep the same quiz but reshuffle questions
if (currentQuiz) {
selectQuiz(currentQuiz);
}
};

// Error state
if (error) {
return (
<Card>
<CardHeader>
<CardTitle>Music Knowledge Quiz</CardTitle>
</CardHeader>
<CardContent>
<Alert className="bg-red-50 border-red-200">
<AlertCircle className="h-5 w-5 text-red-600" />
<AlertTitle>Error</AlertTitle>
<AlertDescription>{error}</AlertDescription>
</Alert>
</CardContent>
<CardFooter>
<Button
onClick={() => window.location.reload()}
className="w-full"
>
Try Again
</Button>
</CardFooter>
</Card>
);
}

// Loading state
if (loading || questions.length === 0) {
return (
<Card>
<CardHeader>
<CardTitle>Music Knowledge Quiz</CardTitle>
<CardDescription>Loading questions...</CardDescription>
</CardHeader>
<CardContent className="flex justify-center py-8">
<div className="animate-spin h-8 w-8 border-4 border-blue-600/60 border-t-blue-600 rounded-full"></div>
</CardContent>
</Card>
);
}

const getScoreCategory = (score: number, total: number) => {
const percentage = (score / total) * 100;
if (percentage >= 80) return "Virtuoso";
if (percentage >= 60) return "Musician";
if (percentage >= 40) return "Enthusiast";
return "Beginner";
};

const getScoreMessage = (score: number, total: number) => {
const percentage = (score / total) * 100;
if (percentage >= 80) return "Excellent! You have a strong understanding of music concepts.";
if (percentage >= 60) return "Good job! You understand many key musical principles.";
if (percentage >= 40) return "You're on your way to understanding music fundamentals.";
return "Keep learning about music to improve your understanding.";
};

const getRecommendations = (score: number, total: number) => {
const percentage = (score / total) * 100;
if (percentage >= 80) {
return [
"Check out our advanced music theory courses",
"Try composing your own music with our tools"
];
}
if (percentage >= 60) {
return [
"Explore more about musical styles and techniques",
"Join our intermediate practice sessions"
];
}
if (percentage >= 40) {
return [
"Focus on understanding basic music theory",
"Try our beginner instrument tutorials"
];
}
return [
"Start with our music fundamentals course",
"Watch our 'Introduction to Reading Music' videos",
"Try our interactive note recognition exercises"
];
};

if (quizCompleted) {
return (
<Card>
<CardHeader>
<CardTitle>Quiz Complete!</CardTitle>
<CardDescription>
{currentQuiz ? `${currentQuiz.title} - ` : ''}
You scored {score} out of {questions.length} questions correctly
</CardDescription>
</CardHeader>
<CardContent className="space-y-4">
<div className="flex justify-center py-4">
<div className="text-center">
<div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
<Award className="h-12 w-12 text-blue-600" />
</div>
<h3 className="text-2xl font-bold">{getScoreCategory(score, questions.length)} Level</h3>
<p className="text-muted-foreground mt-1">{getScoreMessage(score, questions.length)}</p>
</div>
</div>

<Progress value={(score / questions.length) * 100} className="h-2 w-full" />

<div className="mt-6">
<h4 className="font-medium mb-2">Recommended Resources for You:</h4>
<ul className="space-y-2">
{getRecommendations(score, questions.length).map((recommendation, index) => (
<li key={index} className="flex items-start">
<CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
<span>{recommendation}</span>
</li>
))}
</ul>
</div>
</CardContent>
<CardFooter className="space-y-2">
<Button onClick={restartQuiz} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
<RotateCcw className="mr-2 h-4 w-4" />
Retry Same Quiz
</Button>
{availableQuizzes.length > 1 && (
<Button onClick={startNewSession} variant="outline" className="w-full">
Try Different Questions
</Button>
)}
</CardFooter>
</Card>
);
}

return (
<Card>
<CardHeader>
<div className="flex justify-between items-center">
<div>
<CardTitle>{currentQuiz?.title || 'Music Knowledge Quiz'}</CardTitle>
<CardDescription>
{currentQuiz?.description || 'Test your understanding of music concepts'}
</CardDescription>
</div>
<div className="text-right">
<p className="text-sm font-medium">
Question {currentQuestionIndex + 1}/{questions.length}
</p>
<p className="text-xs text-muted-foreground">
{currentQuestion?.category} • Difficulty: {currentQuiz?.difficulty}/3
</p>
</div>
</div>
</CardHeader>
<CardContent className="space-y-4">
<Progress value={((currentQuestionIndex) / questions.length) * 100} className="h-2 w-full" />

<div className="py-4">
<h3 className="text-lg font-medium mb-4 flex items-start">
<HelpCircle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-blue-600" />
{currentQuestion?.text}
</h3>

<div className="space-y-2 mt-6">
{currentQuestion?.options.map((option, index) => (
<Button
key={index}
variant={
selectedOption === index
? index === currentQuestion.correctAnswer
? "default"
: "destructive"
: selectedOption !== null && index === currentQuestion.correctAnswer
? "default"
: "outline"
}
className={cn(
"w-full justify-start text-left p-4 h-auto",
selectedOption === index
? index === currentQuestion.correctAnswer
? "bg-green-500 hover:bg-green-600 text-white"
: "bg-red-500 hover:bg-red-600 text-white"
: selectedOption !== null && index === currentQuestion.correctAnswer
? "bg-green-500 hover:bg-green-600 text-white"
: ""
)}
onClick={() => handleOptionSelect(index)}
disabled={isAnswered}
>
<span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
{option}
</Button>
))}
</div>
</div>

{showExplanation && (
<Alert className={selectedOption === currentQuestion?.correctAnswer ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
<BookOpen className={`h-5 w-5 ${selectedOption === currentQuestion?.correctAnswer ? "text-green-600" : "text-amber-600"}`} />
<AlertTitle>Explanation</AlertTitle>
<AlertDescription>
{currentQuestion?.explanation}
</AlertDescription>
</Alert>
)}
</CardContent>
<CardFooter>
<Button
onClick={handleNextQuestion}
disabled={!isAnswered}
className="w-full bg-blue-600 hover:bg-blue-700 text-white"
>
{currentQuestionIndex < questions.length - 1 ? (
<>
Next Question
<ChevronRight className="ml-2 h-4 w-4" />
</>
) : (
"See Results"
)}
</Button>
</CardFooter>
</Card>
);
};

export default MusicQuiz;
