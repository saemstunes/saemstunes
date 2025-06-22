import React, { useState, useEffect } from "react";
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

// Tier-specific pricing configuration
const TIER_BUNDLES = {
  1: [ // Starter
    { classCount: 4, totalPrice: 1600, perClass: 400 },
    { classCount: 3, totalPrice: 1650, perClass: 550 },
    { classCount: 2, totalPrice: 1800, perClass: 900 }
  ],
  2: [ // Standard
    { classCount: 6, totalPrice: 2100, perClass: 350 },
    { classCount: 5, totalPrice: 2500, perClass: 500 },
    { classCount: 4, totalPrice: 2800, perClass: 700 },
    { classCount: 3, totalPrice: 3000, perClass: 1000 }
  ],
  3: [ // Professional
    { classCount: 12, totalPrice: 3600, perClass: 300 },
    { classCount: 10, totalPrice: 5000, perClass: 500 },
    { classCount: 8, totalPrice: 5200, perClass: 650 },
    { classCount: 6, totalPrice: 6000, perClass: 1000 },
    { classCount: 5, totalPrice: 6750, perClass: 1350 }
  ]
};

const TIER_SUBSCRIPTION_PRICE = {
  1: 1200, // Starter regular price
  2: 2000, // Standard regular price
  3: 4500  // Professional regular price
};

const PricingCard: React.FC<PricingCardProps> = ({ plan, variant = "default", className }) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<'subscription' | 'bundle'>('subscription');
  const [selectedBundle, setSelectedBundle] = useState<{ classCount: number; totalPrice: number; perClass: number } | null>(null);
  const isPrimary = variant === "default";
  const isTieredPlan = [1, 2, 3].includes(plan.id);

  // Initialize selected bundle
  useEffect(() => {
    if (isTieredPlan) {
      setSelectedBundle(TIER_BUNDLES[plan.id as keyof typeof TIER_BUNDLES][0]);
    }
  }, [plan.id, isTieredPlan]);

  // Calculate subscription price with first-month discount
  const getSubscriptionPrice = () => {
    if (!isTieredPlan) return plan.price * 130;
    
    const regularPrice = TIER_SUBSCRIPTION_PRICE[plan.id as keyof typeof TIER_SUBSCRIPTION_PRICE];
    switch(plan.id) {
      case 1: return 800;  // 33% discount
      case 2: return 1500; // 25% discount
      case 3: return 3600; // 20% discount
      default: return regularPrice;
    }
  };

  const subscriptionPrice = getSubscriptionPrice();
  const regularPrice = isTieredPlan 
    ? TIER_SUBSCRIPTION_PRICE[plan.id as keyof typeof TIER_SUBSCRIPTION_PRICE] 
    : plan.price * 130;

  const discountPercentage = isTieredPlan
    ? Math.round((1 - (subscriptionPrice / regularPrice)) * 100)
    : 0;

  const handlePayment = (type: 'subscription' | 'bundle') => {
    setPaymentType(type);
    setShowPaymentDialog(true);
  };

  const paymentRequest = {
    orderType: paymentType,
    itemId: plan.id,
    itemName: paymentType === 'subscription'
      ? `${plan.name} Subscription`
      : `${plan.name} Bundle (${selectedBundle?.classCount} classes)`,
    amount: paymentType === 'subscription'
      ? Math.round(subscriptionPrice * 100)
      : selectedBundle
        ? Math.round(selectedBundle.totalPrice * 100)
        : 0,
    currency: 'KES',
    ...(paymentType === 'bundle' && selectedBundle && { 
      classCount: selectedBundle.classCount 
    })
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
          {/* Subscription Pricing */}
          <div className="space-y-2">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold">
                KSh {subscriptionPrice.toLocaleString()}
                <span className="text-muted-foreground text-sm font-normal">
                  /month
                </span>
              </p>
              
              {isTieredPlan && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground line-through">
                    KSh {regularPrice.toLocaleString()}
                  </p>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-medium">
                    {discountPercentage}% OFF first month
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Bundle Purchase Options */}
          {isTieredPlan && selectedBundle && (
            <div className="space-y-3 p-4 border border-muted rounded-lg">
              <h4 className="font-semibold text-sm uppercase tracking-wide">
                Class Bundles
              </h4>
              
              <div className="w-full">
                <select
                  value={selectedBundle.classCount}
                  onChange={(e) => {
                    const bundle = TIER_BUNDLES[plan.id as keyof typeof TIER_BUNDLES]
                      .find(b => b.classCount === parseInt(e.target.value));
                    if (bundle) setSelectedBundle(bundle);
                  }}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                >
                  {TIER_BUNDLES[plan.id as keyof typeof TIER_BUNDLES].map((bundle) => (
                    <option key={bundle.classCount} value={bundle.classCount}>
                      {bundle.classCount} classes
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  KSh {selectedBundle.totalPrice.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedBundle.perClass.toLocaleString()} per class
                </p>
                
                {/* Premium Indicator */}
                {selectedBundle.classCount < TIER_BUNDLES[plan.id as keyof typeof TIER_BUNDLES][0].classCount && (
                  <p className="text-xs text-amber-600 font-medium">
                    +{Math.round((
                      (selectedBundle.totalPrice / selectedBundle.classCount) / 
                      (subscriptionPrice / TIER_BUNDLES[plan.id as keyof typeof TIER_BUNDLES][0].classCount) - 1
                    ) * 100)}% premium
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Features List */}
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
          {/* Subscription Button */}
          <Button
            className={cn("w-full", 
              isPrimary 
                ? "bg-gold hover:bg-gold/90 text-white font-medium" 
                : "bg-muted/70 hover:bg-muted text-foreground dark:bg-muted/30 dark:hover:bg-muted/40 dark:text-foreground"
            )}
            onClick={() => handlePayment('subscription')}
          >
            Subscribe Now
          </Button>
          
          {/* Bundle Button */}
          {isTieredPlan && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handlePayment('bundle')}
            >
              Buy Class Bundle
            </Button>
          )}
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
