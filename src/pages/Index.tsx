
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 md:py-32 text-center">
        <div className="absolute inset-0 music-note-pattern opacity-10 z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold">
            Unlock Your <span className="text-gold">Musical</span> Potential
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Saem's Tunes provides comprehensive music education with expert tutors, rich content, and a supportive community to help you grow as a musician.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
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
              <div key={index} className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-gold/10 p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-4">
            Subscription Plans
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Choose a plan that works for you and start your musical journey today. All plans include access to our community and support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockSubscriptionPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gold/10">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Saem's Tunes today and discover the joy of learning music with our expert tutors and comprehensive resources.
          </p>
          <Button 
            size="lg"
            className="bg-gold hover:bg-gold-dark text-white"
            onClick={() => navigate("/signup")}
          >
            Sign Up Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
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
