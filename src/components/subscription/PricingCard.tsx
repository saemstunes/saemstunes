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
  const isPrimary = variant === "default";
  
  // Conversion rate: 1 USD = 130 KSh
  const USD_TO_KSH_RATE = 130;
  
  // Maintain original price calculation as base
  const basePriceInKSh = plan.price * USD_TO_KSH_RATE;
  
  // Tier-specific pricing configuration
  const tierPricing = {
    1: { // Starter
      discounted: 800,
      oneTime: 400
    },
    2: { // Standard
      discounted: 1500,
      oneTime: 350
    },
    3: { // Professional
      discounted: 3600,
      oneTime: 300
    }
  };
  
  // Check if current plan is a special tier
  const isTieredPlan = [1, 2, 3].includes(plan.id);
  
  // Calculate prices - maintain original as fallback
  const subscriptionPrice = isTieredPlan 
    ? tierPricing[plan.id as keyof typeof tierPricing].discounted 
    : basePriceInKSh;
    
  const oneTimePrice = isTieredPlan 
    ? tierPricing[plan.id as keyof typeof tierPricing].oneTime 
    : Math.round(basePriceInKSh * 0.3);
  
  // Original annual discount in KSh
  const annualDiscountInKSh = plan.annualDiscount 
    ? plan.annualDiscount * USD_TO_KSH_RATE 
    : 0;

  const handleSubscribe = (type: 'subscription' | 'one-time') => {
    setPaymentType(type);
    setShowPaymentDialog(true);
  };
  
  // Maintain original payment request structure with enhancements
  const paymentRequest = {
    orderType: paymentType,
    itemId: plan.id,
    itemName: `${plan.name} ${paymentType === 'subscription' ? 'Subscription' : 'Class'}`,
    amount: Math.round((paymentType === 'subscription' 
      ? subscriptionPrice 
      : oneTimePrice) * 100),
    currency: 'KES'
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
          {plan.isPopular && (
            <div className="py-1 px-3 bg-gold/20 text-gold rounded-full text-xs font-medium w-fit mx-auto mb-2">
              MOST POPULAR
            </div>
          )}
          <CardTitle className="text-xl font-proxima text-center">
            {plan.name}
          </CardTitle>
          <CardDescription className="text-center">
            {plan.shortDescription || ""}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          {/* Combined Pricing Display */}
          <div className="space-y-2">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold">
                KSh {subscriptionPrice.toLocaleString()}
                <span className="text-muted-foreground text-sm font-normal">
                  /month
                </span>
              </p>
              
              {/* Original USD Conversion Display */}
              <p className="text-sm text-muted-foreground">
                (${plan.price} USD)
              </p>
              
              {/* Original Annual Discount Display */}
              {plan.annualDiscount && (
                <p className="text-sm text-muted-foreground">
                  Save KSh {annualDiscountInKSh.toLocaleString()} annually
                </p>
              )}
              
              {/* Tiered Discount Badge */}
              {isTieredPlan && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-medium mt-2">
                  {Math.round((1 - (subscriptionPrice / basePriceInKSh)) * 100)}% OFF first month
                </span>
              )}
            </div>
          </div>
          
          {/* New One-time Purchase Option */}
          <div className="space-y-3 p-4 border border-muted rounded-lg">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Pay Per Class
            </h4>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                KSh {oneTimePrice.toLocaleString()}
                <span className="text-muted-foreground text-sm font-normal ml-1">
                  /class
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                No commitment • Pay as you go
              </p>
            </div>
          </div>
          
          {/* Original Features List */}
          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 text-gold mr-2 shrink-0" />
                <p className="text-sm text-left">{feature}</p>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          {/* Original Button with Enhancement */}
          <Button
            className={cn("w-full", 
              isPrimary 
                ? "bg-gold hover:bg-gold/90 text-white font-medium" 
                : "bg-muted/70 hover:bg-muted text-foreground dark:bg-muted/30 dark:hover:bg-muted/40 dark:text-foreground"
            )}
            onClick={() => handleSubscribe('subscription')}
          >
            Subscribe Now
          </Button>
          
          {/* New One-time Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSubscribe('one-time')}
          >
            Buy Single Class
          </Button>
        </CardFooter>
      </Card>
      
      {/* Original PaymentDialog - Should handle new paymentType */}
      <PaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        paymentRequest={paymentRequest}
      />
    </>
  );
};

export default PricingCard;
