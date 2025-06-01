import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import { mockVideos, VideoContent } from "@/data/mockData";
import VideoCard from "@/components/videos/VideoCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Index = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem("selectedRole", selectedRole);
      toast({
        title: "Role Selected",
        description: `You have selected ${selectedRole} role.`,
      });
      navigate("/videos");
    }
  }, [selectedRole, navigate, toast]);

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-serif font-bold mb-6">
          Welcome to Saem's Tunes
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            {!profile ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-medium">
                  Unlock Your Musical Potential
                </h2>
                <p className="text-muted-foreground mt-2">
                  Join our community and start your musical journey today.
                </p>
                <Button onClick={() => navigate("/auth")} className="mt-4">
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="text-center bg-muted/30 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-serif font-bold mb-2">
                  Welcome back, {profile.full_name || profile.display_name || 'there'}!
                </h2>
                <p className="text-muted-foreground mb-4">
                  Continue your musical journey with personalized content
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    className="border-gold text-gold hover:bg-gold hover:text-white"
                    onClick={() => setSelectedRole(profile.role as 'student' | 'adult_learner' | 'tutor')}
                  >
                    My Learning Path
                  </Button>
                  <Button 
                    onClick={() => navigate("/videos")}
                    className="bg-gold hover:bg-gold-dark text-white"
                  >
                    Continue Learning
                  </Button>
                </div>
              </div>
            )}

            <RecommendedContent />

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Start Your Journey</CardTitle>
                <CardDescription>
                  Explore our curated learning paths designed for every musician.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="beginner">
                    <AccordionTrigger>Beginner</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">
                        Perfect for those who are just starting out. Learn the
                        fundamentals of music theory and basic techniques.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedRole("student");
                          setOpen(true);
                        }}
                      >
                        Explore Beginner Path
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="intermediate">
                    <AccordionTrigger>Intermediate</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">
                        Take your skills to the next level. Dive deeper into
                        advanced techniques and explore different genres.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedRole("adult_learner");
                          setOpen(true);
                        }}
                      >
                        Explore Intermediate Path
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="advanced">
                    <AccordionTrigger>Advanced</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">
                        Challenge yourself with complex compositions and master
                        your instrument. Ideal for experienced musicians.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedRole("tutor");
                          setOpen(true);
                        }}
                      >
                        Explore Advanced Path
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to continue as a {selectedRole}?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role">Role</Label>
              <RadioGroup
                defaultValue={selectedRole || ""}
                className="col-span-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="r1" />
                  <Label htmlFor="r1">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adult_learner" id="r2" />
                  <Label htmlFor="r2">Adult Learner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tutor" id="r3" />
                  <Label htmlFor="r3">Tutor</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Index;
