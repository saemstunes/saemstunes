import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/data/mockData";
import PaymentDialog from "@/components/payment/PaymentDialog";

interface PricingCardProps {
  plan: SubscriptionPlan;
  variant?: "default" | "outline";
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, variant = "default", className }) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<'subscription' | 'one-time'>('subscription');
  const [classCount, setClassCount] = useState<number>(() => {
    // Default class counts based on tier
    if (plan.id === 1) return 4;
    if (plan.id === 2) return 6;
    return 12;
  });
  
  const isPrimary = variant === "default";
  
  // Pricing structure with first-month discounts
  const pricingData = {
    1: { // Tier 1 - Starter
      regular: 1200,
      discounted: 800,
      discount: 33.33,
      baseCoefficient: 1.1,
      penaltyMultipliers: [1.0, 1.15, 1.31],
      classCounts: [4, 3, 2],
      minClasses: 2,
      maxClasses: 4,
      icon: "🌱"
    },
    2: { // Tier 2 - Standard
      regular: 2000,
      discounted: 1500,
      discount: 25,
      baseCoefficient: 1.05,
      penaltyMultipliers: [1.0, 1.08, 1.26, 1.5],
      classCounts: [6, 5, 4, 3],
      minClasses: 3,
      maxClasses: 6,
      icon: "🌿"
    },
    3: { // Tier 3 - Professional
      regular: 4500,
      discounted: 3600,
      discount: 20,
      baseCoefficient: 1.0,
      penaltyMultipliers: [1.0, 1.03, 1.1, 1.32, 1.44],
      classCounts: [12, 10, 8, 6, 5],
      minClasses: 5,
      maxClasses: 12,
      icon: "⛰️"
    }
  };
  
  // Get pricing for current plan
  const currentPricing = pricingData[plan.id as keyof typeof pricingData];
  
  // Calculate one-time price based on class count
  const calculateOneTimePrice = () => {
    const classCountIndex = currentPricing.classCounts.indexOf(classCount);
    const penalty = currentPricing.penaltyMultipliers[classCountIndex];
    const rawPrice = (currentPricing.regular * currentPricing.baseCoefficient * penalty) / classCount;
    
    // Apply 50% premium cap
    const maxPrice = (currentPricing.regular * 1.5) / classCount;
    return Math.min(Math.round(rawPrice), maxPrice);
  };
  
  const oneTimePrice = calculateOneTimePrice();
  
  const handleSubscribe = (type: 'subscription' | 'one-time') => {
    setPaymentType(type);
    setShowPaymentDialog(true);
  };
  
  const paymentRequest = {
    orderType: paymentType,
    itemId: plan.id,
    itemName: `${plan.name} ${paymentType === 'subscription' ? 'Subscription' : `Class Pack (${classCount} classes)`}`,
    amount: Math.round((paymentType === 'subscription' 
      ? currentPricing.discounted 
      : oneTimePrice * classCount) * 100),
    currency: 'KES',
    classCount: paymentType === 'one-time' ? classCount : undefined
  };
  
  // Calculate savings percentage for subscription
  const subscriptionSavings = Math.round(
    (1 - currentPricing.discounted / (oneTimePrice * currentPricing.maxClasses)) * 100
  );
  
  return (
    <>
      <Card
        className={cn(
          "flex flex-col justify-between h-full overflow-hidden transition-all duration-300 hover:shadow-xl",
          isPrimary 
            ? "border-primary ring-2 ring-primary/20" 
            : "border-border",
          className
        )}
      >
        {/* Popular Ribbon */}
        {plan.isPopular && (
          <div className="absolute top-4 right-[-30px] w-[120px] rotate-45 bg-primary py-1 text-center text-xs font-bold text-primary-foreground">
            MOST POPULAR
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex justify-center mb-3 text-3xl">
            {currentPricing.icon}
          </div>
          <CardTitle className="text-xl font-bold text-center text-foreground">
            {plan.name}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {plan.shortDescription || ""}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Subscription Pricing */}
          <div className="text-center">
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                KSh {currentPricing.discounted.toLocaleString()}
              </span>
              <span className="text-muted-foreground line-through">
                KSh {currentPricing.regular.toLocaleString()}
              </span>
              {currentPricing.discount > 0 && (
                <span className="ml-2 bg-destructive/20 text-destructive px-2 py-0.5 rounded-full text-xs font-bold">
                  {currentPricing.discount}% OFF
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              per month • Save up to {subscriptionSavings}%
            </p>
          </div>
          
          {/* Class Count Selector */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-foreground">Classes:</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-2">
                  {currentPricing.minClasses}-{currentPricing.maxClasses}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8"
                  disabled={classCount <= currentPricing.minClasses}
                  onClick={() => setClassCount(prev => Math.max(prev - 1, currentPricing.minClasses))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-bold w-10 text-center text-foreground">
                  {classCount}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8"
                  disabled={classCount >= currentPricing.maxClasses}
                  onClick={() => setClassCount(prev => Math.min(prev + 1, currentPricing.maxClasses))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Pricing Breakdown */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-background p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Per class</p>
                <p className="text-xl font-bold text-foreground">
                  KSh {oneTimePrice.toLocaleString()}
                </p>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">
                  KSh {(oneTimePrice * classCount).toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Premium Indicator */}
            {classCount < currentPricing.maxClasses && (
              <p className="text-xs text-center text-destructive mt-3">
                +{Math.round((currentPricing.penaltyMultipliers[currentPricing.classCounts.indexOf(classCount)] - 1) * 100)}% flexibility premium
              </p>
            )}
          </div>
          
          {/* Features List */}
          <div>
            <h5 className="font-semibold text-sm text-foreground mb-3">Includes:</h5>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pt-0 mt-auto">
          <Button
            className={cn(
              "w-full font-bold py-6 transition-all",
              isPrimary 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg" 
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            )}
            onClick={() => handleSubscribe('subscription')}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="w-full py-6 border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={() => handleSubscribe('one-time')}
          >
            Buy {classCount} Classes
          </Button>
        </CardFooter>
      </Card>
      
      <PaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        paymentRequest={paymentRequest}
      />
    </>
  );
};

export default PricingCard;
