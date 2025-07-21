
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Play, Users, Book, BookOpen, CalendarClock, ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import FourPointerSection from "@/components/homepage/FourPointerSection";
import SocialMediaFeed from "@/components/social/SocialMediaFeed";
import { mockSubscriptionPlans } from "@/data/mockData";
import PricingCard from "@/components/subscription/PricingCard";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";

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

  return (
    <motion.div 
      className="min-h-screen overflow-x-hidden"
      {...pageTransition}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4 md:px-6 text-center">
        <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Unlock Your <span className="text-gold">Musical</span> Potential
          </motion.h1>
          <motion.p 
            className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Saem's Tunes provides comprehensive music education with expert tutors, rich content, and a supportive community to help you grow as a musician.
          </motion.p>
          <motion.div 
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg"
              className="bg-gold hover:bg-gold-dark text-white flex-1"
              onClick={() => navigate("/signup")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/videos")}
            >
              Explore Lessons
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/30">
        <div className="container px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">
            Why Choose <span className="text-gold">Saem's Tunes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Pointer Section */}
      <section className="py-12">
        <div className="container px-4 max-w-6xl mx-auto">
          <FourPointerSection />
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-12 bg-muted/20">
        <div className="container px-4 max-w-6xl mx-auto">
          <SocialMediaFeed />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12">
        <div className="container px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-4">
            Subscription Plans
          </h2>
          <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-2xl mx-auto">
            Choose a plan that works for you and start your musical journey today. All plans include access to our community and support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mockSubscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="h-full"
              >
                <PricingCard 
                  plan={plan} 
                  variant={index !== 1 ? "outline" : "default"}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gold/10">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Your Musical Journey?
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto"
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
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="space-y-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-serif font-bold">Welcome, {user.name}</h1>
        <Button
          className="bg-gold hover:bg-gold-dark text-white w-full md:w-auto"
          onClick={() => navigate("/bookings")}
        >
          <CalendarClock className="mr-2 h-5 w-5" />
          Book a Session
        </Button>
      </div>

      <DashboardStats role={user.role} />

      {/* Subscription Management for Authenticated Users */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-proxima font-semibold">Your Subscription</h2>
          {user.subscribed && (
            <Button variant="outline" onClick={() => navigate("/subscriptions")}>
              Manage Subscription
            </Button>
          )}
        </div>
        
        {user.subscribed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-1 mr-3">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">
                  {user.subscriptionTier ? user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1) : 'Active'} Subscription
                </h3>
                <p className="text-sm text-green-600">You have access to all premium content</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-4">
              Upgrade your account to access premium content, advanced lessons, and exclusive features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockSubscriptionPlans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} variant="outline" />
              ))}
            </div>
          </div>
        )}
      </div>

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
