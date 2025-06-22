import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
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
      maxClasses: 4
    },
    2: { // Tier 2 - Standard
      regular: 2000,
      discounted: 1500,
      discount: 25,
      baseCoefficient: 1.05,
      penaltyMultipliers: [1.0, 1.08, 1.26, 1.5],
      classCounts: [6, 5, 4, 3],
      minClasses: 3,
      maxClasses: 6
    },
    3: { // Tier 3 - Professional
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
  
  // Get pricing for current plan
  const currentPricing = pricingData[plan.id as keyof typeof pricingData];
  
  // Calculate one-time price based on class count
  const calculateOneTimePrice = () => {
    if (!currentPricing) return 0;
    
    const classCountIndex = currentPricing.classCounts.indexOf(classCount);
    if (classCountIndex === -1) return 0;
    
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
    itemName: `${plan.name} ${paymentType === 'subscription' ? 'Subscription' : 'Class Pack'}`,
    amount: Math.round((paymentType === 'subscription' 
      ? currentPricing.discounted 
      : oneTimePrice * classCount) * 100),
    currency: 'KES',
    classCount: paymentType === 'one-time' ? classCount : undefined
  };
  
  return (
    <>
      <Card
        className={cn(
          "flex flex-col justify-between h-full transition-all duration-300",
          isPrimary && "border-primary shadow-lg shadow-primary/10",
          className
        )}
      >
        <CardHeader>
          {plan.isPopular && (
            <div className="py-1 px-3 bg-primary/20 text-primary rounded-full text-xs font-medium w-fit mx-auto mb-2">
              MOST POPULAR
            </div>
          )}
          <CardTitle className="text-xl font-proxima text-center text-foreground">
            {plan.name}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {plan.shortDescription || ""}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Monthly Subscription Pricing */}
          <div className="space-y-3 p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-sm text-primary uppercase tracking-wide text-center">
              Monthly Subscription
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-bold text-primary">
                  KSh {currentPricing.discounted.toLocaleString()}
                </p>
                {currentPricing.discount > 0 && (
                  <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-medium">
                    {currentPricing.discount}% OFF
                  </span>
                )}
              </div>
              {currentPricing.discount > 0 && (
                <>
                  <p className="text-sm text-muted-foreground line-through text-center">
                    Regular: KSh {currentPricing.regular.toLocaleString()}/month
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    First month special - then KSh {currentPricing.regular.toLocaleString()}/month
                  </p>
                </>
              )}
            </div>
          </div>
          
          {/* One-time Purchase Option */}
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-center text-foreground">
              Pay Per Class Pack
            </h4>
            
            {/* Class Count Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Classes:</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-8 h-8"
                    disabled={classCount <= currentPricing.minClasses}
                    onClick={() => setClassCount(prev => Math.max(prev - 1, currentPricing.minClasses))}
                  >
                    -
                  </Button>
                  <span className="text-lg font-semibold w-10 text-center">
                    {classCount}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-8 h-8"
                    disabled={classCount >= currentPricing.maxClasses}
                    onClick={() => setClassCount(prev => Math.min(prev + 1, currentPricing.maxClasses))}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Per class</p>
                  <p className="text-xl font-bold text-foreground">
                    KSh {oneTimePrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-foreground">
                    KSh {(oneTimePrice * classCount).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                {classCount === currentPricing.maxClasses 
                  ? "Best value: No premium applied" 
                  : `Flexibility premium: +${Math.round((currentPricing.penaltyMultipliers[currentPricing.classCounts.indexOf(classCount)] - 1) * 100)}%`}
              </p>
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-3 pt-4">
            <h5 className="font-medium text-sm text-foreground">What's included:</h5>
            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pt-0">
          <Button
            className={cn("w-full font-medium transition-colors", 
              isPrimary 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            )}
            onClick={() => handleSubscribe('subscription')}
          >
            Start Subscription
          </Button>
          <Button
            variant="outline"
            className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={() => handleSubscribe('one-time')}
          >
            Buy Class Pack
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
