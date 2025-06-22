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
  
  // Pricing structure with first-month discounts
  const pricingData = {
    1: { // Tier 1 - Starter
      regular: 1200,
      discounted: 800,
      discount: 33.33,
      oneTime: 400
    },
    2: { // Tier 2 - Standard
      regular: 2000,
      discounted: 1500,
      discount: 25,
      oneTime: 350
    },
    3: { // Tier 3 - Professional
      regular: 4500,
      discounted: 3600,
      discount: 20,
      oneTime: 300
    }
  };
  
  // Get pricing for current plan, fallback to original USD conversion if not found
  const currentPricing = pricingData[plan.id as keyof typeof pricingData] || {
    regular: Math.round(plan.price * USD_TO_KSH_RATE),
    discounted: Math.round(plan.price * USD_TO_KSH_RATE),
    discount: 0,
    oneTime: Math.round(plan.price * USD_TO_KSH_RATE * 0.3)
  };
  
  const handleSubscribe = (type: 'subscription' | 'one-time') => {
    setPaymentType(type);
    setShowPaymentDialog(true);
  };
  
  const paymentRequest = {
    orderType: paymentType,
    itemId: plan.id,
    itemName: `${plan.name} ${paymentType === 'subscription' ? 'Subscription' : 'Class'}`,
    amount: Math.round((paymentType === 'subscription' ? currentPricing.discounted : currentPricing.oneTime) * 100),
    currency: 'KES'
  };
  
  return (
    <>
      <Card
        className={cn(
          "flex flex-col justify-between h-full",
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
        
        <CardContent className="space-y-6">
          {/* Monthly Subscription Pricing */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-sm text-gold uppercase tracking-wide text-center">
              Monthly Subscription
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-bold text-gold">
                  KSh {currentPricing.discounted.toLocaleString()}
                </p>
                {currentPricing.discount > 0 && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-medium">
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
          <div className="space-y-3 p-4 border border-muted rounded-lg">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-center">
              Pay Per Class
            </h4>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-center">
                KSh {currentPricing.oneTime.toLocaleString()}
                <span className="text-muted-foreground text-sm font-normal ml-1">
                  /class
                </span>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                No commitment • Pay as you go
              </p>
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-3 pt-4">
            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                  <p className="text-sm text-left">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pt-0">
          <Button
            className={cn("w-full font-medium", 
              isPrimary 
                ? "bg-gold hover:bg-gold/90 text-white" 
                : "bg-muted/70 hover:bg-muted text-foreground dark:bg-muted/30 dark:hover:bg-muted/40"
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
            Buy Single Class
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
