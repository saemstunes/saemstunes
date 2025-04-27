
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, ChevronRight, Play, Pause, Clock, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  instructions: string[];
  completed: boolean;
}

interface ModuleProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

const BreathingTechniquesModule: React.FC<ModuleProps> = ({ onComplete, onProgress }) => {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "diaphragmatic",
      title: "Diaphragmatic Breathing",
      description: "Learn to breathe deeply using your diaphragm, the foundation of all good vocal technique.",
      duration: 120, // 2 minutes
      instructions: [
        "Lie down on your back with one hand on your chest and one on your stomach.",
        "Breathe in through your nose for 4 counts, ensuring your stomach rises while your chest remains still.",
        "Hold for 2 counts.",
        "Exhale slowly through your mouth for 6 counts, feeling your stomach fall.",
        "Repeat the cycle for 2 minutes."
      ],
      completed: false
    },
    {
      id: "rib-expansion",
      title: "Rib Expansion",
      description: "Develop lateral breathing to maintain consistent airflow while singing.",
      duration: 180, // 3 minutes
      instructions: [
        "Stand with your hands placed on the sides of your ribcage.",
        "Inhale through your nose for 4 counts, focusing on expanding your ribs sideways.",
        "Hold for 2 counts, maintaining the expansion.",
        "Exhale slowly for 8 counts, trying to keep your ribs expanded as long as possible.",
        "Repeat the cycle for 3 minutes."
      ],
      completed: false
    },
    {
      id: "staccato-breaths",
      title: "Staccato Breaths",
      description: "Improve breath control with quick, controlled inhalations.",
      duration: 90, // 1.5 minutes
      instructions: [
        "Stand with good posture, shoulders relaxed.",
        "Take 5 quick, short inhalations through your nose, filling your lungs progressively.",
        "Exhale slowly through your mouth on an 'S' sound for 10 counts.",
        "Rest for 2 breaths.",
        "Repeat the cycle for 90 seconds."
      ],
      completed: false
    },
    {
      id: "sustained-notes",
      title: "Sustained Notes",
      description: "Practice maintaining consistent airflow for long notes.",
      duration: 150, // 2.5 minutes
      instructions: [
        "Take a deep diaphragmatic breath.",
        "Sing or hum a comfortable note at medium volume.",
        "Maintain the note for as long as possible with consistent tone.",
        "Record your duration and try to improve with each attempt.",
        "Rest for 10 seconds between attempts.",
        "Complete 5 repetitions."
      ],
      completed: false
    }
  ]);
  
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isExercising, setIsExercising] = useState(false);
  const [timer, setTimer] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  useEffect(() => {
    // Calculate and report progress whenever exercises change
    const completedCount = exercises.filter(ex => ex.completed).length;
    const progressPercent = (completedCount / exercises.length) * 100;
    
    if (onProgress) {
      onProgress(progressPercent);
    }
    
    // Check if all exercises are completed
    if (completedCount === exercises.length && onComplete) {
      onComplete();
    }
  }, [exercises, onComplete, onProgress]);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isExercising && activeExercise) {
      interval = window.setInterval(() => {
        setTimer(prevTimer => {
          const newTime = prevTimer + 1;
          
          // Exercise completed
          if (newTime >= activeExercise.duration) {
            setIsExercising(false);
            
            // Mark exercise as completed
            setExercises(prev => 
              prev.map(ex => 
                ex.id === activeExercise.id ? { ...ex, completed: true } : ex
              )
            );
            
            toast({
              title: "Exercise Completed!",
              description: `You've completed the ${activeExercise.title} exercise.`,
            });
            
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExercising, activeExercise, toast]);
  
  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimer(0);
    setIsExercising(true);
    setActiveTab("practice");
  };
  
  const stopExercise = () => {
    setIsExercising(false);
  };
  
  const resetExercises = () => {
    setExercises(prev => prev.map(ex => ({ ...ex, completed: false })));
    setActiveExercise(null);
    setIsExercising(false);
    setTimer(0);
    setActiveTab("overview");
    
    toast({
      title: "Progress Reset",
      description: "You can now restart all the breathing exercises.",
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate overall module progress
  const completedCount = exercises.filter(ex => ex.completed).length;
  const overallProgress = (completedCount / exercises.length) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold">Breathing Techniques</h2>
          <p className="text-muted-foreground">Master proper breathing for singing and vocal control</p>
        </div>
        
        <Button variant="outline" size="sm" onClick={resetExercises}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Progress
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-sm">Overall Progress</p>
          <p className="text-sm font-medium">{completedCount} of {exercises.length} completed</p>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="practice" disabled={!activeExercise}>
            {activeExercise ? `Practicing: ${activeExercise.title}` : 'Practice'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 py-4">
          {exercises.map(exercise => (
            <Card key={exercise.id} className={exercise.completed ? "border-green-200 bg-green-50/30 dark:bg-green-900/10" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  {exercise.completed && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                  {exercise.title}
                </CardTitle>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatTime(exercise.duration)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => startExercise(exercise)} 
                  variant={exercise.completed ? "outline" : "default"}
                  className={exercise.completed ? "" : "bg-gold hover:bg-gold-dark"}
                >
                  {exercise.completed ? "Practice Again" : "Start Exercise"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="practice" className="space-y-6 py-4">
          {activeExercise && (
            <Card>
              <CardHeader>
                <CardTitle>{activeExercise.title}</CardTitle>
                <CardDescription>{activeExercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Instructions:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    {activeExercise.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="pt-4 space-y-4">
                  <div className="relative h-24 w-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-muted flex items-center justify-center">
                      <div className="text-2xl font-mono">{formatTime(isExercising ? timer : 0)}</div>
                    </div>
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="4"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-gold stroke-current transition-all duration-200"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (timer / activeExercise.duration) * 264}
                      />
                    </svg>
                  </div>
                  
                  <div className="text-center py-2">
                    <p className="text-lg font-semibold">
                      {isExercising 
                        ? `${formatTime(activeExercise.duration - timer)} remaining` 
                        : 'Ready to begin'}
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={isExercising ? stopExercise : () => startExercise(activeExercise)}
                      className={isExercising ? "bg-red-500 hover:bg-red-600" : "bg-gold hover:bg-gold-dark"}
                    >
                      {isExercising ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          {timer > 0 ? "Resume" : "Start"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BreathingTechniquesModule;
