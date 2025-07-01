import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Users, BookOpen, Music, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentDialog from "@/components/payment/PaymentDialog";
import { PaymentRequest } from "@/hooks/usePayment";

export type SubscriptionPlan = {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  isRecommended?: boolean;
  popularClass?: string;
  popularDescription?: string;
  popularIcon?: React.ReactNode;
  annualDiscount?: number;
};

interface PricingCardProps {
  plan: SubscriptionPlan;
  className?: string;
  variant?: "default" | "outline";
  showDescription?: boolean;
  onPlanSelect?: (planId: number) => void;
  isCurrentPlan?: boolean;
  highlightRecommended?: boolean;
  annualMode?: boolean;
  onToggleAnnual?: () => void;
  classCount?: number;
  orderType?: 'subscription' | 'one-time';
}

// Define the calculateRawPrice function based on the pricing structure
export const calculateRawPrice = (planId: number, classCount: number = 1, orderType: 'subscription' | 'one-time' = 'subscription'): number => {
  const basePrices = {
    1: 2999, // Basic - $29.99
    2: 4999, // Premium - $49.99  
    3: 9999  // Professional - $99.99
  };
  
  const basePrice = basePrices[planId as keyof typeof basePrices] || 2999;
  
  if (orderType === 'one-time') {
    return Math.round(basePrice * classCount * 0.15); // 15% of monthly for per-class
  }
  
  return basePrice;
};

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  className,
  variant = "default",
  showDescription = true,
  onPlanSelect,
  isCurrentPlan = false,
  highlightRecommended = true,
  annualMode = false,
  classCount = 1,
  orderType = 'subscription'
}) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const isRecommended = plan.id === 2 && highlightRecommended;
  const rawPrice = calculateRawPrice(plan.id, classCount, orderType);
  const displayPrice = rawPrice / 100;
  
  const annualPrice = displayPrice * 10; // 10 months pricing for annual
  const finalPrice = annualMode ? annualPrice : displayPrice;
  
  const savings = annualMode ? Math.round(displayPrice * 2) : 0;

  const getIconForPlan = (planId: number) => {
    switch (planId) {
      case 1: return <Music className="h-5 w-5 text-gold" />;
      case 2: return <Star className="h-5 w-5 text-gold" />;
      case 3: return <Crown className="h-5 w-5 text-gold" />;
      default: return <Play className="h-5 w-5 text-gold" />;
    }
  };

  const handleSelectPlan = () => {
    if (onPlanSelect) {
      onPlanSelect(plan.id);
    } else {
      setIsPaymentOpen(true);
    }
  };

  const paymentRequest: Omit<PaymentRequest, "paymentMethod"> & { orderType: 'subscription' | 'one-time' } = {
    orderType: orderType,
    itemId: plan.id.toString(),
    itemName: `${plan.name} Plan${orderType === 'one-time' ? ` - ${classCount} classes` : ''}`,
    amount: rawPrice,
    currency: 'USD',
    classCount,
    planId: plan.id,
    orderType: orderType
  };

  return (
    <>
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
          isRecommended && "ring-2 ring-gold shadow-lg scale-105",
          variant === "outline" && "border-2",
          className
        )}
      >
        {isRecommended && (
          <Badge 
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gold to-yellow-500 text-white px-4 py-1 rounded-full z-10"
          >
            <Zap className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        )}

        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-3">
            {getIconForPlan(plan.id)}
          </div>
          
          <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
          
          {showDescription && (
            <CardDescription className="text-sm">
              {plan.description || "Perfect for your musical journey"}
            </CardDescription>
          )}
          
          <div className="mt-4">
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-bold">${finalPrice.toFixed(2)}</span>
              <span className="text-muted-foreground ml-1">
                /{orderType === 'subscription' ? (annualMode ? 'year' : 'month') : `${classCount} class${classCount > 1 ? 'es' : ''}`}
              </span>
            </div>
            
            {annualMode && savings > 0 && (
              <div className="text-sm text-green-600 font-medium mt-1">
                Save ${savings} per year
              </div>
            )}
            
            {orderType === 'subscription' && !annualMode && (
              <div className="text-xs text-muted-foreground mt-1">
                Billed monthly • Cancel anytime
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            className={cn(
              "w-full font-semibold",
              isRecommended 
                ? "bg-gradient-to-r from-gold to-yellow-600 hover:from-gold/90 hover:to-yellow-600/90 text-white"
                : "bg-gold hover:bg-gold/90 text-white",
              isCurrentPlan && "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            onClick={handleSelectPlan}
            disabled={isCurrentPlan}
            size="lg"
          >
            {isCurrentPlan ? "Current Plan" : `Choose ${plan.name}`}
          </Button>
        </CardFooter>
      </Card>

      <PaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        paymentRequest={paymentRequest}
        title={`Subscribe to ${plan.name}`}
        description={`Get access to all ${plan.name} plan features`}
      />
    </>
  );
};

export default PricingCard;
