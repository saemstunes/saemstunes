import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Play, Users, Book, BookOpen, CalendarClock, ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import { mockSubscriptionPlans } from "@/data/mockData";
import PricingCard from "@/components/subscription/PricingCard";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Music className="h-6 w-6 text-gold" />,
      title: "Expert Tutoring",
      description: "Learn from professional musicians with years of experience in teaching and performance."
    },
    {
      icon: <Play className="h-6 w-6 text-gold" />,
      title: "Video Lessons",
      description: "Access our library of high-quality video tutorials covering various musical topics."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-gold" />,
      title: "Resources",
      description: "Download infographics, sheets, and learning materials to enhance your musical journey."
    },
    {
      icon: <CalendarClock className="h-6 w-6 text-gold" />,
      title: "Flexible Scheduling",
      description: "Book lessons at times that work for you with our convenient scheduling system."
    },
  ];

  // Updated variant and colors for better light mode contrast
  const getSubscriptionPlanVariant = (index: number, plan: any) => {
    if (index === 1) return "default"; // Middle plan is already good
    
    // Use light variant for side plans in light mode for better contrast
    return "outline";
  };

  return (
    <motion.div 
      className="min-h-screen"
      {...pageTransition}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 md:py-32 text-center">
        <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl font-serif font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Unlock Your <span className="text-gold">Musical</span> Potential
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Saem's Tunes provides comprehensive music education with expert tutors, rich content, and a supportive community to help you grow as a musician.
          </motion.p>
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg"
              className="bg-gold hover:bg-gold-dark text-white"
              onClick={() => navigate("/signup")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/videos")}
            >
              Explore Lessons
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Why Choose <span className="text-gold">Saem's Tunes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-gold/10 p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Updated for better light mode contrast */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-4">
            Subscription Plans
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Choose a plan that works for you and start your musical journey today. All plans include access to our community and support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockSubscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <PricingCard 
                  plan={plan} 
                  variant={getSubscriptionPlanVariant(index, plan)}
                  className={index !== 1 ? "shadow-lg border-gold/40 dark:border-gold/20" : ""}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gold/10">
        <div className="container px-4 text-center">
          <motion.h2 
            className="text-3xl font-serif font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Your Musical Journey?
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join Saem's Tunes today and discover the joy of learning music with our expert tutors and comprehensive resources.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg"
              className="bg-gold hover:bg-gold-dark text-white"
              onClick={() => navigate("/signup")}
            >
              Sign Up Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-serif font-bold">Welcome, {user.name}</h1>
        <Button
          className="bg-gold hover:bg-gold-dark text-white w-full md:w-auto"
          onClick={() => window.location.href = "/bookings"}
        >
          <CalendarClock className="mr-2 h-5 w-5" />
          Book a Session
        </Button>
      </div>

      <DashboardStats role={user.role} />
      <RecommendedContent />

      <div className="mt-8">
        <h2 className="text-xl font-serif font-semibold mb-4">Upcoming Sessions</h2>
        <UpcomingBookings />
      </div>
    </div>
  );
};

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if accessing protected dashboard areas
  useEffect(() => {
    if (!isLoading && !user && window.location.pathname !== "/") {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      {user ? <Dashboard /> : <LandingPage />}
    </MainLayout>
  );
};

export default Index;
