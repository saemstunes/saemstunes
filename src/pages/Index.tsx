import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Play, Users, BookOpen, CalendarClock, ArrowRight, Volume2, Star, Award, Clock, Zap, User, TrendingUp, Globe, HeadphonesIcon } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import { mockSubscriptionPlans } from "@/data/mockData";
import PricingCard from "@/components/subscription/PricingCard";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import InteractivePiano from "@/components/ui/interactive-piano";
import { 
  FloatingCard, 
  GlowingButton, 
  ProgressRing, 
  ContentCard, 
  AnimatedBackground 
} from "@/components/ui/react-bits-components";

// Student Success Stories Component
const StudentShowcase = () => {
  const students = useMemo(() => [
    { name: "Sarah M.", achievement: "Completed Grade 5 Piano", avatar: "🎹", progress: 95 },
    { name: "Mike R.", achievement: "First Guitar Solo Performance", avatar: "🎸", progress: 87 },
    { name: "Lisa K.", achievement: "Jazz Improvisation Master", avatar: "🎷", progress: 92 },
    { name: "James T.", achievement: "Vocal Range Expanded 2 Octaves", avatar: "🎤", progress: 89 }
  ], []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {students.map((student, index) => (
        <FloatingCard key={student.name} delay={index * 0.1} className="p-6 text-center" glowEffect>
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <ProgressRing progress={student.progress} size={60}>
                <span className="text-2xl">{student.avatar}</span>
              </ProgressRing>
            </div>
            <h4 className="font-semibold text-lg mb-1">{student.name}</h4>
            <p className="text-sm text-muted-foreground mb-2">{student.achievement}</p>
            <div className="text-gold font-bold">{student.progress}% Complete</div>
          </div>
        </FloatingCard>
      ))}
    </div>
  );
};

