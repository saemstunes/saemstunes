import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import MainLayout from "@/components/layout/MainLayout";
import PricingCard from "@/components/subscription/PricingCard";
import { mockSubscriptionPlans } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Subscriptions = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<string>('');
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    // Get current plan - convert to string for consistency
    const userPlan = mockSubscriptionPlans.find(plan => plan.id.toString() === currentPlan);
    if (userPlan) {
      setCurrentPlan(userPlan.id.toString());
    }
  }, []);

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId.toString());
  };

  const filteredPlans = mockSubscriptionPlans.filter(plan => {
    if (selectedPlan === 'all') return true;
    return plan.id.toString() === selectedPlan;
  });

  const getRecommendedPlan = () => {
    return mockSubscriptionPlans.find(plan => plan.id === 2);
  };

  const handleUpgrade = (planId: string) => {
    const numericPlanId = parseInt(planId, 10);
    const plan = mockSubscriptionPlans.find(p => p.id === numericPlanId);
    if (plan) {
      navigate('/payment', { 
        state: { 
          planId: numericPlanId,
          planName: plan.name,
          price: plan.price 
        } 
      });
    }
  };

  return (
    <MainLayout>
      <motion.div className="space-y-8" {...pageTransition}>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Choose Your <span className="text-gold">Musical Journey</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Unlock your potential with our comprehensive music education platform
          </p>
        </div>

        {/* Plan Toggle */}
        <div className="flex justify-center">
          <div className="bg-muted p-1 rounded-lg">
            <Button
              variant={!isAnnual ? "default" : "ghost"}
              onClick={() => setIsAnnual(false)}
              className="rounded-md"
            >
              Monthly
            </Button>
            <Button
              variant={isAnnual ? "default" : "ghost"}
              onClick={() => setIsAnnual(true)}
              className="rounded-md"
            >
              Annual
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockSubscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PricingCard
                plan={plan}
                variant={plan.id === 2 ? "default" : "outline"}
                isCurrentPlan={currentPlan === plan.id.toString()}
                annualMode={isAnnual}
                onPlanSelect={handlePlanSelect}
                className={plan.id === 2 ? "scale-105 ring-2 ring-gold/30 shadow-2xl" : ""}
              />
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-serif font-bold mb-4">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Personalized Learning</h3>
              <p className="text-muted-foreground">
                Our platform adapts to your skill level and learning pace, providing a customized experience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Expert Instructors</h3>
              <p className="text-muted-foreground">
                Learn from seasoned musicians and educators with years of experience in their respective fields.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Vast Content Library</h3>
              <p className="text-muted-foreground">
                Access a wide range of lessons, exercises, and resources covering various instruments and genres.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Community Support</h3>
              <p className="text-muted-foreground">
                Connect with fellow musicians, share your progress, and receive feedback in a supportive community.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-serif font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept major credit cards, debit cards, and PayPal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Can I cancel my subscription at any time?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of the current billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Is there a free trial available?</h3>
              <p className="text-muted-foreground">
                Yes, all our plans come with a 7-day free trial.
              </p>
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        {selectedPlan && selectedPlan !== currentPlan && (
          <div className="text-center">
            <Button
              className="bg-gold hover:bg-gold-dark text-white"
              size="lg"
              onClick={() => handleUpgrade(selectedPlan)}
            >
              Upgrade to {mockSubscriptionPlans.find(plan => plan.id.toString() === selectedPlan)?.name}
            </Button>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Subscriptions;
