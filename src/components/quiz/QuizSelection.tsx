
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, BrainCircuit, Lightbulb, Music, Sparkles, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useQuizzes } from "@/hooks/useQuizzes";
import { Quiz, getDifficultyLabel, getDifficultyColor } from "@/services/quizService";

interface QuizSelectionProps {
  onQuizSelect: (quizId: string) => void;
  activeQuizId?: string;
  completedQuizIds?: string[];
}

const getQuizIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'music theory':
      return <Music className="h-6 w-6 text-gold" />;
    case 'chord progressions':
      return <BrainCircuit className="h-6 w-6 text-gold" />;
    case 'musical instruments':
      return <BookOpen className="h-6 w-6 text-gold" />;
    case 'music history':
      return <Sparkles className="h-6 w-6 text-gold" />;
    case 'local music culture':
      return <Lightbulb className="h-6 w-6 text-gold" />;
    default:
      return <Music className="h-6 w-6 text-gold" />;
  }
};

const QuizSelection: React.FC<QuizSelectionProps> = ({ 
  onQuizSelect, 
  activeQuizId,
  completedQuizIds = []
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [premiumAttempt, setPremiumAttempt] = useState<string | null>(null);
  const { quizzes, loading, error } = useQuizzes();

  useEffect(() => {
    // Clear premium attempt after 3 seconds
    if (premiumAttempt) {
      const timer = setTimeout(() => {
        setPremiumAttempt(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [premiumAttempt]);

  const handleQuizSelect = (quiz: Quiz) => {
    // If it's a premium quiz and user is not logged in
    if (quiz.access_level === 'premium' && !user) {
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

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-proxima">Music Quizzes</CardTitle>
          <CardDescription>Loading quizzes...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-gold/60 border-t-gold rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-proxima">Music Quizzes</CardTitle>
          <CardDescription>Error loading quizzes</CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <p className="text-red-500 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

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
          {quizzes.map((quiz, index) => {
            const isPremium = quiz.access_level === 'premium';
            const difficultyLabel = getDifficultyLabel(quiz.difficulty);
            const questionsCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
            const estimatedTime = Math.max(2, Math.ceil(questionsCount * 0.5)) + " min";

            return (
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
                  delay: index * 0.05,
                  scale: { duration: 0.2, repeat: premiumAttempt === quiz.id ? 1 : 0 }
                }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all",
                  activeQuizId === quiz.id ? "bg-gold/10 border-l-4 border-gold" : "bg-muted/40 hover:bg-muted",
                  completedQuizIds.includes(quiz.id) && "border border-green-500/30",
                  isPremium && !user && "relative overflow-hidden"
                )}
                onClick={() => handleQuizSelect(quiz)}
              >
                {/* Premium quiz overlay for non-logged-in users */}
                {isPremium && !user && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="flex flex-col items-center p-2 text-center">
                      <LogIn className="h-5 w-5 text-gold mb-1" />
                      <span className="text-sm font-medium">Sign in for access</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="bg-background/60 rounded-full p-2">
                    {getQuizIcon(quiz.category)}
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center">
                      {quiz.title}
                      {isPremium && (
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
                  <span className={cn("block px-2 py-1 rounded", getDifficultyColor(quiz.difficulty))}>
                    {difficultyLabel}
                  </span>
                  <span className="block mt-1 text-muted-foreground">
                    {questionsCount} questions • {estimatedTime}
                  </span>
                </div>
              </motion.div>
            );
          })}
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