// Featured Content Carousel
const FeaturedLessons = () => {
  const navigate = useNavigate();
  
  const lessons = useMemo(() => [
    { 
      title: "Piano Basics: Your First Chord", 
      instructor: "Sarah Johnson", 
      duration: "12:30", 
      difficulty: "Beginner" as const,
      category: "Piano"
    },
    { 
      title: "Guitar Fingerpicking Patterns", 
      instructor: "Mike Rodriguez", 
      duration: "18:45", 
      difficulty: "Intermediate" as const,
      category: "Guitar"
    },
    { 
      title: "Vocal Warm-up & Breathing", 
      instructor: "Emily Davis", 
      duration: "8:20", 
      difficulty: "Beginner" as const,
      category: "Vocals"
    },
    { 
      title: "Jazz Theory Fundamentals", 
      instructor: "David Wilson", 
      duration: "25:15", 
      difficulty: "Advanced" as const,
      category: "Theory"
    },
    { 
      title: "Songwriting Basics", 
      instructor: "Anna Lee", 
      duration: "22:30", 
      difficulty: "Intermediate" as const,
      category: "Composition"
    },
    { 
      title: "Reading Sheet Music", 
      instructor: "John Parker", 
      duration: "15:45", 
      difficulty: "Beginner" as const,
      category: "Theory"
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Popular This Week</h3>
        <Button variant="outline" onClick={() => navigate("/videos")}>
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.slice(0, 6).map((lesson, index) => (
          <ContentCard
            key={index}
            {...lesson}
            onClick={() => navigate("/videos")}
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Stats Section
const StatsSection = () => {
  const stats = useMemo(() => [
    { number: "2,500+", label: "Students Worldwide", icon: <Users className="h-6 w-6" />, progress: 85 },
    { number: "15+", label: "Expert Instructors", icon: <Award className="h-6 w-6" />, progress: 95 },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="h-6 w-6" />, progress: 95 },
    { number: "40+", label: "Countries", icon: <Globe className="h-6 w-6" />, progress: 75 }
  ], []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <FloatingCard key={index} delay={index * 0.1} className="p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <ProgressRing progress={stat.progress} size={70} color="#C9A66B">
                <div className="text-gold">
                  {stat.icon}
                </div>
              </ProgressRing>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.number}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        </FloatingCard>
      ))}
    </div>
  );
};

// Quick Access Cards
const QuickAccessSection = () => {
  const navigate = useNavigate();
  
  const quickActions = useMemo(() => [
    {
      title: "Try Free Lessons",
      description: "Start with 50+ free video tutorials",
      icon: <Play className="h-8 w-8" />,
      action: () => navigate("/videos"),
      gradient: "from-green-400 to-green-600"
    },
    {
      title: "Book Live Session",
      description: "1-on-1 coaching with professionals",
      icon: <CalendarClock className="h-8 w-8" />,
      action: () => navigate("/bookings"),
      gradient: "from-blue-400 to-blue-600"
    },
    {
      title: "Join Community",
      description: "Connect with 1000+ musicians",
      icon: <Users className="h-8 w-8" />,
      action: () => navigate("/community"),
      gradient: "from-purple-400 to-purple-600"
    },
    {
      title: "Music Tools",
      description: "Metronome, tuner & more",
      icon: <HeadphonesIcon className="h-8 w-8" />,
      action: () => navigate("/music-tools"),
      gradient: "from-gold to-yellow-500"
    }
  ], [navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickActions.map((action, index) => (
        <FloatingCard 
          key={index} 
          delay={index * 0.1} 
          className="p-0 overflow-hidden cursor-pointer group"
          glowEffect
        >
          <div 
            className={`bg-gradient-to-br ${action.gradient} p-6 text-white relative`}
            onClick={action.action}
          >
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
              {action.icon}
            </div>
            <div className="relative z-10">
              <div className="mb-3">{action.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-white/90 text-sm">{action.description}</p>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </FloatingCard>
      ))}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [timeGreeting, setTimeGreeting] = useState('');
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting('Morning');
    else if (hour < 17) setTimeGreeting('Afternoon');
    else setTimeGreeting('Evening');
  }, []);

  const features = useMemo(() => [
    {
      icon: <Music className="h-7 w-7 text-gold" />,
      title: "Live 1-on-1 Sessions",
      description: "Personal coaching with professional musicians who adapt to your learning style and goals.",
      highlight: "Most Popular",
      stats: "500+ sessions monthly"
    },
    {
      icon: <Play className="h-7 w-7 text-gold" />,
      title: "Interactive Video Library",
      description: "200+ video lessons you can pause, rewind, and practice along with at your own pace.",
      highlight: "New Weekly",
      stats: "4.9/5 rating"
    },
    {
      icon: <BookOpen className="h-7 w-7 text-gold" />,
      title: "Sheet Music & Resources",
      description: "Download professional arrangements, tabs, and practice materials for your favorite songs.",
      highlight: "500+ Songs",
      stats: "Updated daily"
    },
    {
      icon: <Users className="h-7 w-7 text-gold" />,
      title: "Global Community",
      description: "Connect with fellow musicians worldwide, share progress, and get constructive feedback.",
      highlight: "1000+ Members",
      stats: "24/7 active"
    }
  ], []);

  return (
    <motion.div 
      className="min-h-screen relative"
      {...pageTransition}
    >
      <AnimatedBackground />

      {/* Hero Section - Interactive & Engaging */}
      <section className="relative overflow-hidden py-12 px-6 md:py-20">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-purple-500/10"
          style={{ y: y1 }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Content */}
            <div>
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/20 to-purple-500/20 backdrop-blur-sm text-gold px-5 py-3 rounded-full text-sm font-semibold mb-8 border border-gold/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="h-4 w-4" />
                Good {timeGreeting}! Ready to make music?
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Master Music with
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-dark to-yellow-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Expert Guidance
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join thousands of students learning piano, guitar, vocals, and more through personalized lessons, interactive content, and a supportive global community.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlowingButton 
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/videos")}
                  className="group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Try Free Lesson
                </GlowingButton>
                <GlowingButton 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/bookings")}
                  glow={false}
                >
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Book Live Session
                </GlowingButton>
              </motion.div>

              {/* Enhanced Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <StatsSection />
              </motion.div>
            </div>

            {/* Right Column - Interactive Piano */}
            <motion.div
              className="flex justify-center"
              style={{ y: y2 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <InteractivePiano />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access - Content First */}
      <section className="py-16 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Start Learning <span className="text-gold">Right Now</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              No sign-ups required. Choose your path and begin your musical journey immediately.
            </p>
          </motion.div>
          <QuickAccessSection />
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-16">
        <div className="container px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Real Students, Real <span className="text-gold">Progress</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              See what our community has achieved with dedicated practice and expert guidance.
            </p>
          </motion.div>
          <StudentShowcase />
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 bg-gradient-to-b from-muted/10 to-transparent">
        <div className="container px-4">
          <FeaturedLessons />
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16">
        <div className="container px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Everything You Need to <span className="text-gold">Excel</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              From complete beginner to advanced performer, we provide comprehensive tools, expert guidance, and community support to help you reach your musical goals.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FloatingCard 
                key={index} 
                delay={index * 0.1} 
                className="p-8 relative overflow-hidden group cursor-pointer"
                glowEffect
              >
                {feature.highlight && (
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-gold to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                    {feature.highlight}
                  </div>
                )}
                
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="text-sm text-gold font-semibold">
                      {feature.stats}
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Pricing - Progressive Disclosure */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-muted/20 to-muted/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Ready for <span className="text-gold">Premium Access</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Unlock advanced lessons, 1-on-1 tutoring, and exclusive content. Start with a 7-day free trial.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mockSubscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PricingCard 
                    plan={{
                      ...plan,
                      description: plan.description || "Perfect for your musical journey"
                    }} 
                    variant={index === 1 ? "default" : "outline"}
                    className={index === 1 ? "scale-105 ring-2 ring-gold/30 shadow-2xl" : ""}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground">
              🔒 All plans include 7-day free trial • Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </motion.section>

      {/* Final CTA - Action-Oriented */}
      <section className="py-20 bg-gradient-to-r from-gold/15 via-purple-500/10 to-gold/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="container px-4 text-center relative z-10">
          <motion.h2 
            className="text-3xl md:text-5xl font-serif font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Musical Journey Starts <span className="text-gold">Now</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-10 max-w-3xl mx-auto text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of students who've transformed their musical abilities with Saem's Tunes. 
            Start today and discover what you're truly capable of achieving.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
              variant="outline"
              size="lg"
              onClick={() => navigate("/videos")}
              glow={false}
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

// Keep existing Dashboard component unchanged
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

  useEffect(() => {
    if (!isLoading && !user && window.location.pathname !== "/") {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-muted-foreground">Loading your musical experience...</p>
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
