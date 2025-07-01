
import React, { useState } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import MainLayout from "@/components/layout/MainLayout";
import PricingCard, { SubscriptionPlan } from "@/components/subscription/PricingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Music, Star, Users, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Basic",
    description: "Perfect for beginners starting their musical journey",
    price: 29.99,
    features: [
      "Access to basic lessons",
      "Community forum access",
      "Email support",
      "Monthly progress reports",
      "Basic music theory courses"
    ]
  },
  {
    id: 2,
    name: "Premium",
    description: "For serious learners who want comprehensive access",
    price: 49.99,
    features: [
      "All Basic features",
      "Advanced lessons & tutorials",
      "1-on-1 monthly coaching session",
      "Priority email support",
      "Live group sessions",
      "Sheet music downloads",
      "Practice tracking tools"
    ],
    isRecommended: true
  },
  {
    id: 3,
    name: "Professional",
    description: "For advanced musicians and music professionals",
    price: 99.99,
    features: [
      "All Premium features",
      "Weekly 1-on-1 coaching",
      "Masterclass access",
      "Performance opportunities",
      "Industry networking events",
      "Professional certification",
      "Custom learning paths"
    ]
  }
];

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [annualMode, setAnnualMode] = useState(false);
  const { user } = useAuth();

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };

  const currentPlan = user?.subscriptionTier || null;

  const isPlanActive = (planId: number) => {
    return currentPlan === planId.toString();
  };

  const getUpgradeText = (planId: number) => {
    if (!currentPlan) return "Get Started";
    
    const currentPlanId = parseInt(currentPlan);
    if (planId === currentPlanId) return "Current Plan";
    if (planId < currentPlanId) return "Downgrade";
    return "Upgrade";
  };

  return (
    <MainLayout>
      <motion.div className="space-y-12" {...pageTransition}>
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            Choose Your <span className="text-gold">Music Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Unlock your musical potential with our comprehensive learning platform. 
            Start your journey today with the perfect plan for your needs.
          </p>
        </div>

        {/* Annual/Monthly Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className={`text-sm font-medium ${!annualMode ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAnnualMode(!annualMode)}
            className={`relative rounded-full p-1 transition-all duration-200 ${
              annualMode ? 'bg-gold text-white' : 'bg-muted'
            }`}
          >
            <div className={`w-5 h-5 rounded-full transition-transform duration-200 ${
              annualMode ? 'translate-x-5' : 'translate-x-0'
            } bg-white`} />
          </Button>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${annualMode ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onPlanSelect={handlePlanSelect}
              isCurrentPlan={isPlanActive(plan.id)}
              annualMode={annualMode}
              highlightRecommended={true}
              className="h-full"
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Compare All Features</CardTitle>
              <CardDescription>
                See what's included in each plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-2">Features</th>
                      <th className="text-center py-4 px-2">Basic</th>
                      <th className="text-center py-4 px-2">Premium</th>
                      <th className="text-center py-4 px-2">Professional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Basic lessons", basic: true, premium: true, pro: true },
                      { feature: "Community forum", basic: true, premium: true, pro: true },
                      { feature: "Email support", basic: true, premium: true, pro: true },
                      { feature: "Advanced tutorials", basic: false, premium: true, pro: true },
                      { feature: "1-on-1 coaching", basic: false, premium: true, pro: true },
                      { feature: "Live sessions", basic: false, premium: true, pro: true },
                      { feature: "Masterclasses", basic: false, premium: false, pro: true },
                      { feature: "Professional certification", basic: false, premium: false, pro: true },
                    ].map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-2 font-medium">{row.feature}</td>
                        <td className="text-center py-3 px-2">
                          {row.basic ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : "-"}
                        </td>
                        <td className="text-center py-3 px-2">
                          {row.premium ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : "-"}
                        </td>
                        <td className="text-center py-3 px-2">
                          {row.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about our subscription plans
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
              },
              {
                q: "What happens if I cancel my subscription?",
                a: "You'll continue to have access to your plan features until the end of your current billing period. After that, you'll be moved to our free tier."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee for all new subscribers. If you're not satisfied, contact us for a full refund."
              },
              {
                q: "Are there any setup fees?",
                a: "No hidden fees! The price you see is exactly what you'll pay. No setup fees, no activation charges."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Subscriptions;
