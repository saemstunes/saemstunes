
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, CheckCircle, ChevronRight, HelpCircle, RotateCcw } from 'lucide-react';
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

interface MusicQuizProps {
  category?: QuizCategory;
  onComplete?: (score: number, totalQuestions: number) => void;
}

// Sample questions covering music theory, instruments, history, vocal techniques
const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "What does the Italian term 'Allegro' mean in music?",
    options: ["Fast, quickly and bright", "Slow and stately", "Moderate tempo", "Very slow"],
    correctAnswer: 0,
    explanation: "Allegro is a tempo marking that indicates the music should be played fast, quickly and bright. It's one of the most common Italian musical terms.",
    category: "Music Theory"
  },
  {
    id: 2,
    text: "Which of these is not a woodwind instrument?",
    options: ["Clarinet", "Oboe", "French Horn", "Flute"],
    correctAnswer: 2,
    explanation: "The French Horn is a brass instrument, not a woodwind. Clarinets, oboes, and flutes are all part of the woodwind family.",
    category: "Instruments"
  },
  {
    id: 3,
    text: "Which vocal technique involves smooth connection between notes?",
    options: ["Vibrato", "Legato", "Staccato", "Falsetto"],
    correctAnswer: 1,
    explanation: "Legato is a vocal technique that creates a smooth, connected line between notes, with no interruption between them. The word comes from the Italian legare, 'to bind or tie together.'",
    category: "Vocal Techniques"
  },
  {
    id: 4,
    text: "Who composed 'The Four Seasons'?",
    options: ["Johann Sebastian Bach", "Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Antonio Vivaldi"],
    correctAnswer: 3,
    explanation: "Antonio Vivaldi composed 'The Four Seasons' (Le quattro stagioni), a set of four violin concertos between 1718 and 1720, which is one of the most popular pieces of Baroque music.",
    category: "Music History"
  },
  {
    id: 5,
    text: "What is the name for a sequence of notes arranged in ascending or descending order?",
    options: ["Chord", "Scale", "Arpeggio", "Octave"],
    correctAnswer: 1,
    explanation: "A scale is a sequence of notes arranged in ascending or descending order by pitch. Common examples include the major scale and minor scale.",
    category: "Music Theory"
  },
  {
    id: 6,
    text: "Which of these describes the process of creating variations on a musical theme?",
    options: ["Harmonization", "Orchestration", "Development", "Transposition"],
    correctAnswer: 2,
    explanation: "In music composition, development refers to the process of creating variations on a musical theme, expanding and exploring it throughout a piece.",
    category: "Composition"
  },
  {
    id: 7,
    text: "What is the correct order of sharps in key signatures?",
    options: ["F, C, G, D, A, E, B", "C, F, G, D, E, A, B", "F, C, G, D, E, A, B", "B, E, A, D, G, C, F"],
    correctAnswer: 0,
    explanation: "The correct order of sharps in key signatures is F♯, C♯, G♯, D♯, A♯, E♯, B♯. This can be remembered with the mnemonic 'Father Charles Goes Down And Ends Battle.'",
    category: "Music Theory"
  },
  {
    id: 8,
    text: "Which famous composer was deaf when he composed his Ninth Symphony?",
    options: ["Franz Liszt", "Johannes Brahms", "Wolfgang Amadeus Mozart", "Ludwig van Beethoven"],
    correctAnswer: 3,
    explanation: "Ludwig van Beethoven was almost completely deaf when he composed his Ninth Symphony. He began losing his hearing in 1798 and was virtually deaf for the last decade of his life.",
    category: "Music History"
  },
  {
    id: 9,
    text: "What type of voice is the lowest female singing voice?",
    options: ["Soprano", "Mezzo-soprano", "Alto", "Contralto"],
    correctAnswer: 3,
    explanation: "Contralto is the lowest female singing voice. It's relatively rare and has a rich, deep sound quality. Alto is often used to describe the lower female voice in choral settings.",
    category: "Vocal Techniques"
  },
  {
    id: 10,
    text: "What is the term for when two or more notes are played together?",
    options: ["Melody", "Rhythm", "Harmony", "Tempo"],
    correctAnswer: 2,
    explanation: "Harmony refers to when two or more notes are played or sung together. This creates chords and chord progressions, which provide the harmonic structure of music.",
    category: "Music Theory"
  }
];

const MusicQuiz: React.FC<MusicQuizProps> = ({ category, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  useEffect(() => {
    // Filter questions by category if provided, otherwise use all questions
    let filteredQuestions = category 
      ? sampleQuestions.filter(q => q.category === category)
      : sampleQuestions;
      
    // Shuffle questions
    filteredQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
    
    // Take only first 5 questions if there are more
    const selectedQuestions = filteredQuestions.slice(0, 5);
    
    setQuestions(selectedQuestions);
  }, [category]);
  
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
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
  };
  
  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Music Knowledge Quiz</CardTitle>
          <CardDescription>Loading questions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-gold/60 border-t-gold rounded-full"></div>
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
            <h4 className="font-medium mb-2">Recommended Resources for You:</h4>
            <ul className="space-y-2">
              {getRecommendations(score, questions.length).map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-gold mr-2 mt-0.5 shrink-0" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
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
            <CardTitle>Music Knowledge Quiz</CardTitle>
            <CardDescription>
              Test your understanding of music concepts
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              Question {currentQuestionIndex + 1}/{questions.length}
            </p>
            <p className="text-xs text-muted-foreground">{currentQuestion?.category}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={((currentQuestionIndex) / questions.length) * 100} className="h-2 w-full" />
        
        <div className="py-4">
          <h3 className="text-lg font-medium mb-4 flex items-start">
            <HelpCircle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-gold" />
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

export default MusicQuiz;
