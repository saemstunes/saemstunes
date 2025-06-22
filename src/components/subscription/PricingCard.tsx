import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/data/mockData";
import PaymentDialog from "@/components/payment/PaymentDialog";

const PRICING_CONFIG = {
  1: { // Starter
    regular: 1200,
    discounted: 800,
    discount: 33.33,
    baseCoefficient: 1.1,
    penaltyMultipliers: [1.0, 1.15, 1.31],
    classCounts: [4, 3, 2],
    minClasses: 2,
    maxClasses: 4
  },
  2: { // Standard
    regular: 2000,
    discounted: 1500,
    discount: 25,
    baseCoefficient: 1.05,
    penaltyMultipliers: [1.0, 1.08, 1.26, 1.5],
    classCounts: [6, 5, 4, 3],
    minClasses: 3,
    maxClasses: 6
  },
  3: { // Professional
    regular: 4500,
    discounted: 3600,
    discount: 20,
    baseCoefficient: 1.0,
    penaltyMultipliers: [1.0, 1.03, 1.1, 1.32, 1.44],
    classCounts: [12, 10, 8, 6, 5],
    minClasses: 5,
    maxClasses: 12
  }
};

// Exported function to calculate raw price
export const calculateRawPrice = (
  planId: number, 
  classCount: number, 
  paymentType: 'subscription' | 'one-time',
  planPrice?: number
) => {
  const pricingConfig = PRICING_CONFIG[planId as keyof typeof PRICING_CONFIG];
  const isTieredPlan = [1, 2, 3].includes(planId);
  
  if (paymentType === 'subscription') {
    return pricingConfig ? pricingConfig.discounted : 0;
  }
  
  if (isTieredPlan && pricingConfig) {
    const classCountIndex = pricingConfig.classCounts.indexOf(classCount);
    if (classCountIndex === -1) return pricingConfig.regular;
    
    const penalty = pricingConfig.penaltyMultipliers[classCountIndex];
    const rawPrice = (pricingConfig.regular * pricingConfig.baseCoefficient * penalty) / classCount;
    const maxPrice = (pricingConfig.regular * 1.5) / classCount;
    const oneTimePrice = Math.min(Math.round(rawPrice), maxPrice);
    return oneTimePrice * classCount;
  }
  
  // For non-tiered plans
  return planPrice ? Math.round(planPrice * 130 * 0.3) : 0;
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
    maxClasses: 1
  };

  useEffect(() => {
    const tiered = [1, 2, 3].includes(plan.id);
    setIsTieredPlan(tiered);
    if (tiered) setClassCount(pricingConfig.maxClasses);
  }, [plan.id]);

  const calculateOneTimePrice = () => {
    const classCountIndex = pricingConfig.classCounts.indexOf(classCount);
    if (classCountIndex === -1) return pricingConfig.regular;
    
    const penalty = pricingConfig.penaltyMultipliers[classCountIndex];
    const rawPrice = (pricingConfig.regular * pricingConfig.baseCoefficient * penalty) / classCount;
    const maxPrice = (pricingConfig.regular * 1.5) / classCount;
    return Math.min(Math.round(rawPrice), maxPrice);
  };

  const oneTimePrice = isTieredPlan ? calculateOneTimePrice() : Math.round(plan.price * 130 * 0.3);

  const handleSubscribe = (type: 'subscription' | 'one-time') => {
    setPaymentType(type);
    setShowPaymentDialog(true);
  };
  
  // Calculate raw price for payment dialog
  const rawPrice = calculateRawPrice(plan.id, classCount, paymentType, plan.price);
  
  const paymentRequest = {
    orderType: paymentType,
    itemId: plan.id,
    itemName: `${plan.name} ${paymentType === 'subscription' ? 'Subscription' : `Class Pack (${classCount} classes)`}`,
    amount: Math.round(rawPrice * 100), // Use rawPrice instead of manual calculation
    currency: 'KES',
    classCount: paymentType === 'one-time' ? classCount : undefined
  };

  return (
    <>
      <Card
        className={cn(
          "flex flex-col justify-between",
          isPrimary && "border-gold shadow-lg shadow-gold/10",
          className
        )}
      >
        <CardHeader>
          <CardTitle className="text-xl font-proxima text-center">
            {plan.name}
          </CardTitle>
          <CardDescription className="text-center">
            {plan.shortDescription || ""}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          {/* Subscription Pricing */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-sm text-gold">MONTHLY SUBSCRIPTION</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold text-gold">
                  KSh {pricingConfig.discounted.toLocaleString()}
                </p>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                  {pricingConfig.discount}% OFF
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-through">
                Regular: KSh {pricingConfig.regular.toLocaleString()}/month
              </p>
              {plan.annualDiscount && (
                <p className="text-sm text-muted-foreground">
                  Save {plan.annualDiscount}% annually
                </p>
              )}
            </div>
          </div>
          
          {/* One-time Purchase */}
          <div className="space-y-3 p-4 border border-muted rounded-lg">
            <h4 className="font-semibold text-sm">PAY PER CLASS</h4>
            {isTieredPlan ? (
              <>
                <div className="flex justify-center items-center gap-3 mb-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-8 h-8"
                    disabled={classCount <= pricingConfig.minClasses}
                    onClick={() => setClassCount(prev => Math.max(prev - 1, pricingConfig.minClasses))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold">
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
                <p className="text-2xl font-bold">
                  KSh {(oneTimePrice * classCount).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {oneTimePrice.toLocaleString()} per class
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">
                  KSh {oneTimePrice.toLocaleString()}
                  <span className="text-muted-foreground text-sm font-normal">
                    /class
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  No commitment • Pay as you go
                </p>
              </>
            )}
          </div>
          
          {/* Features */}
          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 text-gold mr-2 shrink-0" />
                <p className="text-sm text-left">{feature}</p>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button
            className={cn("w-full", 
              isPrimary 
                ? "bg-gold hover:bg-gold/90 text-white font-medium" 
                : "bg-muted/70 hover:bg-muted text-foreground dark:bg-muted/30 dark:hover:bg-muted/40 dark:text-foreground"
            )}
            onClick={() => handleSubscribe('subscription')}
          >
            Start Subscription
          </Button>
          <Button
            variant="outline"
            className="w-full"
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
