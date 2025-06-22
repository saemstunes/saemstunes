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
  const isPrimary = variant === "default";
  
  // Conversion rate: 1 USD = 130 KSh
  const USD_TO_KSH_RATE = 130;
  const priceInKSh = plan.price * USD_TO_KSH_RATE;
  
  const handleSubscribe = () => {
    setShowPaymentDialog(true);
  };
  
  const paymentRequest = {
    orderType: 'subscription' as const,
    itemId: plan.id,
    itemName: `${plan.name} Subscription`,
    amount: Math.round(priceInKSh * 100), // Convert KSh to cents
    currency: 'KES' // Kenyan Shilling currency code
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
          <CardDescription className="text-center">{plan.shortDescription || ""}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-4xl font-bold">
              KSh {priceInKSh.toLocaleString()}
              <span className="text-muted-foreground text-sm font-normal">
                /month
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              (${plan.price} USD)
            </p>
            {plan.annualDiscount && (
              <p className="text-sm text-muted-foreground">
                Save KSh {(plan.annualDiscount * USD_TO_KSH_RATE).toLocaleString()} annually
              </p>
            )}
          </div>
          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 text-gold mr-2 shrink-0" />
                <p className="text-sm text-left">{feature}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className={cn("w-full", 
              isPrimary 
                ? "bg-gold hover:bg-gold/90 text-white font-medium" 
                : "bg-muted/70 hover:bg-muted text-foreground dark:bg-muted/30 dark:hover:bg-muted/40 dark:text-foreground"
            )}
            onClick={handleSubscribe}
          >
            Subscribe Now
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
