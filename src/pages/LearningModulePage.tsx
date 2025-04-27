
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Play, Clock, BookOpen, Music, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import BreathingTechniquesModule from '@/components/learning/BreathingTechniquesModule';

// Mock data for modules
const modulesData = {
  'breathing-techniques': {
    id: 'breathing-techniques',
    title: 'Breathing Techniques for Musicians',
    description: 'Learn proper breathing techniques essential for wind instruments and vocal performance.',
    progress: 35,
    component: BreathingTechniquesModule,
    sections: [
      {
        id: 'introduction',
        title: 'Introduction to Breathing',
        completed: true,
      },
      {
        id: 'diaphragmatic-breathing',
        title: 'Diaphragmatic Breathing',
        completed: true,
      },
      {
        id: 'breath-control',
        title: 'Breath Control Exercises',
        completed: false,
      },
      {
        id: 'practical-applications',
        title: 'Practical Applications',
        completed: false,
      },
      {
        id: 'advanced-techniques',
        title: 'Advanced Techniques',
        completed: false,
      }
    ]
  },
  // Additional modules can be added here
};

const LearningModulePage = () => {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState(0);
  const [module, setModule] = useState<any>(null);
  
  useEffect(() => {
    if (id && modulesData[id as keyof typeof modulesData]) {
      setModule(modulesData[id as keyof typeof modulesData]);
    }
  }, [id]);

  if (!module) {
    return (
      <MainLayout>
        <div className="container py-8">
          <h1 className="text-2xl font-bold">Module not found</h1>
          <p className="mt-2">The requested learning module could not be found.</p>
          <Link to="/learning-hub">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Learning Hub
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const ModuleComponent = module.component;

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          {/* Module header */}
          <div className="flex flex-col gap-2">
            <Link to="/learning-hub" className="text-muted-foreground hover:text-foreground transition-colors flex items-center w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Learning Hub
            </Link>
            
            <h1 className="text-3xl font-serif font-bold">{module.title}</h1>
            <p className="text-muted-foreground">{module.description}</p>
            
            <div className="flex items-center gap-2 mt-2">
              <Progress value={module.progress} className="h-2" />
              <span className="text-sm text-muted-foreground">{module.progress}% Complete</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navigation sidebar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Module Sections</CardTitle>
                <CardDescription>Navigate through the sections</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav>
                  <ul className="space-y-1 p-2">
                    {module.sections.map((section: any, index: number) => (
                      <li 
                        key={section.id}
                        className={cn(
                          "p-2 rounded-md cursor-pointer flex items-center gap-2",
                          activeSection === index && "bg-accent",
                          section.completed && "text-green-600"
                        )}
                        onClick={() => setActiveSection(index)}
                      >
                        {section.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{section.title}</span>
                      </li>
                    ))}
                  </ul>
                </nav>
              </CardContent>
            </Card>
            
            {/* Module content */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {module.sections[activeSection].title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ModuleComponent 
                    sectionId={module.sections[activeSection].id}
                    onComplete={() => {
                      // Mark current section as completed
                      const updatedModule = {...module};
                      updatedModule.sections[activeSection].completed = true;
                      setModule(updatedModule);
                    }}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  disabled={activeSection === 0}
                  onClick={() => setActiveSection(prev => prev - 1)}
                >
                  Previous Section
                </Button>
                
                <Button
                  disabled={activeSection === module.sections.length - 1}
                  onClick={() => setActiveSection(prev => prev + 1)}
                  className="bg-gold hover:bg-gold-dark"
                >
                  Next Section
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related resources */}
          <Card>
            <CardHeader>
              <CardTitle>Related Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-start gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Reading Materials</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-start gap-2">
                  <Music className="h-4 w-4" />
                  <span>Practice Exercises</span>
                </Button>
                <Button variant="outline" className="flex items-center justify-start gap-2">
                  <Award className="h-4 w-4" />
                  <span>Assessment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default LearningModulePage;
