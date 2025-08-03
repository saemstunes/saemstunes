
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Trophy, CheckCircle, ChevronRight, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const LearningHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("modules");
  
  // Sample learning path data
  const learningPath = {
    title: "Vocal Fundamentals",
    progress: 42,
    completedModules: 2,
    totalModules: 5
  };
  
  // Sample modules data
  const modules = [
    {
      id: "breathing-techniques",
      title: "Breathing Techniques",
      description: "Learn proper diaphragmatic breathing for singing",
      progress: 100,
      lessons: 4,
      completed: true,
      image: "/placeholder.svg"
    },
    {
      id: "vocal-warm-ups",
      title: "Vocal Warm-Ups",
      description: "Essential exercises to prepare your voice",
      progress: 75,
      lessons: 6,
      completed: false,
      image: "/placeholder.svg"
    },
    {
      id: "pitch-and-tone",
      title: "Pitch and Tone",
      description: "Master pitch accuracy and develop your tone",
      progress: 0,
      lessons: 5,
      completed: false,
      image: "/placeholder.svg"
    },
    {
      id: "range-extension",
      title: "Range Extension",
      description: "Techniques to extend your vocal range safely",
      progress: 0,
      lessons: 5,
      completed: false,
      image: "/placeholder.svg"
    },
    {
      id: "performance-skills",
      title: "Performance Skills",
      description: "Move from practice to confident performance",
      progress: 0,
      lessons: 4,
      completed: false,
      image: "/placeholder.svg"
    }
  ];
  
  // Sample achievements data
  const achievements = [
    {
      title: "First Lesson",
      description: "Completed your first lesson",
      icon: <Play className="h-5 w-5" />,
      unlocked: true
    },
    {
      title: "Module Master",
      description: "Completed a full learning module",
      icon: <BookOpen className="h-5 w-5" />,
      unlocked: true
    },
    {
      title: "Practice Streak",
      description: "Practiced 7 days in a row",
      icon: <Music className="h-5 w-5" />,
      unlocked: false
    },
    {
      title: "Perfect Score",
      description: "Achieved 100% on a quiz",
      icon: <Trophy className="h-5 w-5" />,
      unlocked: false
    }
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold">Learning Hub</h1>
          {user && (
            <Button
              variant="outline"
              onClick={() => navigate("/discover")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Courses
            </Button>
          )}
        </div>
        
        {/* Learning Path Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Path: {learningPath.title}</CardTitle>
            <CardDescription>Track your progress and continue your musical journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{learningPath.progress}%</span>
              </div>
              <Progress value={learningPath.progress} />
              <p className="text-xs text-muted-foreground pt-2">
                {learningPath.completedModules} of {learningPath.totalModules} modules completed
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => setActiveTab("modules")}
              className="bg-gold hover:bg-gold-dark text-white w-full"
            >
              Continue Learning
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Tabs defaultValue="modules" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-muted rounded-md overflow-hidden mb-3">
                      <img 
                        src={module.image} 
                        alt={module.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="flex items-center">
                      {module.completed && (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      {module.title}
                    </CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{module.progress}% complete</span>
                        <span className="text-xs text-muted-foreground">{module.lessons} lessons</span>
                      </div>
                      <Progress value={module.progress} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={module.progress === 0 ? "w-full" : "w-full bg-gold hover:bg-gold-dark text-white"}
                      variant={module.progress === 0 ? "outline" : "default"}
                      onClick={() => navigate(`/learning-hub/${module.id}`)}
                    >
                      {module.progress === 0 ? "Start Module" : "Continue Module"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index}
                  className={!achievement.unlocked ? "opacity-60" : undefined}
                >
                  <CardHeader>
                    <div className={`p-4 w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                      achievement.unlocked ? "bg-gold/10" : "bg-muted"
                    }`}>
                      {React.cloneElement(achievement.icon, { 
                        className: `h-8 w-8 ${achievement.unlocked ? "text-gold" : "text-muted-foreground"}`
                      })}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <p className="text-xs text-muted-foreground mt-2 italic">Locked</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LearningHub;
