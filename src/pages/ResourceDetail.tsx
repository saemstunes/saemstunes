import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Lock, BookOpen, Play, ImageIcon, Volume2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { resourcesService } from "@/lib/supabase/resources";
import { Resource } from "@/types/resource";
import { useSubscription } from "@/context/SubscriptionContext";

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadResource();
    }
  }, [id]);

  const loadResource = async () => {
    try {
      setLoading(true);
      const resourceData = await resourcesService.getResource(id as string);
      setResource(resourceData);
      
      // Load related resources
      const related = await resourcesService.getResources({
        subject_category: resourceData.subject_category,
        level: resourceData.level
      });
      
      // Filter out current resource and limit to 3
      setRelatedResources(
        related
          .filter(r => r.id !== resourceData.id)
          .slice(0, 3)
      );
    } catch (error) {
      console.error("Error loading resource:", error);
      toast({
        title: "Error",
        description: "Failed to load resource details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName: string | undefined) => {
    switch (categoryName) {
      case "videos":
        return <Play className="h-5 w-5" />;
      case "infographics":
        return <ImageIcon className="h-5 w-5" />;
      case "audios":
        return <Volume2 className="h-5 w-5" />;
      case "documents":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Check if user can access the resource
  const canAccessResource = () => {
    if (!resource) return false;
    if (!resource.is_locked) return true;
    if (!user) return false;
    
    switch (resource.access_level) {
      case 'free':
        return true;
      case 'auth':
        return !!user;
      case 'basic':
        return subscription?.tier === 'basic' || subscription?.tier === 'premium' || subscription?.tier === 'professional';
      case 'premium':
        return subscription?.tier === 'premium' || subscription?.tier === 'professional';
      case 'professional':
        return subscription?.tier === 'professional';
      default:
        return false;
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your resource is being downloaded.",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4">Loading resource...</p>
        </div>
      </MainLayout>
    );
  }

  if (!resource) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium">Resource Not Found</h2>
          <p className="text-muted-foreground mt-2">The resource you're looking for does not exist.</p>
          <Button 
            onClick={() => navigate("/resources")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/resources")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Resources
      </Button>

      {canAccessResource() ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="rounded-lg overflow-hidden mb-6 bg-muted aspect-video flex items-center justify-center">
              {resource.category_name === "videos" ? (
                <iframe
                  src={resource.resource_url}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title={resource.title}
                />
              ) : (
                <img 
                  src={resource.thumbnail_url} 
                  alt={resource.title} 
                  className="w-full h-auto object-cover" 
                />
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                {getCategoryIcon(resource.category_name)}
              </div>
              <h1 className="text-2xl font-serif font-bold">{resource.title}</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-muted text-muted-foreground capitalize">
                {resource.level}
              </Badge>
              <Badge variant="outline">{resource.subject_category}</Badge>
              {resource.instructor && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Instructor: {resource.instructor}
                </Badge>
              )}
              {resource.duration && (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Duration: {resource.duration}
                </Badge>
              )}
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed">{resource.description}</p>
              
              {resource.tags && resource.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                className="bg-gold hover:bg-gold/90 text-white flex-1 sm:flex-none"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resource
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => navigate(`/resources?category=${resource.subject_category}`)}
              >
                View Related Resources
              </Button>
            </div>
          </div>

          <div className="col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Related Resources</h3>
                
                <div className="space-y-4">
                  {relatedResources.length > 0 ? (
                    relatedResources.map(relatedResource => (
                      <div 
                        key={relatedResource.id}
                        className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                        onClick={() => navigate(`/resources/${relatedResource.id}`)}
                      >
                        <div className="relative w-24 h-16 overflow-hidden rounded">
                          <img 
                            src={relatedResource.thumbnail_url} 
                            alt={relatedResource.title} 
                            className="object-cover w-full h-full" 
                          />
                          {relatedResource.is_locked && !canAccessResource() && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-gold text-white text-xs">Premium</Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-2">{relatedResource.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{relatedResource.subject_category}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No related resources found.</p>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/resources")}
                >
                  View All Resources
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Learning Path</h3>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/resources?category=${resource.subject_category}&level=beginner`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Beginner Resources
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/resources?category=${resource.subject_category}&level=intermediate`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Intermediate Resources
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/resources?category=${resource.subject_category}&level=advanced`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Advanced Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-medium mt-4">Premium Content</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            This resource requires a {resource.access_level} subscription. Upgrade your account to access all content.
          </p>
          <Button 
            onClick={() => navigate("/subscriptions")}
            className="mt-6 bg-gold hover:bg-gold/90 text-white"
          >
            Upgrade Now
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default ResourceDetail;
