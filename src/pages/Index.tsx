import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
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
import { useMediaQuery } from "react-responsive";
import { throttle } from "lodash-es";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load heavy components
const InteractivePiano = lazy(() => import("@/components/ui/InteractivePiano"));

// Memoized UI Components =====================================================
const FloatingCard = memo(({ children, delay = 0, className = "", onClick }: any) => (
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
));

const GlowingButton = memo(({ children, variant = "primary", className = "", ...props }: any) => {
  const variants = {
    primary: "bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white shadow-lg shadow-gold/25 hover:shadow-gold/40",
    secondary: "bg-gradient-to-r from-gold-light to-gold hover:from-gold hover:to-gold-light text-white shadow-lg shadow-gold/25 hover:shadow-gold/40"
  };

  return (
    <Button
      className={`${variants[variant]} transform hover:scale-105 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
});

const ContentCard = memo(({ title, instructor, duration, difficulty, isPopular, onClick }: any) => (
  <FloatingCard className="p-0 overflow-hidden group cursor-pointer" onClick={onClick}>
    <div className="relative">
      {isPopular && (
        <div className="absolute top-3 left-3 z-10 bg-gold text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Popular
        </div>
      )}
      <div className="h-32 sm:h-40 bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center relative overflow-hidden">
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
));

// Optimized Carousel Component ===============================================
const ContentCarousel = memo(({ title, items, onViewAll }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const maxIndex = Math.max(0, items.length - itemsPerView);

  // Calculate carousel width efficiently
  const carouselWidth = useMemo(() => `${(items.length / itemsPerView) * 100}%`, [items.length, itemsPerView]);
  
  // Throttled resize handler
  const updateItemsPerView = useCallback(throttle(() => {
    if (window.innerWidth < 640) setItemsPerView(1);
    else if (window.innerWidth < 1024) setItemsPerView(2);
    else setItemsPerView(4);
  }, 200), []);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [updateItemsPerView]);

  const next = useCallback(() => setCurrentIndex(prev => Math.min(prev + 1, maxIndex)), [maxIndex]);
  const prev = useCallback(() => setCurrentIndex(prev => Math.max(prev - 1, 0)), []);

  // Memoized carousel items
  const carouselItems = useMemo(() => 
    items.map((item: any, index: number) => (
      <div key={index} style={{ width: `${100 / itemsPerView}%` }} className="flex-shrink-0">
        <ContentCard {...item} />
      </div>
    ))
  , [items, itemsPerView]);

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
            aria-label="Previous items"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={next}
            disabled={currentIndex === maxIndex}
            className="h-7 w-7 p-0"
            aria-label="Next items"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={onViewAll} className="text-xs sm:text-sm">
            View All
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <motion.div
          className="flex gap-3 sm:gap-4 w-max"
          animate={{ x: -currentIndex * (100 / itemsPerView) + '%' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ width: carouselWidth }}
          role="list"
        >
          {carouselItems}
        </motion.div>
      </div>
    </div>
  );
});

// Optimized Counter Component ================================================
const StatsCounter = memo(({ number, label, icon, delay = 0 }: any) => {
  const [count, setCount] = useState(0);
  const finalNumber = parseInt(number.replace(/[^\d]/g, ''));

  useEffect(() => {
    let counter: NodeJS.Timeout;
    const timer = setTimeout(() => {
      const increment = Math.ceil(finalNumber / 30);
      counter = setInterval(() => {
        setCount(prev => {
          const next = prev + increment;
          if (next >= finalNumber) {
            clearInterval(counter);
            return finalNumber;
          }
          return next;
        });
      }, 50);
    }, delay);
    
    return () => {
      clearTimeout(timer);
      clearInterval(counter);
    };
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
});

// Landing Page Component =====================================================
const LandingPage = () => {
  const navigate = useNavigate();
  const [timeGreeting, setTimeGreeting] = useState('');

  // Memoized data
  const popularLessons = useMemo(() => [
    { title: "Piano Basics: Your First Chord", instructor: "Sarah Johnson", duration: "12:30", difficulty: "Beginner", isPopular: true },
    { title: "Guitar Fingerpicking Fundamentals", instructor: "Mike Rodriguez", duration: "18:45", difficulty: "Intermediate", isPopular: true },
    { title: "Jazz Piano Improvisation", instructor: "David Chen", duration: "25:15", difficulty: "Advanced", isPopular: false },
    { title: "Vocal Warm-up Exercises", instructor: "Emily Davis", duration: "8:20", difficulty: "Beginner", isPopular: false },
    { title: "Blues Guitar Techniques", instructor: "Tom Wilson", duration: "22:10", difficulty: "Intermediate", isPopular: true },
    { title: "Music Theory Essentials", instructor: "Dr. Lisa Brown", duration: "35:40", difficulty: "Beginner", isPopular: false }
  ], []);

  const newReleases = useMemo(() => [
    { title: "Advanced Drum Patterns", instructor: "Alex Turner", duration: "15:30", difficulty: "Advanced", isPopular: false },
    { title: "Classical Guitar Etudes", instructor: "Maria Santos", duration: "28:15", difficulty: "Intermediate", isPopular: false },
    { title: "Electronic Music Production", instructor: "DJ Marcus", duration: "42:20", difficulty: "Intermediate", isPopular: true },
    { title: "Songwriting Workshop", instructor: "Jennifer Lee", duration: "33:45", difficulty: "Beginner", isPopular: false }
  ], []);

  const stats = useMemo(() => [
    { number: "2,500+", label: "Active Students", icon: <Users className="h-6 w-6" /> },
    { number: "15", label: "Expert Instructors", icon: <Award className="h-6 w-6" /> },
    { number: "95%", label: "Success Rate", icon: <Star className="h-6 w-6" /> },
    { number: "500+", label: "Video Lessons", icon: <Play className="h-6 w-6" /> },
  ], []);

  const features = useMemo(() => [
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
  ], []);

  // Navigation handlers
  const handleViewPopular = useCallback(() => navigate("/videos?filter=popular"), [navigate]);
  const handleViewNew = useCallback(() => navigate("/videos?filter=new"), [navigate]);
  const handleSignup = useCallback(() => navigate("/signup"), [navigate]);
  const handleBookings = useCallback(() => navigate("/bookings"), [navigate]);
  const handleVideos = useCallback(() => navigate("/videos"), [navigate]);
  const handleCommunity = useCallback(() => navigate("/community"), [navigate]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting('Morning');
    else if (hour < 17) setTimeGreeting('Afternoon');
    else setTimeGreeting('Evening');
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-x-hidden"
      {...pageTransition}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-6 px-4 sm:py-12 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_70%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
              <motion.div
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-sm border border-gold/20 text-gold px-3 py-1 rounded-full text-xs font-medium"
              >
                <Zap className="h-3 w-3" />
                Good {timeGreeting}! Ready to make music?
              </motion.div>
              
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight"
              >
                Master Music with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark block">
                  Expert Guidance
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed mx-auto lg:mx-0"
              >
                Join <strong>2,500+ students</strong> learning through personalized 1-on-1 sessions.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <GlowingButton 
                  size="lg"
                  className="text-sm sm:text-base px-5 py-2.5 group w-full sm:w-auto"
                  onClick={handleVideos}
                >
                  <Play className="mr-2 h-4 w-4 group-hover:scale-110" />
                  Try Free Lesson
                </GlowingButton>
                <GlowingButton 
                  variant="secondary"
                  size="lg"
                  className="text-sm sm:text-base px-5 py-2.5 w-full sm:w-auto"
                  onClick={handleBookings}
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Book Live Session
                </GlowingButton>
              </motion.div>

              {/* Animated Stats */}
              <motion.div 
                className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 pt-4 lg:pt-6"
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

            {/* Right Column - Swipable Interactive Tools */}
            <motion.div
              className="flex justify-center order-first lg:order-last py-4 sm:py-0"
            >
              <Suspense fallback={<div className="bg-muted rounded-xl w-full h-64 animate-pulse" />}>
                <ErrorBoundary fallback={<div>Piano failed to load</div>}>
                  <InteractivePiano />
                </ErrorBoundary>
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Discovery */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container px-4 space-y-6 sm:space-y-8">
          <ContentCarousel
            title="🔥 Trending Lessons"
            items={popularLessons}
            onViewAll={handleViewPopular}
          />

          <ContentCarousel
            title="✨ Just Released"
            items={newReleases}
            onViewAll={handleViewNew}
          />

          {/* Quick Access Actions */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8"
          >
            <FloatingCard className="p-3 sm:p-4 text-center group cursor-pointer" onClick={handleVideos}>
              <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-2.5 sm:p-3 rounded-full w-fit mx-auto mb-2 sm:mb-3 group-hover:scale-110">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
              </div>
              <h3 className="font-semibold mb-1 text-sm sm:text-base">Browse Library</h3>
              <p className="text-xs text-muted-foreground mb-2 sm:mb-3">500+ lessons across instruments</p>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Explore Now</Button>
            </FloatingCard>

            <FloatingCard className="p-3 sm:p-4 text-center group cursor-pointer" onClick={handleCommunity}>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-2.5 sm:p-3 rounded-full w-fit mx-auto mb-2 sm:mb-3 group-hover:scale-110">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1 text-sm sm:text-base">Join Community</h3>
              <p className="text-xs text-muted-foreground mb-2 sm:mb-3">Connect with musicians</p>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Join Now</Button>
            </FloatingCard>

            <FloatingCard className="p-3 sm:p-4 text-center group cursor-pointer sm:col-span-2 lg:col-span-1" onClick={handleBookings}>
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-2.5 sm:p-3 rounded-full w-fit mx-auto mb-2 sm:mb-3 group-hover:scale-110">
                <CalendarClock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1 text-sm sm:text-base">Book Session</h3>
              <p className="text-xs text-muted-foreground mb-2 sm:mb-3">1-on-1 with experts</p>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Schedule Now</Button>
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* Features - Why Choose Us */}
      <section className="py-8 sm:py-12">
        <div className="container px-4">
          <motion.div
            className="text-center mb-6 sm:mb-10"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-3">
              Everything You Need to <span className="text-gold">Excel</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm">
              From complete beginner to advanced performer, we provide tools and expert guidance.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.map((feature, index) => (
              <FloatingCard
                key={index}
                delay={index * 0.1}
                className="p-3 sm:p-4 relative overflow-hidden group"
              >
                {feature.highlight && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-gold/20 to-gold/10 text-gold text-2xs px-1.5 py-0.5 rounded-full font-medium border border-gold/20">
                    {feature.highlight}
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-2 rounded-lg mb-2 sm:mb-3 w-fit group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Pricing */}
      <section className="py-8 sm:py-12 bg-muted/20">
        <div className="container px-4">
          <div className="text-center mb-6 sm:mb-10">
            <motion.h2 
              className="text-xl sm:text-2xl font-serif font-bold mb-3"
            >
              Choose Your Learning Path
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm"
            >
              Start free, then unlock premium features when ready.
            </motion.p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {mockSubscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <PricingCard 
                    plan={plan} 
                    variant={index === 1 ? "default" : "outline"}
                    className={index === 1 ? "ring-1 ring-gold/30 shadow-lg shadow-gold/10" : "h-full"}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            className="text-center mt-4 sm:mt-6"
          >
            <p className="text-2xs sm:text-xs text-muted-foreground">
              ✨ 7-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-gold/10 via-purple-500/5 to-gold/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,215,0,0.1),transparent_50%)] opacity-50"></div>
        
        <div className="container px-4 text-center relative z-10">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 sm:mb-6"
          >
            Your Musical Journey Starts <span className="text-gold">Now</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            Join thousands of students who've transformed their musical abilities.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <GlowingButton 
              variant="primary"
              size="lg"
              onClick={handleSignup}
              className="text-base px-8 py-3"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </GlowingButton>
            <GlowingButton 
              variant="secondary"
              size="lg"
              onClick={handleVideos}
              className="text-base px-8 py-3"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Free Content
            </GlowingButton>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

// Dashboard Component ========================================================
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const handleManageSubscription = useCallback(() => navigate("/subscriptions"), [navigate]);
  const handleBookSession = useCallback(() => navigate("/bookings"), [navigate]);

  if (!user) return null;

  // Subscription Status Component
  const SubscriptionStatus = useMemo(() => (
    user.subscribed ? (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center">
          <div className="bg-green-500 rounded-full p-1 mr-2 sm:mr-3">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-green-800 text-sm sm:text-base">
              {user.subscriptionTier ? user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1) : 'Active'} Plan
            </h3>
            <p className="text-xs sm:text-sm text-green-600">Access to all premium content</p>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <p className="text-muted-foreground text-sm mb-3 sm:mb-4">
          Upgrade to access premium content and features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {mockSubscriptionPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} variant="outline" className="h-full" />
          ))}
        </div>
      </div>
    )
  ), [user.subscribed, user.subscriptionTier]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl sm:text-2xl font-serif font-bold">Welcome, {user.name}</h1>
        <Button
          className="bg-gold hover:bg-gold-dark text-white py-2 text-sm sm:text-base"
          onClick={handleBookSession}
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          Book a Session
        </Button>
      </div>

      <DashboardStats role={user.role} />

      {/* Subscription Management */}
      <div className="bg-card border rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-proxima font-semibold">Your Subscription</h2>
          {user.subscribed && (
            <Button variant="outline" size="sm" onClick={handleManageSubscription}>
              Manage
            </Button>
          )}
        </div>
        
        {SubscriptionStatus}
      </div>

      {/* Responsive Layout */}
      {isDesktop ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecommendedContent />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-semibold mb-3 sm:mb-4">Upcoming Sessions</h2>
            <UpcomingBookings />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <RecommendedContent />
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-semibold mb-3 sm:mb-4">Upcoming Sessions</h2>
            <UpcomingBookings />
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component =============================================================
const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect logic
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
      <ErrorBoundary fallback={<div className="p-6 text-red-500">Page failed to load</div>}>
        {user ? <Dashboard /> : <LandingPage />}
      </ErrorBoundary>
    </MainLayout>
  );
};

export default memo(Index);
