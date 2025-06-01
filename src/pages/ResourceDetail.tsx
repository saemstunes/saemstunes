
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { mockInfographics } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Lock, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const infographic = mockInfographics.find((r) => r.id === id);
  
  if (!infographic) {
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

  // Check if user can access the resource - using profile.role as proxy for subscription
  const canAccessResource = !infographic.isLocked || (profile && (profile.role === 'admin' || profile.role === 'tutor'));

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your resource is being downloaded.",
    });
  };

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

      {canAccessResource ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={infographic.imageUrl} 
                alt={infographic.title} 
                className="w-full h-auto object-cover" 
              />
            </div>
            
            <h1 className="text-2xl font-serif font-bold mb-2">{infographic.title}</h1>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-muted text-muted-foreground capitalize">
                {infographic.level}
              </Badge>
              <Badge variant="outline">{infographic.category}</Badge>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed">{infographic.description}</p>
              <p className="mt-4 leading-relaxed">
                This infographic provides a visual reference that you can use during your practice sessions. 
                Download it and keep it handy for quick reference while learning.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                className="bg-gold hover:bg-gold-dark text-white flex-1 sm:flex-none"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Infographic
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => navigate("/videos")}
              >
                View Related Videos
              </Button>
            </div>
          </div>

          <div className="col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Related Resources</h3>
                
                <div className="space-y-4">
                  {mockInfographics
                    .filter(r => 
                      r.id !== infographic.id && 
                      (r.category === infographic.category || r.level === infographic.level)
                    )
                    .slice(0, 3)
                    .map(relatedResource => (
                      <div 
                        key={relatedResource.id}
                        className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                        onClick={() => navigate(`/resources/${relatedResource.id}`)}
                      >
                        <div className="relative w-24 h-16 overflow-hidden rounded">
                          <img 
                            src={relatedResource.imageUrl} 
                            alt={relatedResource.title} 
                            className="object-cover w-full h-full" 
                          />
                          {relatedResource.isLocked && (!profile || (profile.role !== 'admin' && profile.role !== 'tutor')) && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-gold text-white text-xs">Premium</Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-2">{relatedResource.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{relatedResource.category}</p>
                        </div>
                      </div>
                    ))}
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
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Suggested Videos
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
            This resource is only available to premium subscribers. Upgrade your account to access all content.
          </p>
          <Button 
            onClick={() => navigate("/subscriptions")}
            className="mt-6 bg-gold hover:bg-gold-dark text-white"
          >
            Upgrade Now
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default ResourceDetail;
