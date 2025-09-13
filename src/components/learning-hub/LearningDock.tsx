import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Play, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LearningDockProps {
  courses: any[];
  resources: any[];
  userProgress: Record<string, number>;
  userResourceInteractions: Record<string, any>;
  onContentSelect: (contentId: string, contentType: 'course' | 'resource', action: string) => void;
}

const LearningDock = ({
  courses,
  resources,
  userProgress,
  userResourceInteractions,
  onContentSelect
}: LearningDockProps) => {
  const { user } = useAuth();

  // Get recent courses in progress
  const coursesInProgress = courses
    .filter(course => userProgress[course.id] > 0 && userProgress[course.id] < 100)
    .sort((a, b) => userProgress[b.id] - userProgress[a.id])
    .slice(0, 3);

  // Get recently accessed resources
  const recentResources = resources
    .filter(resource => userResourceInteractions[resource.id]?.viewed)
    .sort((a, b) => {
      const aTime = new Date(userResourceInteractions[a.id]?.last_accessed || 0).getTime();
      const bTime = new Date(userResourceInteractions[b.id]?.last_accessed || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 3);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Sign in to track your learning progress
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-xs">
            <span>Courses Started</span>
            <span>{Object.keys(userProgress).length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Resources Viewed</span>
            <span>{Object.keys(userResourceInteractions).filter(id => userResourceInteractions[id]?.viewed).length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Bookmarked</span>
            <span>{Object.keys(userResourceInteractions).filter(id => userResourceInteractions[id]?.bookmarked).length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Courses in Progress */}
      {coursesInProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Continue Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {coursesInProgress.map(course => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium truncate flex-1">
                    {course.title}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {userProgress[course.id]}%
                  </span>
                </div>
                <Progress value={userProgress[course.id]} className="h-1" />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-6"
                  onClick={() => onContentSelect(course.id, 'course', 'view')}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Continue
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Resources */}
      {recentResources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Recent Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentResources.map(resource => (
              <div key={resource.id} className="space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium truncate flex-1">
                    {resource.title}
                  </span>
                  <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-6"
                  onClick={() => onContentSelect(resource.id, 'resource', 'view')}
                >
                  View Again
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningDock;