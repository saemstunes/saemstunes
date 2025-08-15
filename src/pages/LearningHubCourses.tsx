import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearningHubCourses = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: "vocal",
      name: "Vocal Training",
      description: "Master breathing, range, and performance techniques",
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      courses: 12,
      color: "bg-gradient-to-br from-blue-400 to-indigo-600"
    },
    {
      id: "theory",
      name: "Music Theory",
      description: "Understand scales, chords, and composition",
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      courses: 8,
      color: "bg-gradient-to-br from-purple-400 to-pink-600"
    },
    {
      id: "instrument",
      name: "Instruments",
      description: "Learn piano, guitar, and percussion techniques",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      courses: 15,
      color: "bg-gradient-to-br from-green-400 to-teal-600"
    },
    {
      id: "production",
      name: "Music Production",
      description: "Record, mix, and master your tracks",
      icon: <BookOpen className="h-6 w-6 text-yellow-500" />,
      courses: 7,
      color: "bg-gradient-to-br from-yellow-400 to-orange-600"
    }
  ];

  const popularCourses = [
    {
      id: "vocal-basics",
      title: "Vocal Fundamentals",
      description: "Build a strong vocal foundation",
      level: "Beginner",
      duration: "4 weeks",
      lessons: 12,
      instructor: "Sarah K.",
      rating: 4.9
    },
    {
      id: "piano-chords",
      title: "Piano Chords Mastery",
      description: "Learn all essential chords and progressions",
      level: "Intermediate",
      duration: "6 weeks",
      lessons: 18,
      instructor: "Michael T.",
      rating: 4.8
    },
    {
      id: "music-theory-101",
      title: "Music Theory Essentials",
      description: "Understand scales, keys, and harmony",
      level: "Beginner",
      duration: "3 weeks",
      lessons: 9,
      instructor: "David M.",
      rating: 4.7
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-serif font-bold text-gold-dark mb-6">All Courses</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`group transition-all hover:shadow-lg ${category.color} bg-opacity-10`}
            >
              <CardHeader>
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-opacity-20 mr-3">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="gold" 
                  className="w-full"
                  onClick={() => navigate(`/learning-hub/courses/${category.id}`)}
                >
                  Explore {category.courses} Courses
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-gold/10 to-transparent p-6 rounded-xl mb-10">
          <h3 className="text-xl font-serif font-bold text-gold-dark mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-gold" />
            Popular Courses
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCourses.map((course) => (
              <Card key={course.id} className="group transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="bg-muted px-2 py-1 rounded-full">{course.level}</span>
                    <span>{course.duration} • {course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{course.instructor}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-gold fill-current mr-1" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-gold group-hover:text-white"
                    onClick={() => navigate(`/learning-hub/${course.id}`)}
                  >
                    View Course
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            variant="gold" 
            className="mx-auto"
            onClick={() => navigate("/learning-hub")}
          >
            <Play className="h-4 w-4 mr-2" /> Start Your Learning Path
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningHubCourses;
