
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, CheckCircle, ChevronRight, HelpCircle, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchQuizById, 
  saveQuizAttempt, 
  Quiz, 
  QuizQuestion,
  getDifficultyLabel 
} from "@/services/quizService";

interface DynamicMusicQuizProps {
  quizId: string;
  onComplete?: (score: number, totalQuestions: number, quizId: string) => void;
}

const DynamicMusicQuiz: React.FC<DynamicMusicQuizProps> = ({ quizId, onComplete }) => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      setQuizCompleted(false);
      setCurrentQuestionIndex(0);
      setScore(0);
      setUserAnswers({});
      setSelectedOption(null);
      setIsAnswered(false);
      setShowExplanation(false);

      try {
        const quizData = await fetchQuizById(quizId);
        setQuiz(quizData);
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Quiz...</CardTitle>
          <CardDescription>Please wait while we load your quiz</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-gold/60 border-t-gold rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Not Available</CardTitle>
          <CardDescription>This quiz could not be loaded or has no questions</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please select another quiz from the list.</p>
        </CardContent>
      </Card>
    );
  }

  const questions = quiz.questions as QuizQuestion[];
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    // Store the answer
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
    
    if (optionIndex === currentQuestion?.correctAnswer) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };
  
  const handleNextQuestion = async () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      
      // Save quiz attempt to database
      if (user) {
        try {
          await saveQuizAttempt(user.id, quiz.id, score, userAnswers, true);
        } catch (error) {
          console.error('Error saving quiz attempt:', error);
        }
      }
      
      if (onComplete) {
        onComplete(score, questions.length, quiz.id);
      }
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
    setUserAnswers({});
  };
  
  const getScoreCategory = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "Virtuoso";
    if (percentage >= 60) return "Musician";
    if (percentage >= 40) return "Enthusiast";
    return "Beginner";
  };
  
  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "Excellent! You have a strong understanding of this topic.";
    if (percentage >= 60) return "Good job! You understand many key concepts.";
    if (percentage >= 40) return "You're on your way to mastering this subject.";
    return "Keep practicing to improve your understanding.";
  };
  
  if (quizCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
          <CardDescription>
            You scored {score} out of {questions.length} questions correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center py-4">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Award className="h-12 w-12 text-gold" />
              </div>
              <h3 className="text-2xl font-bold">{getScoreCategory(score, questions.length)} Level</h3>
              <p className="text-muted-foreground mt-1">{getScoreMessage(score, questions.length)}</p>
            </div>
          </div>
          
          <Progress value={(score / questions.length) * 100} className="h-2 w-full" />
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Quiz Details:</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Category:</span> {quiz.category}</p>
              <p><span className="font-medium">Difficulty:</span> {getDifficultyLabel(quiz.difficulty)}</p>
              <p><span className="font-medium">Your Score:</span> {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={restartQuiz} className="w-full bg-gold hover:bg-gold/90 text-white">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>
              {quiz.description}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              Question {currentQuestionIndex + 1}/{questions.length}
            </p>
            <p className="text-xs text-muted-foreground">{quiz.category}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={((currentQuestionIndex) / questions.length) * 100} className="h-2 w-full" />
        
        <div className="py-4">
          <h3 className="text-lg font-medium mb-4 flex items-start">
            <HelpCircle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-gold" />
            {currentQuestion?.question}
          </h3>
          
          <div className="space-y-2 mt-6">
            {currentQuestion?.options?.map((option, index) => (
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
        
        {showExplanation && currentQuestion?.explanation && (
          <Alert className={selectedOption === currentQuestion?.correctAnswer ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
            <BookOpen className={`h-5 w-5 ${selectedOption === currentQuestion?.correctAnswer ? "text-green-600" : "text-amber-600"}`} />
            <AlertTitle>Explanation</AlertTitle>
            <AlertDescription>
              {currentQuestion.explanation}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleNextQuestion} 
          disabled={!isAnswered} 
          className="w-full bg-gold hover:bg-gold/90 text-white"
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

export default DynamicMusicQuiz;
