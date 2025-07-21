
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, Play, Lock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  lesson_count: number;
  rating: number;
  price: number;
  is_free: boolean;
  thumbnail_url?: string;
  access_level: 'free' | 'basic' | 'premium';
  category: string;
}

const CourseCatalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Piano Fundamentals',
          description: 'Learn the basics of piano playing from scratch',
          instructor: 'Sarah Johnson',
          difficulty: 'beginner',
          duration: 3600,
          lesson_count: 12,
          rating: 4.8,
          price: 49.99,
          is_free: false,
          access_level: 'basic',
          category: 'Piano',
          thumbnail_url: '/placeholder.svg'
        },
        {
          id: '2',
          title: 'Guitar Mastery',
          description: 'Advanced guitar techniques and theory',
          instructor: 'Mike Rodriguez',
          difficulty: 'advanced',
          duration: 7200,
          lesson_count: 24,
          rating: 4.9,
          price: 99.99,
          is_free: false,
          access_level: 'premium',
          category: 'Guitar',
          thumbnail_url: '/placeholder.svg'
        },
        {
          id: '3',
          title: 'Music Theory Basics',
          description: 'Understanding the fundamentals of music theory',
          instructor: 'Dr. Lisa Brown',
          difficulty: 'beginner',
          duration: 1800,
          lesson_count: 8,
          rating: 4.7,
          price: 0,
          is_free: true,
          access_level: 'free',
          category: 'Theory',
          thumbnail_url: '/placeholder.svg'
        }
      ];
      
      setCourses(mockCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.difficulty === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'advanced': return 'bg-red-500/10 text-red-700 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAccessBadge = (accessLevel: string, isFree: boolean) => {
    if (isFree) return <Badge className="bg-green-500/10 text-green-700">Free</Badge>;
    
    switch (accessLevel) {
      case 'basic': return <Badge className="bg-blue-500/10 text-blue-700">Basic</Badge>;
      case 'premium': return <Badge className="bg-gold/10 text-gold-dark">Premium</Badge>;
      default: return null;
    }
  };

  const canAccessCourse = (course: Course) => {
    if (course.is_free) return true;
    if (!user) return false;
    // Add subscription check logic here
    return true;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
              <div className="aspect-video bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Course Catalog</h1>
        <p className="text-muted-foreground">
          Discover comprehensive music courses from beginner to advanced levels
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Piano">Piano</SelectItem>
            <SelectItem value="Guitar">Guitar</SelectItem>
            <SelectItem value="Theory">Theory</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail_url || '/placeholder.svg'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button 
                      size="sm" 
                      className="w-full bg-gold hover:bg-gold-dark"
                      disabled={!canAccessCourse(course)}
                    >
                      {canAccessCourse(course) ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Course
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Subscribe to Access
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {getAccessBadge(course.access_level, course.is_free)}
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1 mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.lesson_count} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(course.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    by {course.instructor}
                  </span>
                  {!course.is_free && (
                    <span className="font-semibold text-gold">
                      ${course.price}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
