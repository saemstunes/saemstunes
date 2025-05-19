
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, BrainCircuit, Lightbulb, Music, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface QuizOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  premium: boolean;
  completionTime: string;
  questions: number;
}

const quizOptions: QuizOption[] = [
  {
    id: "music-theory-basics",
    title: "Music Theory Basics",
    description: "Test your knowledge of notes, scales, and basic music notation",
    icon: <Music className="h-6 w-6 text-gold" />,
    difficulty: "Beginner",
    premium: false,
    completionTime: "5 min",
    questions: 10
  },
  {
    id: "chord-progressions",
    title: "Chord Progressions",
    description: "Challenge yourself with common and complex chord progressions",
    icon: <BrainCircuit className="h-6 w-6 text-gold" />,
    difficulty: "Intermediate",
    premium: true,
    completionTime: "7 min",
    questions: 12
  },
  {
    id: "musical-instruments",
    title: "Musical Instruments",
    description: "How much do you know about different instruments?",
    icon: <BookOpen className="h-6 w-6 text-gold" />,
    difficulty: "Beginner",
    premium: false,
    completionTime: "4 min",
    questions: 8
  },
  {
    id: "music-history",
    title: "Music History & Culture",
    description: "Test your knowledge of musical eras, composers, and cultural context",
    icon: <Sparkles className="h-6 w-6 text-gold" />,
    difficulty: "Advanced",
    premium: true,
    completionTime: "10 min",
    questions: 15
  },
  {
    id: "local-music-culture",
    title: "Local Music Traditions",
    description: "Explore traditional and contemporary local music styles",
    icon: <Lightbulb className="h-6 w-6 text-gold" />,
    difficulty: "Intermediate",
    premium: true,
    completionTime: "8 min",
    questions: 12
  }
];

interface QuizSelectionProps {
  onQuizSelect: (quizId: string) => void;
  activeQuizId?: string;
  completedQuizIds?: string[];
}

const QuizSelection: React.FC<QuizSelectionProps> = ({ 
  onQuizSelect, 
  activeQuizId,
  completedQuizIds = []
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuizSelect = (quiz: QuizOption) => {
    // If it's a premium quiz and user is not logged in or doesn't have access
    if (quiz.premium && !user) {
      toast({
        title: "Premium Quiz",
        description: "Sign in or subscribe to access this quiz",
        variant: "default",
      });
      return;
    }

    // Already selected quiz
    if (quiz.id === activeQuizId) return;

    onQuizSelect(quiz.id);
  };

  const handleSubscribeClick = () => {
    navigate("/subscriptions");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-proxima">Music Quizzes</CardTitle>
          <Lightbulb className="h-5 w-5 text-gold" />
        </div>
        <CardDescription>Test your knowledge across various topics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {quizOptions.map((quiz) => (
          <div 
            key={quiz.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
              activeQuizId === quiz.id ? "bg-gold/10 border-l-4 border-gold" : "bg-muted/40 hover:bg-muted",
              completedQuizIds.includes(quiz.id) && "border border-green-500/30"
            )}
            onClick={() => handleQuizSelect(quiz)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-background/60 rounded-full p-2">
                {quiz.icon}
              </div>
              <div>
                <h3 className="font-medium flex items-center">
                  {quiz.title}
                  {quiz.premium && (
                    <span className="ml-2 text-xs bg-gold text-white px-1.5 py-0.5 rounded">
                      PREMIUM
                    </span>
                  )}
                  {completedQuizIds.includes(quiz.id) && (
                    <span className="ml-2 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">
                      COMPLETED
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{quiz.description}</p>
              </div>
            </div>
            <div className="text-right text-xs hidden md:block">
              <span className={cn(
                "block px-2 py-1 rounded",
                quiz.difficulty === "Beginner" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : 
                quiz.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" :
                "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              )}>
                {quiz.difficulty}
              </span>
              <span className="block mt-1 text-muted-foreground">{quiz.questions} questions • {quiz.completionTime}</span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t pt-4">
        {!user && (
          <Button 
            variant="default" 
            className="w-full bg-gold hover:bg-gold/90 text-white"
            onClick={handleSubscribeClick}
          >
            Sign in to access all quizzes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizSelection;
