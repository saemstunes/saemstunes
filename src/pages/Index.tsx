
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Music, Play, Users, BookOpen, CalendarClock, ArrowRight, 
  Volume2, Star, Award, Clock, TrendingUp, Zap, User, 
  PlayCircle, ChevronLeft, ChevronRight, Heart, Share2 
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import { mockSubscriptionPlans } from "@/data/mockData";
import PricingCard from "@/components/subscription/PricingCard";
import { motion, AnimatePresence } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import InteractivePiano from "@/components/ui/InteractivePiano";

// React Bits inspired components
const FloatingCard = ({ children, delay = 0, className = "", onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
    whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
    className={`bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

const GlowingButton = ({ children, variant = "primary", className = "", ...props }: any) => {
  const variants = {
    primary: "bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white shadow-lg shadow-gold/25 hover:shadow-gold/40",
    secondary: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
  };

  return (
    <Button
      className={`${variants[variant]} transform hover:scale-105 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

const ContentCard = ({ title, instructor, duration, difficulty, isPopular, onClick }: any) => (
  <FloatingCard className="p-0 overflow-hidden group cursor-pointer" onClick={onClick}>
    <div className="relative">
      {isPopular && (
        <div className="absolute top-3 left-3 z-10 bg-gold text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Popular
        </div>
      )}
      <div className="h-32 sm:h-40 bg-gradient-to-br from-gold/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <PlayCircle className="h-10 w-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
    </div>
    <div className="p-3 sm:p-4">
      <h3 className="font-semibold text-sm mb-1 sm:mb-2 line-clamp-2">{title}</h3>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {instructor}
        </div>
        <span className="bg-gold/10 text-gold px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap">
          {difficulty}
        </span>
      </div>
    </div>
  </FloatingCard>
);

const ContentCarousel = ({ title, items, onViewAll }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const maxIndex = Math.max(0, items.length - itemsPerView);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const next = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  const prev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-serif font-bold">{title}</h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prev}
            disabled={currentIndex === 0}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={next}
            disabled={currentIndex === maxIndex}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={onViewAll} className="text-xs sm:text-sm">
            View All
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-3 sm:gap-4"
          animate={{ x: -currentIndex * (100 / itemsPerView) + '%' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ width: `${(items.length / itemsPerView) * 100}%` }}
        >
          {items.map((item: any, index: number) => (
            <div key={index} style={{ width: `${100 / itemsPerView}%` }} className="flex-shrink-0">
              <ContentCard {...item} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const StatsCounter = ({ number, label, icon, delay = 0 }: any) => {
  const [count, setCount] = useState(0);
  const finalNumber = parseInt(number.replace(/[^\d]/g, ''));

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = finalNumber / 30;
      const counter = setInterval(() => {
        setCount(prev => {
          const next = prev + increment;
          if (next >= finalNumber) {
            clearInterval(counter);
            return finalNumber;
          }
          return next;
        });
      }, 50);
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [finalNumber, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="text-center group"
    >
      <div className="flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-2xl font-bold">
        {number.includes('+') ? Math.floor(count).toLocaleString() + '+' : 
         number.includes('%') ? Math.floor(count) + '%' : 
         Math.floor(count).toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [timeGreeting, setTimeGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting('Morning');
    else if (hour < 17) setTimeGreeting('Afternoon');
    else setTimeGreeting('Evening');
  }, []);

  // Mock data for content
  const popularLessons = [
    { title: "Piano Basics: Your First Chord", instructor: "Sarah Johnson", duration: "12:30", difficulty: "Beginner", isPopular: true },
    { title: "Guitar Fingerpicking Fundamentals", instructor: "Mike Rodriguez", duration: "18:45", difficulty: "Intermediate", isPopular: true },
    { title: "Jazz Piano Improvisation", instructor: "David Chen", duration: "25:15", difficulty: "Advanced", isPopular: false },
    { title: "Vocal Warm-up Exercises", instructor: "Emily Davis", duration: "8:20", difficulty: "Beginner", isPopular: false },
    { title: "Blues Guitar Techniques", instructor: "Tom Wilson", duration: "22:10", difficulty: "Intermediate", isPopular: true },
    { title: "Music Theory Essentials", instructor: "Dr. Lisa Brown", duration: "35:40", difficulty: "Beginner", isPopular: false }
  ];

  const newReleases = [
    { title: "Advanced Drum Patterns", instructor: "Alex Turner", duration: "15:30", difficulty: "Advanced", isPopular: false },
    { title: "Classical Guitar Etudes", instructor: "Maria Santos", duration: "28:15", difficulty: "Intermediate", isPopular: false },
    { title: "Electronic Music Production", instructor: "DJ Marcus", duration: "42:20", difficulty: "Intermediate", isPopular: true },
    { title: "Songwriting Workshop", instructor: "Jennifer Lee", duration: "33:45", difficulty: "Beginner", isPopular: false }
  ];

  const stats = [
    { number: "2,500+", label: "Active Students", icon: <Users className="h-6 w-6" /> },
    { number: "15", label: "Expert Instructors", icon: <Award className="h-6 w-6" /> },
    { number: "95%", label: "Success Rate", icon: <Star className="h-6 w-6" /> },
    { number: "500+", label: "Video Lessons", icon: <Play className="h-6 w-6" /> },
  ];

  const features = [
    {
      icon: <Music className="h-6 w-6 text-gold" />,
      title: "Live 1-on-1 Sessions",
      description: "Personal coaching with professional musicians tailored to your pace and style.",
      highlight: "Most Booked"
    },
    {
      icon: <Play className="h-6 w-6 text-gold" />,
      title: "Interactive Video Library",
      description: "500+ lessons with play-along features, slow-motion practice, and loop controls.",
      highlight: "Updated Weekly"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-gold" />,
      title: "Sheet Music & Resources",
      description: "Professional arrangements, tabs, and practice materials for every skill level.",
      highlight: "1000+ Downloads"
    },
    {
      icon: <Users className="h-6 w-6 text-gold" />,
      title: "Community Hub",
      description: "Connect with musicians worldwide, share progress, and get feedback.",
      highlight: "24/7 Active"
    },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-x-hidden"
      {...pageTransition}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-6 px-4 sm:py-12 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_70%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            
            {/* Left Column - Dynamic Content */}
           <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
              <motion.div
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gold/20 to-purple-500/20 backdrop-blur-sm border border-gold/20 text-gold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                Good {timeGreeting}! Ready to make music?
              </motion.div>
              
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Master Music with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark block">
                  Expert Guidance
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join <strong>2,500+ students</strong> learning through personalized 1-on-1 sessions, interactive video lessons, and a supportive global community.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlowingButton 
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 group w-full sm:w-auto"
                  onClick={() => navigate("/videos")}
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                  Try Free Lesson
                </GlowingButton>
                <GlowingButton 
                  variant="secondary"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto"
                  onClick={() => navigate("/bookings")}
                >
                  <CalendarClock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Book Live Session
                </GlowingButton>
              </motion.div>

              {/* Animated Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 lg:pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {stats.map((stat, index) => (
                  <StatsCounter
                    key={index}
                    number={stat.number}
                    label={stat.label}
                    icon={stat.icon}
                    delay={index * 0.1}
                  />
                ))}
              </motion.div>
            </div>

            {/* Right Column - Interactive Piano */}
            <motion.div
              className="flex justify-center order-first lg:order-last"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <InteractivePiano />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Discovery - The Heart of the App */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container px-4 space-y-8 sm:space-y-12">
          
          {/* Popular Lessons Carousel */}
          <ContentCarousel
            title="🔥 Trending Lessons"
            items={popularLessons}
            onViewAll={() => navigate("/videos?filter=popular")}
          />

          {/* New Releases Carousel */}
          <ContentCarousel
            title="✨ Just Released"
            items={newReleases}
            onViewAll={() => navigate("/videos?filter=new")}
          />

          {/* Quick Access Actions */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FloatingCard className="p-4 sm:p-6 text-center group cursor-pointer" onClick={() => navigate("/videos")}>
              <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Browse Library</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">500+ lessons across all instruments</p>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Explore Now</Button>
            </FloatingCard>

            <FloatingCard className="p-4 sm:p-6 text-center group cursor-pointer" onClick={() => navigate("/community")}>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Join Community</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Connect with fellow musicians</p>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Join Now</Button>
            </FloatingCard>

            <FloatingCard className="p-4 sm:p-6 text-center group cursor-pointer sm:col-span-2 lg:col-span-1" onClick={() => navigate("/bookings")}>
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <CalendarClock className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Book Session</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">1-on-1 with expert instructors</p>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Schedule Now</Button>
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* Features - Why Choose Us */}
      <section className="py-12 sm:py-16">
        <div className="container px-4">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4">
              Everything You Need to <span className="text-gold">Excel</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              From complete beginner to advanced performer, we provide the tools, community, and expert guidance to accelerate your musical journey.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FloatingCard
                key={index}
                delay={index * 0.1}
                className="p-4 sm:p-6 relative overflow-hidden group"
              >
                {feature.highlight && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-gold/20 to-gold/10 text-gold text-xs px-2 py-1 rounded-full font-medium border border-gold/20">
                    {feature.highlight}
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-2.5 sm:p-3 rounded-xl mb-3 sm:mb-4 w-fit group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
                
                <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Pricing - Less Prominent */}
      <section className="py-12 sm:py-16 bg-muted/20">
        <div className="container px-4">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2 
              className="text-2xl sm:text-3xl font-serif font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Choose Your Learning Path
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Start with free content, then unlock premium features when you're ready to accelerate your progress.
            </motion.p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {mockSubscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <PricingCard 
                    plan={plan} 
                    variant={index === 1 ? "default" : "outline"}
                    className={index === 1 ? "ring-2 ring-gold/30 shadow-xl shadow-gold/10" : ""}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            className="text-center mt-6 sm:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs sm:text-sm text-muted-foreground">
              ✨ 7-day free trial • Cancel anytime • No hidden fees • 30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Action-Oriented */}
      <section className="py-20 bg-gradient-to-r from-gold/10 via-purple-500/5 to-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,215,0,0.1),transparent_50%)] opacity-50"></div>
        
        <div className="container px-4 text-center relative z-10">
          <motion.h2 
            className="text-3xl md:text-5xl font-serif font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your Musical Journey Starts <span className="text-gold">Now</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-10 max-w-3xl mx-auto text-xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of students who've transformed their musical abilities with Saem's Tunes. 
            Start today and discover what you're truly capable of achieving.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlowingButton 
              variant="primary"
              size="lg"
              onClick={() => navigate("/signup")}
              className="text-xl px-12 py-4"
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6" />
            </GlowingButton>
            <GlowingButton 
              variant="secondary"
              size="lg"
              onClick={() => navigate("/videos")}
              className="text-xl px-12 py-4"
            >
              <Volume2 className="mr-3 h-6 w-6" />
              Explore Free Content
            </GlowingButton>
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
    <div className="space-y-8">
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
