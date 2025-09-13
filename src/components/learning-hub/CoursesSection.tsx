import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Lock, Star, Users, Clock, BookOpen } from 'lucide-react';
import { ACCESS_LEVELS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';

interface CoursesSectionProps {
  courses: any[];
  categories: any[];
  userProgress: Record<string, number>;
  searchTerm: string;
  categoryFilter: string;
  levelFilter: string;
  sortBy: string;
  onCourseSelect: (courseId: string) => void;
}

const CoursesSection = ({
  courses,
  categories,
  userProgress,
  searchTerm,
  categoryFilter,
  levelFilter,
  sortBy,
  onCourseSelect
}: CoursesSectionProps) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || course.category_id === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'popular':
        return b.enrollment_count - a.enrollment_count;
      case 'rating':
        return b.average_rating - a.average_rating;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getAccessStatus = (course: any) => {
    const requiredLevel = course.access_level || 'free';
    const userLevel = user?.subscriptionTier || subscription?.tier || 'free';
    
    if (requiredLevel === 'free') return true;
    if (!user) return false;
    
    const accessLevels = ['free', 'basic', 'premium', 'professional'];
    return accessLevels.indexOf(userLevel) >= accessLevels.indexOf(requiredLevel);
  };

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No courses found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map(course => {
        const progress = userProgress[course.id] || 0;
        const hasAccess = getAccessStatus(course);
        const category = categories.find(c => c.id === course.category_id);

        return (
          <Card key={course.id} className="group transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="aspect-video bg-muted rounded-md relative overflow-hidden mb-3">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                {!hasAccess && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate max-w-[70%]">{course.title}</span>
                {course.access_level !== 'free' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground">
                    {course.access_level}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="truncate">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {course.instructor?.name?.charAt(0) || 'I'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      {course.instructor?.name || 'Instructor'}
                    </p>
                    <p className="text-xs font-medium truncate">
                      {category?.title || 'Uncategorized'}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                  {course.level}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{course.enrollment_count} enrolled</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                  <span>{course.average_rating}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{course.duration} min</span>
                </div>
              </div>

              {progress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{progress}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full"
                variant={hasAccess ? "default" : "outline"}
                onClick={() => onCourseSelect(course.id)}
                disabled={!hasAccess}
              >
                {hasAccess ? (
                  progress > 0 ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </>
                  ) : (
                    "Start Learning"
                  )
                ) : (
                  "Upgrade to Access"
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default CoursesSection;