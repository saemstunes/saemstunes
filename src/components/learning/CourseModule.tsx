
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  CheckCircle, 
  Lock, 
  Clock, 
  BookOpen, 
  Award,
  Music,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  video_url?: string;
  content_type: 'video' | 'interactive' | 'quiz' | 'practice';
  is_completed: boolean;
  is_locked: boolean;
  order: number;
}

export interface CourseModuleData {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number; // total minutes
  lessons: Lesson[];
  prerequisites?: string[];
  skills_learned: string[];
  completion_percentage: number;
  is_enrolled: boolean;
}

interface CourseModuleProps {
  module: CourseModuleData;
  onEnroll?: (moduleId: string) => void;
  onLessonClick?: (lessonId: string, moduleId: string) => void;
}

const CourseModule: React.FC<CourseModuleProps> = ({ 
  module, 
  onEnroll, 
  onLessonClick 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const completedLessons = module.lessons.filter(lesson => lesson.is_completed).length;
  const totalLessons = module.lessons.length;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4" />;
      case 'interactive': return <Music className="h-4 w-4" />;
      case 'quiz': return <BookOpen className="h-4 w-4" />;
      case 'practice': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.is_locked) return;
    
    if (onLessonClick) {
      onLessonClick(lesson.id, module.id);
    } else {
      navigate(`/learning-hub/lesson/${lesson.id}`);
    }
  };

  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(module.id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <Badge className={getLevelColor(module.level)}>
                {module.level}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {module.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.floor(module.estimated_duration / 60)}h {module.estimated_duration % 60}m
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {totalLessons} lessons
              </span>
              {module.is_enrolled && (
                <span className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {completedLessons}/{totalLessons} completed
                </span>
              )}
            </div>
          </div>
          
          {!module.is_enrolled ? (
            <Button onClick={handleEnroll} className="bg-gold hover:bg-gold/90">
              Enroll Now
            </Button>
          ) : (
            <div className="text-right">
              <div className="text-sm font-medium mb-1">
                {module.completion_percentage}% Complete
              </div>
              <Progress value={module.completion_percentage} className="w-24" />
            </div>
          )}
        </div>
        
        {module.is_enrolled && (
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-center mt-2"
          >
            {isExpanded ? 'Hide Lessons' : 'View Lessons'}
          </Button>
        )}
      </CardHeader>

      {isExpanded && module.is_enrolled && (
        <CardContent>
          <div className="space-y-3">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Skills You'll Learn:</h4>
              <div className="flex flex-wrap gap-1">
                {module.skills_learned.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Lessons:</h4>
              {module.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      lesson.is_locked 
                        ? 'bg-muted/50 cursor-not-allowed' 
                        : 'hover:bg-accent cursor-pointer'
                    }`}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {lesson.is_completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : lesson.is_locked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          getContentTypeIcon(lesson.content_type)
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h5 className={`text-sm font-medium ${
                          lesson.is_locked ? 'text-muted-foreground' : ''
                        }`}>
                          {lesson.title}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {lesson.duration}m
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CourseModule;
