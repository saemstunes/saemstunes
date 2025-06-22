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
  
  // Pricing structure with first-month discounts - using plan.id directly
  const pricingData = {
    [plan.id]: { // Use plan.id as key
      regular: plan.price * USD_TO_KSH_RATE,
      discounted: 0,
      discount: 0,
      oneTime: Math.round(plan.price * USD_TO_KSH_RATE * 0.3)
    }
  };
  
  // Apply tier-specific pricing if available
  if (plan.id === 1) { // Starter
    pricingData[1] = {
      regular: 1200,
      discounted: 800,
      discount: 33.33,
      oneTime: 400
    };
  } else if (plan.id === 2) { // Standard
    pricingData[2] = {
      regular: 2000,
      discounted: 1500,
      discount: 25,
      oneTime: 350
    };
  } else if (plan.id === 3) { // Professional
    pricingData[3] = {
      regular: 4500,
      discounted: 3600,
      discount: 20,
      oneTime: 300
    };
  }
  
  const currentPricing = pricingData[plan.id];
  
  const handleSubscribe = (type: 'subscription' | 'one-time') => {
    setPaymentType(type);
    setShowPaymentDialog(true);
  };
  
  const paymentRequest = {
    orderType: paymentType,
    itemId: plan.id,
    itemName: `${plan.name} ${paymentType === 'subscription' ? 'Subscription' : 'Class'}`,
    amount: Math.round((paymentType === 'subscription' 
      ? currentPricing.discounted 
      : currentPricing.oneTime) * 100),
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
          {/* Subscription Pricing */}
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
              {currentPricing.discount > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground line-through text-center">
                    Regular: KSh {currentPricing.regular.toLocaleString()}/month
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    First month special - then KSh {currentPricing.regular.toLocaleString()}/month
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Regular: KSh {currentPricing.regular.toLocaleString()}/month
                </p>
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
          
          {/* Features List - Original Implementation */}
          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 text-gold mr-2 shrink-0" />
                <p className="text-sm text-left">{feature}</p>
              </div>
            ))}
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
