import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Music, 
  Users, 
  BookOpen, 
  Star, 
  ChevronRight, 
  Headphones,
  Award,
  Globe,
  Heart,
  Mic,
  Piano,
  Guitar,
  Drum,
  Volume2,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Crown,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import PricingCard, { SubscriptionPlan } from "@/components/subscription/PricingCard";
import { subscriptionPlans as importedPlans } from "@/data/mockData";
import { pageTransition, fadeIn, scaleOnHover } from "@/lib/animation-utils";

// Add descriptions to subscription plans
const subscriptionPlans: SubscriptionPlan[] = [
  {
    ...importedPlans[0],
    description: "Perfect for beginners starting their musical journey"
  },
  {
    ...importedPlans[1], 
    description: "For serious learners who want comprehensive access"
  },
  {
    ...importedPlans[2],
    description: "For advanced musicians and music professionals"
  }
];

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Music Student",
      content: "Saem's teaching style is incredible. I've learned more in 3 months than I did in years of self-study.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b567?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Marcus Johnson",
      role: "Professional Guitarist",
      content: "The advanced techniques and personalized feedback have elevated my playing to a professional level.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Elena Rodriguez",
      role: "Vocal Coach",
      content: "As a fellow instructor, I'm impressed by the depth and quality of Saem's curriculum.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students Taught" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Success Rate" },
    { number: "50+", label: "Instruments Covered" }
  ];

  const features = [
    {
      icon: <Music className="h-8 w-8 text-gold" />,
      title: "Comprehensive Curriculum",
      description: "From basics to advanced techniques across multiple instruments and genres"
    },
    {
      icon: <Users className="h-8 w-8 text-gold" />,
      title: "Personalized Learning",
      description: "Tailored lessons that adapt to your pace, style, and musical goals"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-gold" />,
      title: "Interactive Resources",
      description: "Sheet music, backing tracks, and practice tools to enhance your learning"
    },
    {
      icon: <Award className="h-8 w-8 text-gold" />,
      title: "Expert Instruction",
      description: "Learn from Saem's 15+ years of professional experience and teaching"
    }
  ];

  const instruments = [
    { name: "Piano", icon: <Piano className="h-6 w-6" /> },
    { name: "Guitar", icon: <Guitar className="h-6 w-6" /> },
    { name: "Vocals", icon: <Mic className="h-6 w-6" /> },
    { name: "Drums", icon: <Drum className="h-6 w-6" /> },
    { name: "Production", icon: <Volume2 className="h-6 w-6" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleGetStarted = () => {
    if (user) {
      navigate("/discover");
    } else {
      navigate("/auth");
    }
  };

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
    navigate("/subscriptions");
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MainLayout>
      <div className="overflow-hidden">
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5"
          style={{ opacity: heroOpacity, scale: heroScale }}
          {...pageTransition}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23C9A66B" fill-opacity="0.03"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4 bg-gold/10 text-gold border-gold/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Welcome to Saem's Tunes
                </Badge>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight">
                  Master Your{" "}
                  <span className="text-gold relative">
                    Musical Journey
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/30 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Transform your musical dreams into reality with personalized instruction, 
                  comprehensive resources, and a community that celebrates your growth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleGetStarted}
                  {...scaleOnHover}
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300"
                  onClick={() => setIsHeroVideoPlaying(true)}
                  {...scaleOnHover}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 mt-12 opacity-70">
                {instruments.map((instrument, index) => (
                  <motion.div
                    key={instrument.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    {instrument.icon}
                    <span>{instrument.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronRight className="h-6 w-6 text-gold rotate-90" />
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Why Choose <span className="text-gold">Saem's Tunes</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the difference with our comprehensive approach to music education
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="mx-auto mb-4 p-3 bg-gold/10 rounded-full w-fit">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                What Students <span className="text-gold">Say</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Real stories from our musical community
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-gold fill-current" />
                        ))}
                      </div>
                      
                      <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                        "{testimonials[currentTestimonial].content}"
                      </blockquote>
                      
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={testimonials[currentTestimonial].image}
                          alt={testimonials[currentTestimonial].name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <div className="font-semibold text-lg">
                            {testimonials[currentTestimonial].name}
                          </div>
                          <div className="text-muted-foreground">
                            {testimonials[currentTestimonial].role}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      currentTestimonial === index ? "bg-gold" : "bg-muted-foreground/30"
                    )}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Choose Your <span className="text-gold">Learning Path</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Flexible plans designed to grow with your musical journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PricingCard
                    plan={plan}
                    onPlanSelect={handlePlanSelect}
                    className="h-full"
                    highlightRecommended={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="max-w-4xl mx-auto space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Ready to Start Your <span className="text-gold">Musical Journey</span>?
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students who have transformed their musical abilities with Saem's expert guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-white font-semibold px-8 py-4 rounded-full text-lg"
                  onClick={handleGetStarted}
                  {...scaleOnHover}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold px-8 py-4 rounded-full text-lg"
                  onClick={() => scrollToSection(aboutRef)}
                  {...scaleOnHover}
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No commitment required • Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
