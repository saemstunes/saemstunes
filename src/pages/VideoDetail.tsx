
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { mockVideos } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, User, BookOpen, Lock } from "lucide-react";
import { canAccessContent, getAccessLevelLabel } from "@/lib/contentAccess";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const video = mockVideos.find((v) => v.id === id);
  
  if (!video) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium">Video Not Found</h2>
          <p className="text-muted-foreground mt-2">The video you're looking for does not exist.</p>
          <Button 
            onClick={() => navigate("/videos")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Check if user can access video using new access control system
  const userSubscriptionTier = user?.subscriptionTier || 'free';
  const canAccessVideo = canAccessContent(video.accessLevel, user, userSubscriptionTier);

  return (
    <MainLayout>
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/videos")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Videos
      </Button>

      {canAccessVideo ? (
        <>
          <div className="aspect-video mb-6 overflow-hidden rounded-lg">
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <h1 className="text-2xl font-serif font-bold mb-2">{video.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-muted text-muted-foreground capitalize">
                  {video.level}
                </Badge>
                <Badge variant="outline">{video.category}</Badge>
                {video.accessLevel !== 'free' && (
                  <Badge className="bg-gold text-white">
                    {getAccessLevelLabel(video.accessLevel)}
                  </Badge>
                )}
                <div className="flex items-center text-sm text-muted-foreground ml-auto">
                  <Clock className="h-4 w-4 mr-1" />
                  {video.duration}
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-base leading-relaxed">{video.description}</p>
              </div>
              
              <div className="flex items-center mt-6 mb-8">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">Instructor:</span>
                  <span className="ml-1 text-sm font-medium">{video.instructor}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {video.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">More in this Series</h3>
                  
                  <div className="space-y-4">
                    {mockVideos
                      .filter(v => 
                        v.id !== video.id && 
                        (v.category === video.category || v.level === video.level)
                      )
                      .slice(0, 3)
                      .map(relatedVideo => (
                        <div 
                          key={relatedVideo.id}
                          className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                          onClick={() => navigate(`/videos/${relatedVideo.id}`)}
                        >
                          <div className="relative w-24 h-16 overflow-hidden rounded">
                            <img 
                              src={relatedVideo.thumbnailUrl} 
                              alt={relatedVideo.title} 
                              className="object-cover w-full h-full" 
                            />
                            {relatedVideo.isLocked && (!user || !user.subscribed) && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge className="bg-gold text-white text-xs">Premium</Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-2">{relatedVideo.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{relatedVideo.duration}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate("/videos")}
                  >
                    View All Videos
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Resources</h3>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Lesson Notes
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book a Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-medium mt-4">{getAccessLevelLabel(video.accessLevel)} Content</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {video.accessLevel === 'auth' 
              ? "Please sign in to access this content"
              : user 
                ? `${getAccessLevelLabel(video.accessLevel)} subscription required to access this content`
                : `Please sign in and subscribe to ${getAccessLevelLabel(video.accessLevel)} to access this content`
            }
          </p>
          <div className="flex gap-4 justify-center mt-6">
            {!user && (
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gold hover:bg-gold-dark text-white"
              >
                Sign In
              </Button>
            )}
            {video.accessLevel !== 'auth' && (
              <Button 
                onClick={() => navigate("/subscriptions")}
                className="bg-gold hover:bg-gold-dark text-white"
              >
                {user ? 'Upgrade Now' : 'Subscribe'}
              </Button>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default VideoDetail;
