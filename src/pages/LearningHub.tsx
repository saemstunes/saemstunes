import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Play, Trophy, CheckCircle, ChevronRight, Music, 
  Pin, History, Settings, Video, Users, Star, Download, Share2, Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { gsap } from "gsap";
import { useSpring, animated } from "@react-spring/web";
import SplitText from "@/gsap/SplitText";
import CircularText from "@/components/learning-hub/CircularText";
import FlowingMenu from "@/components/learning-hub/FlowingMenu";
import Folder from "@/components/learning-hub/Folder";
import DarkVeil from "@/components/learning-hub/DarkVeil";
import PillNav from "@/components/learning-hub/PillNav";
import PreviewModal from "@/components/learning-hub/PreviewModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const LearningHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-path");
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedFolder, setExpandedFolder] = useState(null);
  const [mobileDockOpen, setMobileDockOpen] = useState(false);
  const dockRef = useRef(null);
  const folderRefs = useRef([]);

  // Animated title with session-based animation
  const [titleAnimated, setTitleAnimated] = useState(false);
  const titleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 800 },
    immediate: !titleAnimated || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  });

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem("titleAnimated");
    if (!hasAnimated) {
      setTitleAnimated(true);
      sessionStorage.setItem("titleAnimated", "true");
    }
    
    // Folder stagger animation
    gsap.from(folderRefs.current, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.3
    });
  }, []);

  // Enhanced data model with musical categories
  const learningCategories = [
    {
      id: "vocal-techniques",
      title: "Vocal Techniques",
      description: "Master breathing, pitch, and tone control",
      icon: <Music className="h-6 w-6" />,
      color: "bg-blue-500",
      courses: [
        {
          id: "breathing-techniques",
          title: "Diaphragmatic Breathing",
          description: "Proper breathing for powerful vocals",
          progress: user ? 100 : 0,
          lessons: 4,
          duration: 32,
          level: "beginner",
          accessLevel: "free",
          instructor: { 
            id: "sarah-k", 
            name: "Sarah K.", 
            avatar: "/instructors/sarah.jpg" 
          },
          preview: {
            type: "video",
            url: "/previews/vocal-breathing.mp4",
            duration: 90
          }
        },
        {
          id: "vocal-range",
          title: "Range Extension",
          description: "Safely expand your vocal range",
          progress: user ? 75 : 0,
          lessons: 6,
          duration: 45,
          level: "intermediate",
          accessLevel: "pro",
          instructor: { 
            id: "mike-t", 
            name: "Mike T.", 
            avatar: "/instructors/mike.jpg" 
          },
          preview: {
            type: "audio",
            url: "/previews/vocal-range.mp3",
            duration: 60
          }
        }
      ]
    },
    {
      id: "music-theory",
      title: "Music Theory",
      description: "Understand notation, harmony, and composition",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-purple-500",
      courses: [
        {
          id: "chord-progressions",
          title: "Chord Progressions",
          description: "Create emotional movement in your music",
          progress: user ? 30 : 0,
          lessons: 5,
          duration: 38,
          level: "intermediate",
          accessLevel: "subscriber",
          instructor: { 
            id: "david-m", 
            name: "David M.", 
            avatar: "/instructors/david.jpg" 
          },
          preview: {
            type: "text",
            content: "Chord progressions form the backbone of musical harmony..."
          }
        }
      ]
    },
    {
      id: "performance",
      title: "Stage Performance",
      description: "Command the stage with confidence",
      icon: <Play className="h-6 w-6" />,
      color: "bg-amber-500",
      courses: [
        {
          id: "stage-presence",
          title: "Stage Presence",
          description: "Connect with your audience authentically",
          progress: user ? 0 : 0,
          lessons: 7,
          duration: 52,
          level: "advanced",
          accessLevel: "pro",
          instructor: { 
            id: "lisa-g", 
            name: "Lisa G.", 
            avatar: "/instructors/lisa.jpg" 
          },
          preview: {
            type: "video",
            url: "/previews/stage-presence.mp4",
            duration: 90
          }
        }
      ]
    }
  ];

  const pinnedCourses = [
    {
      id: "performance-skills",
      title: "Stage Presence",
      description: "Command the stage with confidence",
      progress: 40,
      instructor: { name: "Lisa G." }
    }
  ];

  const achievements = [
    {
      id: "first-lesson",
      title: "First Lesson",
      description: "Completed your first lesson",
      icon: <Play className="h-5 w-5" />,
      unlocked: true,
      progress: 100
    },
    {
      id: "module-master",
      title: "Module Master",
      description: "Completed a full learning module",
      icon: <BookOpen className="h-5 w-5" />,
      unlocked: true,
      progress: 100
    },
    {
      id: "practice-streak",
      title: "Practice Streak",
      description: "Practiced 7 days in a row",
      icon: <Music className="h-5 w-5" />,
      unlocked: false,
      progress: 85
    }
  ];

  const pillNavItems = [
    { id: "my-path", label: "My Path" },
    { id: "all-courses", label: "All Courses" },
    { id: "free-content", label: "Free Content" },
    { id: "live-classes", label: "Live Classes" },
    { id: "new-releases", label: "New Releases" }
  ];

  const handlePreview = (course) => {
    setPreviewData(course);
    setShowPreview(true);
    
    // Analytics event
    trackEvent("preview_opened", { 
      courseId: course.id, 
      accessLevel: course.accessLevel 
    });
  };

  const handleEnroll = (course) => {
    if (!user) {
      navigate(`/auth?next=/learning-hub/${course.id}`);
      return;
    }
    
    if (course.accessLevel === "pro" && user.accessLevel !== "pro") {
      handlePreview(course);
      return;
    }
    
    navigate(`/learning-hub/${course.id}`);
  };

  const getAccessStatus = (course) => {
    if (!user) return { status: "locked", action: "signup" };
    if (course.accessLevel === "pro" && user.accessLevel !== "pro") {
      return { status: "upgrade_required", action: "upgrade" };
    }
    return { status: "granted" };
  };

  const flowingMenuItems = (course) => {
    const access = getAccessStatus(course);
    
    return [
      {
        label: "Preview",
        icon: <Video className="h-4 w-4" />,
        action: () => handlePreview(course),
        disabled: false
      },
      {
        label: "Book 1:1",
        icon: <Users className="h-4 w-4" />,
        action: () => navigate(`/booking/${course.instructor.id}`),
        disabled: !user
      },
      {
        label: access.status === "granted" 
          ? (course.progress > 0 ? "Continue" : "Enroll") 
          : (access.status === "locked" ? "Signup to Access" : "Upgrade Required"),
        icon: access.status === "granted" 
          ? (course.progress > 0 ? <Play className="h-4 w-4" /> : <Star className="h-4 w-4" />) 
          : <CheckCircle className="h-4 w-4" />,
        action: () => access.status === "granted" 
          ? handleEnroll(course) 
          : handlePreview(course),
        disabled: access.status !== "granted"
      },
      {
        label: "Share",
        icon: <Share2 className="h-4 w-4" />,
        action: () => navigator.share?.({
          title: course.title,
          text: `Check out this music course on Saem's Tunes: ${course.description}`,
          url: window.location.href
        }) || navigator.clipboard.writeText(window.location.href),
        disabled: false
      }
    ];
  };

  const trackEvent = (eventName, properties = {}) => {
    console.log(`Tracking: ${eventName}`, {
      userId: user?.id,
      timestamp: new Date().toISOString(),
      ...properties
    });
  };

  const handleFolderToggle = (folderId) => {
    setExpandedFolder(prev => prev === folderId ? null : folderId);
    
    // Animation for folder content
    const folderContent = document.getElementById(`folder-content-${folderId}`);
    if (folderContent) {
      gsap.to(folderContent, {
        height: expandedFolder === folderId ? 0 : "auto",
        opacity: expandedFolder === folderId ? 0 : 1,
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <MainLayout>
      {/* DarkVeil for modals */}
      <DarkVeil 
        isVisible={showPreview} 
        onClick={() => setShowPreview(false)}
        hueShift={120}
        noiseIntensity={0.02}
        speed={0.3}
      />
      
      {/* Preview Modal */}
      {showPreview && previewData && (
        <PreviewModal 
          content={previewData} 
          accessStatus={getAccessStatus(previewData)}
          onClose={() => setShowPreview(false)}
          onSignup={() => navigate(`/auth?next=/learning-hub/${previewData.id}`)}
          onUpgrade={() => navigate("/pricing")}
        />
      )}

      <div className="hub-shell grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6 min-h-screen">
        {/* Header Hero */}
        <header className="col-span-full pt-6 px-4">
          <animated.div style={titleAnimation} className="mb-4">
            <SplitText 
              text="Let's Learn!" 
              className="text-4xl font-serif font-bold text-gold" 
              duration={0.8}
              stagger={0.03}
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
            />
          </animated.div>
          
          <PillNav 
            items={pillNavItems} 
            activeId={activeTab}
            onSelect={setActiveTab}
            className="mb-6"
          />
        </header>

        {/* Left Dock */}
        <aside 
          ref={dockRef}
          className={`left-dock bg-cream/90 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 ${
            mobileDockOpen 
              ? 'fixed inset-0 z-50 bg-cream p-6 overflow-y-auto' 
              : 'hidden lg:block'
          }`}
        >
          {mobileDockOpen && (
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-gold">Your Learning Dock</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileDockOpen(false)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          <div className="dock-content space-y-6">
            <section>
              <h3 className="flex items-center font-medium mb-3 text-gold-dark">
                <Play className="h-4 w-4 mr-2 text-gold" />
                Continue Learning
              </h3>
              <div className="space-y-3">
                {learningCategories.flatMap(cat => cat.courses)
                  .filter(course => course.progress > 0 && course.progress < 100)
                  .slice(0, 2)
                  .map(course => (
                    <Card key={course.id} className="relative group transition-transform hover:-translate-y-0.5">
                      <CardContent className="p-3">
                        <div className="flex items-center">
                          <CircularText 
                            value={course.progress}
                            size={40}
                            strokeWidth={3}
                            className="mr-3 flex-shrink-0"
                            textColor={course.progress === 100 ? "#C69B36" : "#3B82F6"}
                            trailColor="#F8F6F0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm truncate">{course.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {course.instructor.name}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEnroll(course)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
              </div>
            </section>

            <section>
              <h3 className="flex items-center font-medium mb-3 text-gold-dark">
                <Pin className="h-4 w-4 mr-2 text-gold" />
                Pinned Courses
              </h3>
              <div className="space-y-3">
                {pinnedCourses.map(course => (
                  <Card key={course.id} className="relative group transition-transform hover:-translate-y-0.5">
                    <CardContent className="p-3">
                      <div className="flex items-center">
                        <div className="bg-muted border-2 border-dashed rounded-xl w-16 h-16 mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm truncate">{course.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {course.instructor.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => navigate(`/learning-hub/${course.id}`)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h3 className="flex items-center font-medium mb-3 text-gold-dark">
                <History className="h-4 w-4 mr-2 text-gold" />
                Recent Activity
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-muted/20 rounded-lg transition-colors hover:bg-muted/40">
                  <p className="font-medium text-gold-dark">Completed Breathing Techniques</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg transition-colors hover:bg-muted/40">
                  <p className="font-medium text-gold-dark">Earned Module Master badge</p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg transition-colors hover:bg-muted/40">
                  <p className="font-medium text-gold-dark">Pinned Stage Presence course</p>
                  <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="flex items-center font-medium mb-3 text-gold-dark">
                <Settings className="h-4 w-4 mr-2 text-gold" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="gold" size="sm" className="w-full">
                  Book Class
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Browse All
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Help Center
                </Button>
              </div>
            </section>
          </div>
        </aside>

        {/* Center Studio */}
        <main className="center-studio px-4 pb-6">
          <div className="folder-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningCategories.map((category, index) => (
              <div 
                key={category.id} 
                ref={el => folderRefs.current[index] = el}
              >
                <Folder
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  color={category.color}
                  itemCount={category.courses.length}
                  isExpanded={expandedFolder === category.id}
                  onToggle={() => handleFolderToggle(category.id)}
                >
                  <div 
                    id={`folder-content-${category.id}`}
                    className="course-grid grid grid-cols-1 gap-4 mt-4"
                  >
                    {category.courses.map(course => {
                      const access = getAccessStatus(course);
                      
                      return (
                        <Card 
                          key={course.id} 
                          className="course-card relative overflow-hidden group transition-all hover:shadow-lg"
                        >
                          <FlowingMenu 
                            items={flowingMenuItems(course)}
                            trigger="hover"
                            className="absolute top-3 right-3 z-10"
                            mobileBehavior="long-press"
                          />
                          
                          <CardHeader className="pb-3">
                            <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                              {access.status !== "granted" && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                  <Button 
                                    variant="gold"
                                    size="sm"
                                    onClick={() => handlePreview(course)}
                                  >
                                    {access.status === "locked" 
                                      ? "Unlock Preview" 
                                      : "Upgrade to Access"}
                                  </Button>
                                </div>
                              )}
                            </div>
                            <CardTitle className="flex items-center justify-between">
                              <span className="truncate max-w-[70%]">{course.title}</span>
                              {course.accessLevel !== "free" && (
                                <span className="text-xs bg-gold/20 text-gold-dark px-2 py-1 rounded-full flex-shrink-0">
                                  {course.accessLevel === "pro" ? "PRO" : "PREMIUM"}
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription className="truncate">{course.description}</CardDescription>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <CircularText 
                                  value={course.progress}
                                  size={32}
                                  strokeWidth={3}
                                  showPercentage
                                  textColor={course.progress === 100 ? "#C69B36" : "#3B82F6"}
                                  trailColor="#F8F6F0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs text-muted-foreground truncate">
                                    {course.lessons} lessons • {course.duration} min
                                  </p>
                                  <p className="text-xs font-medium truncate">
                                    {course.instructor.name}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs px-2 py-1 bg-muted rounded-full whitespace-nowrap">
                                {course.level}
                              </span>
                            </div>
                          </CardContent>
                          
                          <CardFooter>
                            <Button 
                              className={`w-full transition-all ${
                                access.status === "granted" 
                                  ? "bg-gold hover:bg-gold-dark text-white hover:shadow-gold/30" 
                                  : "hover:bg-muted"
                              }`}
                              variant={access.status === "granted" ? "default" : "outline"}
                              onClick={() => 
                                access.status === "granted" 
                                  ? handleEnroll(course) 
                                  : handlePreview(course)
                              }
                            >
                              {access.status === "granted"
                                ? course.progress > 0 ? "Continue" : "Start Learning"
                                : access.status === "locked" ? "Preview Course" : "Upgrade Required"}
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </Folder>
              </div>
            ))}
          </div>
        </main>

        {/* Right Panel */}
        <aside className="right-panel bg-cream/90 backdrop-blur-sm rounded-xl p-4 hidden lg:block">
          <section className="mb-8">
            <h3 className="font-medium mb-4 flex items-center text-gold-dark">
              <Trophy className="h-5 w-5 mr-2 text-gold" />
              Your Achievements
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center">
                  <div className="mr-3 relative flex-shrink-0">
                    <CircularText 
                      value={achievement.unlocked ? 100 : achievement.progress}
                      size={48}
                      strokeWidth={4}
                      className={achievement.unlocked ? "text-gold" : "text-muted"}
                      textColor={achievement.unlocked ? "#C69B36" : "#9CA3AF"}
                      trailColor="#F8F6F0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {React.cloneElement(achievement.icon, {
                        className: `h-5 w-5 ${
                          achievement.unlocked ? "text-gold" : "text-muted-foreground"
                        }`
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.progress}% complete
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-medium mb-4 flex items-center text-gold-dark">
              <Users className="h-5 w-5 mr-2 text-gold" />
              Community Activity
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/20 rounded-lg transition-colors hover:bg-muted/40">
                <p className="text-sm">
                  <span className="font-medium text-gold-dark">Alex M.</span> just completed Vocal Warm-Ups
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg transition-colors hover:bg-muted/40">
                <p className="text-sm">
                  <span className="font-medium text-gold-dark">Taylor R.</span> earned Perfect Score achievement
                </p>
                <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg transition-colors hover:bg-muted/40">
                <p className="text-sm">
                  <span className="font-medium text-gold-dark">Jordan K.</span> shared a performance
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
              </div>
            </div>
            <Button variant="gold" className="w-full mt-4">
              Join Community
            </Button>
          </section>
        </aside>
      </div>

      {/* Mobile Dock Toggle */}
      <div className="fixed bottom-4 left-4 lg:hidden z-40">
        <Button 
          variant="gold"
          size="icon"
          className="shadow-lg shadow-gold/30"
          onClick={() => setMobileDockOpen(!mobileDockOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Achievements */}
      <div className="lg:hidden px-4 pb-6">
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="pt-4">
            <h3 className="font-medium mb-4 flex items-center text-gold-dark">
              <Trophy className="h-5 w-5 mr-2 text-gold" />
              Your Achievements
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="flex items-center p-3">
                  <div className="mr-3 relative flex-shrink-0">
                    <CircularText 
                      value={achievement.unlocked ? 100 : achievement.progress}
                      size={48}
                      strokeWidth={4}
                      className={achievement.unlocked ? "text-gold" : "text-muted"}
                      textColor={achievement.unlocked ? "#C69B36" : "#9CA3AF"}
                      trailColor="#F8F6F0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {React.cloneElement(achievement.icon, {
                        className: `h-5 w-5 ${
                          achievement.unlocked ? "text-gold" : "text-muted-foreground"
                        }`
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LearningHub;
