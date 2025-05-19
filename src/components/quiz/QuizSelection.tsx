
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, BrainCircuit, Lightbulb, Music, Sparkles, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

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
  const [premiumAttempt, setPremiumAttempt] = useState<string | null>(null);

  useEffect(() => {
    // Clear premium attempt after 3 seconds
    if (premiumAttempt) {
      const timer = setTimeout(() => {
        setPremiumAttempt(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [premiumAttempt]);

  const handleQuizSelect = (quiz: QuizOption) => {
    // If it's a premium quiz and user is not logged in
    if (quiz.premium && !user) {
      setPremiumAttempt(quiz.id);
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
    if (!user) {
      navigate("/auth?signup=true");
    } else {
      navigate("/subscriptions");
    }
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
        <AnimatePresence>
          {quizOptions.map((quiz) => (
            <motion.div 
              key={quiz.id} 
              initial={{ opacity: 0, y: 5 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: premiumAttempt === quiz.id ? [1, 1.02, 1] : 1 
              }}
              transition={{ 
                duration: 0.3,
                delay: quizOptions.indexOf(quiz) * 0.05,
                scale: { duration: 0.2, repeat: premiumAttempt === quiz.id ? 1 : 0 }
              }}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all",
                activeQuizId === quiz.id ? "bg-gold/10 border-l-4 border-gold" : "bg-muted/40 hover:bg-muted",
                completedQuizIds.includes(quiz.id) && "border border-green-500/30",
                quiz.premium && !user && "relative overflow-hidden"
              )}
              onClick={() => handleQuizSelect(quiz)}
            >
              {/* Premium quiz overlay for non-logged-in users */}
              {quiz.premium && !user && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="flex flex-col items-center p-2 text-center">
                    <LogIn className="h-5 w-5 text-gold mb-1" />
                    <span className="text-sm font-medium">Sign in for access</span>
                  </div>
                </div>
              )}
              
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
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="border-t pt-4">
        {!user && (
          <Button 
            variant="default" 
            className="w-full bg-gold hover:bg-gold/90 text-white flex items-center justify-center gap-2"
            onClick={handleSubscribeClick}
          >
            <LogIn className="h-4 w-4" />
            Sign in to access all quizzes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizSelection;
