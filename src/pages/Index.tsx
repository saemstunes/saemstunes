import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music2, LayoutDashboard, Users, BarChart4, Settings, HelpCircle, Star, CheckCircle, BookOpenCheck, ShieldCheck, Download, HelpCircle as HelpCircleIcon, BookOpenCheck as BookOpenCheckIcon, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  FloatingCard,
  GlowingButton,
  ProgressRing,
  ContentCard,
  AnimatedBackground
} from "@/components/ui/react-bits-components";
import PricingCard from "@/components/subscription/PricingCard";
import { pageTransition, fadeInUp, staggerChildren } from "@/lib/animation-utils";
import { motion } from "framer-motion";

interface SubscriptionPlan {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  features: string[];
  isRecommended?: boolean;
  popularClass?: string;
  popularDescription?: string;
  popularIcon?: React.ReactNode;
  annualDiscount?: number;
}

const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Free",
    shortDescription: "Perfect for exploring",
    price: 0,
    features: [
      "Access to limited lessons",
      "Basic music theory",
      "Community support",
    ],
  },
  {
    id: 2,
    name: "Basic",
    shortDescription: "Level up your skills",
    price: 19,
    features: [
      "Unlimited access to all lessons",
      "Advanced music theory",
      "Personalized feedback",
    ],
    isRecommended: true,
    annualDiscount: 50,
  },
  {
    id: 3,
    name: "Premium",
    shortDescription: "Master the art of music",
    price: 49,
    features: [
      "Everything in Basic",
      "One-on-one sessions with instructors",
      "Exclusive content",
    ],
    annualDiscount: 100,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleNavigation = (route: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access this feature.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate(route);
  };

  return (
    <MainLayout>
      <motion.div
        className="space-y-10"
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Hero Section */}
        <section className="py-24 text-center">
          <motion.h1
            className="text-5xl font-proxima font-bold mb-4"
            variants={fadeInUp}
          >
            Unlock Your Musical Potential
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8"
            variants={fadeInUp}
          >
            Learn from the best instructors, explore a vast library of lessons,
            and create music that inspires.
          </motion.p>
          <motion.div variants={staggerChildren}>
            <GlowingButton
              size="lg"
              className="mr-4"
              onClick={() => navigate("/discover")}
            >
              Start Learning <ArrowRight className="ml-2" />
            </GlowingButton>
            <GlowingButton
              variant="outline"
              size="lg"
              onClick={() => navigate("/music-tools")}
            >
              Explore Music Tools
            </GlowingButton>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Music2 className="h-5 w-5 text-gold" />
                    <span>Vast Lesson Library</span>
                  </CardTitle>
                  <CardDescription>
                    Explore thousands of lessons across various instruments and
                    genres.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    From beginner basics to advanced techniques, find the
                    perfect lesson for your skill level.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LayoutDashboard className="h-5 w-5 text-gold" />
                    <span>Personalized Dashboard</span>
                  </CardTitle>
                  <CardDescription>
                    Track your progress and get personalized recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay motivated with a clear view of your learning journey
                    and tailored content suggestions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gold" />
                    <span>Expert Instructors</span>
                  </CardTitle>
                  <CardDescription>
                    Learn from experienced musicians and educators.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get guidance and feedback from industry professionals who
                    are passionate about teaching.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-proxima font-bold mb-4"
              variants={fadeInUp}
            >
              Choose Your Perfect Plan
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Unlock premium features and exclusive content with our
              subscription plans. Whether you're just starting out or a
              seasoned musician, we have a plan for you.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mockSubscriptionPlans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={{
                  ...plan,
                  description: plan.shortDescription || plan.name // Add description fallback
                }}
                orderType="subscription"
                classCount={1}
              />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50 rounded-xl">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <ProgressRing progress={85} size={100} color="#C9A66B">
                <BarChart4 className="h-6 w-6 text-gold" />
              </ProgressRing>
              <h3 className="text-xl font-semibold">Data-Driven Progress</h3>
              <p className="text-muted-foreground">
                Track your learning with detailed analytics and insights.
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <ProgressRing progress={92} size={100} color="#C9A66B">
                <Settings className="h-6 w-6 text-gold" />
              </ProgressRing>
              <h3 className="text-xl font-semibold">Customizable Learning</h3>
              <p className="text-muted-foreground">
                Tailor your learning experience to match your goals and
                interests.
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <ProgressRing progress={78} size={100} color="#C9A66B">
                <HelpCircle className="h-6 w-6 text-gold" />
              </ProgressRing>
              <h3 className="text-xl font-semibold">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Get help from our support team and community experts.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-proxima font-bold mb-4"
              variants={fadeInUp}
            >
              What Our Students Say
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Read inspiring stories from students who have transformed their
              musical abilities with our platform.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>John Doe</CardTitle>
                      <CardDescription className="text-xs">
                        Guitar Enthusiast
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Saem's Tunes has completely changed the way I approach
                    learning guitar. The lessons are engaging, and the
                    instructors are incredibly supportive."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/sadmann7.png" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Jane Smith</CardTitle>
                      <CardDescription className="text-xs">
                        Piano Student
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "I've always wanted to learn piano, but I never knew where
                    to start. Saem's Tunes made it easy and fun, and I'm
                    already playing my favorite songs!"
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/mrmartineau.png" />
                      <AvatarFallback>MM</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Mike Johnson</CardTitle>
                      <CardDescription className="text-xs">
                         aspiring Musician
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The one-on-one sessions with instructors have been
                    invaluable. I've received personalized feedback and
                    guidance that has helped me improve my skills rapidly."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 text-center bg-muted/50 rounded-xl">
          <motion.h2
            className="text-4xl font-proxima font-bold mb-4"
            variants={fadeInUp}
          >
            Ready to Start Your Musical Journey?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8"
            variants={fadeInUp}
          >
            Join Saem's Tunes today and unlock your full musical potential.
            Start learning, creating, and sharing your music with the world.
          </motion.p>
          <motion.div variants={staggerChildren}>
            <GlowingButton
              size="lg"
              onClick={() => navigate("/discover")}
              className="mr-4"
            >
              Explore Lessons <ArrowRight className="ml-2" />
            </GlowingButton>
            <GlowingButton
              variant="outline"
              size="lg"
              onClick={() => navigate("/auth?signup=true")}
            >
              Create Free Account
            </GlowingButton>
          </motion.div>
        </section>
      </motion.div>
    </MainLayout>
  );
};

export default Index;
