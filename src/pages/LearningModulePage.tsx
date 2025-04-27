
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import BreathingTechniquesModule from "@/components/learning/BreathingTechniquesModule";

// In a real app, this would be fetched from an API
const modules = {
  "breathing-techniques": {
    id: "breathing-techniques",
    title: "Breathing Techniques",
    description: "Learn proper diaphragmatic breathing for singing",
    component: BreathingTechniquesModule
  }
};

const LearningModulePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Get the module data based on the ID
  const moduleData = id ? modules[id as keyof typeof modules] : null;
  
  // Simulate loading module data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleModuleComplete = () => {
    toast({
      title: "Module Completed!",
      description: "Congratulations on completing this module. Your progress has been saved.",
    });
    
    // In a real app, this would update the user's progress in the database
    setProgress(100);
  };
  
  const handleModuleProgress = (progressPercentage: number) => {
    setProgress(progressPercentage);
  };
  
  // If the module doesn't exist, redirect to the learning hub
  if (id && !moduleData && !loading) {
    navigate("/learning-hub");
    return null;
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/learning-hub">Learning Hub</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{loading ? "Loading..." : moduleData?.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex justify-between items-start">
          <div>
            {loading ? (
              <>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-serif font-bold">{moduleData?.title}</h1>
                <p className="text-muted-foreground">{moduleData?.description}</p>
              </>
            )}
          </div>
          <Button variant="outline" onClick={() => navigate("/learning-hub")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Learning Hub
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Module Progress</span>
            <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} />
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : (
          <div>
            {moduleData?.component && (
              <moduleData.component 
                onComplete={handleModuleComplete}
                onProgress={handleModuleProgress}
              />
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LearningModulePage;
