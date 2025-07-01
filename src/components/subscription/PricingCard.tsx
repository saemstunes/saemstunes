import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Users, Download, HelpCircle, BookOpenCheck, Lightning } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import { PaymentRequest } from '@/hooks/usePayment';

interface PricingCardProps {
  plan: {
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
  orderType: 'subscription' | 'one-time';
  classCount?: number;
}

export const calculateRawPrice = (planId: number, classCount: number, paymentType: string): number => {
  let rawPrice = 0;

  switch (planId) {
    case 1: // Free plan
      rawPrice = 0;
      break;
    case 2: // Basic plan
      rawPrice = paymentType === 'one-time' ? 15000 : 10000;
      break;
    case 3: // Premium plan
      rawPrice = paymentType === 'one-time' ? 25000 : 20000;
      break;
    default:
      rawPrice = 0;
      break;
  }

  return rawPrice * classCount;
};

const PricingCard: React.FC<PricingCardProps> = ({ plan, orderType, classCount = 1 }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paystack' | 'remitly' | 'mpesa'>('paystack');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
  if (!user) {
    toast({
      title: 'Sign in required',
      description: 'Please sign in to subscribe to a plan.',
      variant: 'destructive',
    });
    navigate('/auth');
    return;
  }

  const paymentRequest = {
    orderType: orderType as 'subscription' | 'one-time',
    itemId: String(plan.id),
    itemName: plan.name,
    amount: calculateRawPrice(plan.id, classCount, orderType),
    currency: 'USD',
    classCount,
    planId: plan.id,
    paymentType: orderType as 'subscription' | 'one-time'
  };

  // Construct the URL
  const baseUrl = '/payment';
  const params = new URLSearchParams({
    orderType: paymentRequest.orderType,
    itemId: paymentRequest.itemId,
    itemName: paymentRequest.itemName,
    amount: String(paymentRequest.amount),
    currency: paymentRequest.currency || 'USD',
    paymentMethod: selectedPaymentMethod,
    successUrl: `${window.location.origin}/payment-success`,
    cancelUrl: `${window.location.origin}/payment-cancel`,
    classCount: String(paymentRequest.classCount),
    planId: String(paymentRequest.planId),
    paymentType: paymentRequest.paymentType
  });

  const fullUrl = `${baseUrl}?${params.toString()}`;

  // Redirect to the payment page
  navigate(fullUrl);
};

  const handlePaymentMethodChange = (method: 'paystack' | 'remitly' | 'mpesa') => {
    setSelectedPaymentMethod(method);
  };

  const handleProceed = async (phoneNumber?: string) => {
    setIsLoading(true);
    try {
      // Construct the URL
      const baseUrl = '/payment';
      const params = new URLSearchParams({
        orderType: orderType as 'subscription' | 'one-time',
        itemId: String(plan.id),
        itemName: plan.name,
        amount: String(calculateRawPrice(plan.id, classCount, orderType)),
        currency: 'USD',
        paymentMethod: selectedPaymentMethod,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
        classCount: String(classCount),
        planId: String(plan.id),
        paymentType: orderType,
        ...(phoneNumber ? { userPhone: phoneNumber } : {}),
      });

      const fullUrl = `${baseUrl}?${params.toString()}`;

      // Redirect to the payment page
      navigate(fullUrl);
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden",
          plan.isRecommended && "border-2 border-gold shadow-xl"
        )}
      >
        {plan.isRecommended && (
          <div className="absolute top-4 left-4 bg-gold text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
            Recommended
          </div>
        )}
        <CardHeader className="space-y-2.5">
          <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ul className="grid gap-2 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="text-2xl font-bold">
            ${plan.price}
          </div>
          <Button className="w-full" onClick={() => setIsCheckoutOpen(true)}>
            Get Started
          </Button>
        </CardContent>
      </Card>

      <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Payment Details</SheetTitle>
            <SheetDescription>
              Choose your payment method to continue.
            </SheetDescription>
          </SheetHeader>
          <PaymentMethodSelector
            selectedMethod={selectedPaymentMethod}
            onMethodChange={handlePaymentMethodChange}
            onProceed={handleProceed}
            isLoading={isLoading}
            amount={plan.price}
            currency="USD"
            planId={plan.id}
            classCount={classCount}
            orderType={orderType}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PricingCard;
