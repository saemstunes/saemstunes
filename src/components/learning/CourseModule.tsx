
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  Star, 
  User, 
  Trophy,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  type: 'video' | 'interactive' | 'practice' | 'quiz';
  completed: boolean;
  locked: boolean;
  description?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  lessons: Lesson[];
  prerequisites?: string[];
  instructor?: string;
  rating?: number;
  enrolledStudents?: number;
}

interface CourseModuleProps {
  modules?: Module[];
}

const CourseModule: React.FC<CourseModuleProps> = ({ modules = defaultModules }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const startLesson = (lessonId: string) => {
    setSelectedLesson(lessonId);
    // TODO: Navigate to lesson content or open lesson modal
    console.log('Starting lesson:', lessonId);
  };

  const getModuleProgress = (module: Module): number => {
    const completedLessons = module.lessons.filter(lesson => lesson.completed).length;
    return (completedLessons / module.lessons.length) * 100;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'interactive': return Star;
      case 'practice': return Trophy;
      case 'quiz': return CheckCircle;
      default: return Book;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Learning <span className="text-primary">Modules</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Structured learning paths designed to take you from beginner to advanced musician
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const progress = getModuleProgress(module);
          const isExpanded = expandedModule === module.id;
          
          return (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <Badge className={`text-xs ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </Badge>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3">{module.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.estimatedHours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Book className="h-3 w-3" />
                        {module.lessons.length} lessons
                      </span>
                      {module.instructor && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {module.instructor}
                        </span>
                      )}
                      {module.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {module.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium mb-1">
                      {Math.round(progress)}% Complete
                    </div>
                    <Progress value={progress} className="w-24" />
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {module.lessons.map((lesson, index) => {
                          const LessonIcon = getLessonIcon(lesson.type);
                          
                          return (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                lesson.completed 
                                  ? 'bg-green-50 border-green-200' 
                                  : lesson.locked 
                                    ? 'bg-gray-50 border-gray-200 opacity-60' 
                                    : 'hover:bg-muted/50 border-border'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`p-2 rounded-full ${
                                  lesson.completed 
                                    ? 'bg-green-100' 
                                    : lesson.locked 
                                      ? 'bg-gray-100' 
                                      : 'bg-primary/10'
                                }`}>
                                  {lesson.locked ? (
                                    <Lock className="h-4 w-4 text-gray-400" />
                                  ) : lesson.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <LessonIcon className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className={`font-medium ${lesson.locked ? 'text-gray-400' : ''}`}>
                                    {lesson.title}
                                  </h4>
                                  {lesson.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {lesson.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {lesson.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {lesson.duration} min
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                variant={lesson.completed ? "outline" : "default"}
                                disabled={lesson.locked}
                                onClick={() => startLesson(lesson.id)}
                                className="ml-4"
                              >
                                {lesson.completed ? 'Review' : lesson.locked ? 'Locked' : 'Start'}
                              </Button>
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      {module.prerequisites && module.prerequisites.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Prerequisites:</strong> {module.prerequisites.join(', ')}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* TODO: Add course completion certificate section */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Complete Your Learning Journey</h3>
          <p className="text-muted-foreground mb-4">
            Finish all modules to earn your certificate and unlock advanced content
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            View Certificate Requirements
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// TODO: Replace with actual course data from database
const defaultModules: Module[] = [
  {
    id: 'foundations',
    title: 'Music Foundations',
    description: 'Learn the basic building blocks of music theory, rhythm, and notation',
    difficulty: 'beginner',
    estimatedHours: 8,
    instructor: 'Saem\'s Tunes',
    rating: 4.9,
    enrolledStudents: 1247,
    lessons: [
      {
        id: 'notes-scales',
        title: 'Understanding Notes and Scales',
        duration: 25,
        type: 'video',
        completed: true,
        locked: false,
        description: 'Learn the musical alphabet and basic scale construction'
      },
      {
        id: 'rhythm-basics',
        title: 'Rhythm and Time Signatures',
        duration: 30,
        type: 'interactive',
        completed: true,
        locked: false,
        description: 'Master basic rhythm patterns and counting'
      },
      {
        id: 'chord-theory',
        title: 'Introduction to Chords',
        duration: 35,
        type: 'video',
        completed: false,
        locked: false,
        description: 'Build your first chords and understand harmony'
      },
      {
        id: 'foundations-quiz',
        title: 'Foundations Assessment',
        duration: 15,
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge of music fundamentals'
      }
    ]
  },
  {
    id: 'guitar-basics',
    title: 'Guitar Fundamentals', 
    description: 'Master the guitar from holding it properly to playing your first songs',
    difficulty: 'beginner',
    estimatedHours: 12,
    instructor: 'Saem\'s Tunes',
    rating: 4.8,
    enrolledStudents: 892,
    prerequisites: ['Music Foundations'],
    lessons: [
      {
        id: 'guitar-setup',
        title: 'Guitar Setup and Posture',
        duration: 20,
        type: 'video',
        completed: false,
        locked: false,
        description: 'Proper guitar positioning and tuning'
      },
      {
        id: 'first-chords',
        title: 'Your First Chords',
        duration: 45,
        type: 'interactive',
        completed: false,
        locked: false,
        description: 'Learn G, C, and D chords with proper fingering'
      },
      {
        id: 'strumming-patterns',
        title: 'Basic Strumming Patterns',
        duration: 30,
        type: 'practice',
        completed: false,
        locked: false,
        description: 'Develop rhythm and strumming techniques'
      },
      {
        id: 'first-song',
        title: 'Play Your First Song',
        duration: 40,
        type: 'video',
        completed: false,
        locked: true,
        description: 'Put it all together with a complete song'
      }
    ]
  },
  {
    id: 'advanced-techniques',
    title: 'Advanced Performance',
    description: 'Advanced techniques for experienced musicians ready to perform',
    difficulty: 'advanced',
    estimatedHours: 20,
    instructor: 'Saem\'s Tunes',
    rating: 4.7,
    enrolledStudents: 234,
    prerequisites: ['Music Foundations', 'Guitar Fundamentals'],
    lessons: [
      {
        id: 'fingerpicking',
        title: 'Fingerpicking Mastery',
        duration: 60,
        type: 'practice',
        completed: false,
        locked: true,
        description: 'Advanced fingerpicking patterns and techniques'
      },
      {
        id: 'improvisation',
        title: 'Musical Improvisation',
        duration: 50,
        type: 'interactive',
        completed: false,
        locked: true,
        description: 'Learn to improvise and create music spontaneously'
      },
      {
        id: 'performance-prep',
        title: 'Performance Preparation',
        duration: 45,
        type: 'video',
        completed: false,
        locked: true,
        description: 'Stage presence and performance techniques'
      }
    ]
  }
];

export default CourseModule;
