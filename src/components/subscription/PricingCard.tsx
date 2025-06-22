import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/data/mockData";
import PaymentDialog from "@/components/payment/PaymentDialog";

// Pricing configuration with KSh values
const PRICING_CONFIG = {
  1: { // Starter
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
  2: { // Standard
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
  3: { // Professional
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

interface PricingCardProps {
  plan: SubscriptionPlan;
  variant?: "default" | "outline";
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, variant = "default", className }) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<'subscription' | 'one-time'>('subscription');
  const [classCount, setClassCount] = useState<number>(4);
  const [isTieredPlan, setIsTieredPlan] = useState(false);
  
  const isPrimary = variant === "default";
  const pricingConfig = PRICING_CONFIG[plan.id as keyof typeof PRICING_CONFIG] || {
    regular: 0,
    discounted: 0,
    discount: 0,
    baseCoefficient: 1.0,
    penaltyMultipliers: [1.0],
    classCounts: [1],
    minClasses: 1,
    maxClasses: 1,
    icon: "⭐"
  };

  // Initialize class count and tier status
  useEffect(() => {
    const tiered = [1, 2, 3].includes(plan.id);
    setIsTieredPlan(tiered);
    if (tiered) setClassCount(pricingConfig.maxClasses);
  }, [plan.id]);

  // Calculate one-time price with premium cap
  const calculateOneTimePrice = () => {
    const classCountIndex = pricingConfig.classCounts.indexOf(classCount);
    if (classCountIndex === -1) return pricingConfig.regular;
    
    const penalty = pricingConfig.penaltyMultipliers[classCountIndex];
    const rawPrice = (pricingConfig.regular * pricingConfig.baseCoefficient * penalty) / classCount;
    const maxPrice = (pricingConfig.regular * 1.5) / classCount;
    return Math.min(Math.round(rawPrice), maxPrice);
  };

  const oneTimePrice = isTieredPlan ? calculateOneTimePrice() : Math.round(plan.price * 130 * 0.3);

  // Prepare payment request
  const paymentRequest = {
    orderType: paymentType,
    itemId: plan.id,
    itemName: `${plan.name} ${paymentType === 'subscription' 
      ? 'Subscription' 
      : `Class Pack (${classCount} classes)`}`,
    amount: Math.round((paymentType === 'subscription' 
      ? pricingConfig.discounted 
      : oneTimePrice * classCount) * 100),
    currency: 'KES',
    classCount: paymentType === 'one-time' ? classCount : undefined
  };

  // Calculate subscription savings
  const subscriptionSavings = isTieredPlan 
    ? Math.round((1 - pricingConfig.discounted / (oneTimePrice * pricingConfig.maxClasses)) * 100)
    : 0;

  return (
    <>
      <Card
        className={cn(
          "flex flex-col justify-between h-full overflow-hidden transition-all duration-300 hover:shadow-lg relative",
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
            {pricingConfig.icon}
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
                KSh {pricingConfig.discounted.toLocaleString()}
              </span>
              <span className="text-muted-foreground line-through">
                KSh {pricingConfig.regular.toLocaleString()}
              </span>
              {pricingConfig.discount > 0 && (
                <span className="ml-2 bg-destructive/20 text-destructive px-2 py-0.5 rounded-full text-xs font-bold">
                  {pricingConfig.discount}% OFF
                </span>
              )}
            </div>
            {isTieredPlan && subscriptionSavings > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                per month • Save up to {subscriptionSavings}%
              </p>
            )}
          </div>
          
          {/* Class Count Selector - Only for tiered plans */}
          {isTieredPlan ? (
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-foreground">Classes:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-2">
                    {pricingConfig.minClasses}-{pricingConfig.maxClasses}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-8 h-8"
                    disabled={classCount <= pricingConfig.minClasses}
                    onClick={() => setClassCount(prev => Math.max(prev - 1, pricingConfig.minClasses))}
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
                    disabled={classCount >= pricingConfig.maxClasses}
                    onClick={() => setClassCount(prev => Math.min(prev + 1, pricingConfig.maxClasses))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
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
              
              {classCount < pricingConfig.maxClasses && (
                <p className="text-xs text-center text-destructive mt-3">
                  +{Math.round((
                    pricingConfig.penaltyMultipliers[
                      pricingConfig.classCounts.indexOf(classCount)
                    ] - 1
                  ) * 100)}% flexibility premium
                </p>
              )}
            </div>
          ) : (
            // Non-tiered plan pricing
            <div className="bg-muted/50 p-4 rounded-lg border border-border text-center">
              <p className="text-sm font-medium text-foreground mb-2">Pay Per Class</p>
              <p className="text-xl font-bold text-foreground">
                KSh {oneTimePrice.toLocaleString()}
                <span className="text-muted-foreground text-sm font-normal ml-1">
                  /class
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No commitment • Pay as you go
              </p>
            </div>
          )}
          
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
              "w-full font-bold py-6 transition-all hover:shadow-md",
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
            {isTieredPlan ? `Buy ${classCount} Classes` : "Buy Single Class"}
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
