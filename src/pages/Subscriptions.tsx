
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Crown, 
  Check, 
  Star, 
  Music, 
  Users, 
  VideoIcon,
  BookOpen,
  Award,
  Sparkles,
  ArrowLeft,
  CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Subscriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get the plan that was selected from the home page
  const preSelectedPlan = location.state?.selectedPlan;

  useEffect(() => {
    if (preSelectedPlan) {
      setSelectedPlan(preSelectedPlan);
    }
  }, [preSelectedPlan]);

  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      period: "per month",
      description: "Perfect for beginners starting their musical journey",
      icon: Music,
      color: "from-blue-500 to-blue-600",
      features: [
        "Access to beginner tutorials",
        "Basic music theory lessons",
        "Community forum access",
        "Monthly group sessions",
        "Mobile app access"
      ],
      badge: null
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Most popular choice for dedicated learners",
      icon: Crown,
      color: "from-gold to-yellow-600",
      features: [
        "Everything in Basic",
        "1-on-1 tutor sessions (2/month)",
        "Advanced video lessons",
        "Personalized practice plans",
        "Progress tracking & analytics",
        "Priority support",
        "Downloadable resources"
      ],
      badge: "Most Popular"
    },
    {
      id: "pro",
      name: "Professional",
      price: "$39.99",
      period: "per month",
      description: "For serious musicians and professionals",
      icon: Award,
      color: "from-purple-500 to-purple-600",
      features: [
        "Everything in Premium",
        "Unlimited 1-on-1 sessions",
        "Master classes with experts",
        "Custom curriculum design",
        "Recording studio access",
        "Performance opportunities",
        "Certificate programs",
        "Business music guidance"
      ],
      badge: "Best Value"
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate("/auth?tab=signup", { 
        state: { returnTo: `/subscriptions`, selectedPlan: planId }
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Here you would integrate with your payment processor
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Subscription Started!",
        description: `Welcome to ${subscriptionPlans.find(p => p.id === planId)?.name} plan!`,
      });
      
      navigate("/payment", { state: { plan: planId } });
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an issue processing your subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Choose Your <span className="text-gold">Musical Journey</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock your potential with our comprehensive music education platform. 
              Start with any plan and upgrade anytime.
            </p>
          </motion.div>
        </div>

        {/* Subscription Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subscriptionPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const isRecommended = plan.badge === "Most Popular";
            
            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                className="relative"
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge 
                      className={`${
                        plan.badge === "Most Popular" 
                          ? "bg-gold text-white" 
                          : "bg-purple-500 text-white"
                      } px-3 py-1`}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <Card 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isSelected 
                      ? "ring-2 ring-gold shadow-lg transform scale-105" 
                      : isRecommended 
                        ? "border-gold/50 shadow-md" 
                        : ""
                  }`}
                >
                  {/* Background Gradient */}
                  <div 
                    className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${plan.color} opacity-10`}
                  />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${plan.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="bg-gold/10 text-gold">
                          Selected
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period.split(' ')[1]}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <Check className="h-4 w-4 text-green-500" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        isRecommended 
                          ? "bg-gold hover:bg-gold/90 text-white" 
                          : ""
                      }`}
                      variant={isRecommended ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <CreditCard className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          {user ? "Subscribe Now" : "Sign Up & Subscribe"}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-muted/30 rounded-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Why Choose Saem's Tunes?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <VideoIcon className="h-8 w-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Premium Content</h3>
              <p className="text-sm text-muted-foreground">
                High-quality video lessons from professional musicians
              </p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Expert Tutors</h3>
              <p className="text-sm text-muted-foreground">
                Learn from experienced instructors and industry professionals
              </p>
            </div>
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Structured Learning</h3>
              <p className="text-sm text-muted-foreground">
                Follow proven curriculums designed for all skill levels
              </p>
            </div>
            <div className="text-center">
              <Star className="h-8 w-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your improvement with detailed analytics
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you choose the right plan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/contact")}>
              Contact Support
            </Button>
            <Button variant="outline" onClick={() => navigate("/terms")}>
              View Terms
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Subscriptions;
