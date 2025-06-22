import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { usePayment, PaymentRequest } from "@/hooks/usePayment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Pricing configuration mirroring PricingCard.tsx
const PRICING_CONFIG = {
  1: { // Starter
    regular: 1200,
    discounted: 800,
    baseCoefficient: 1.1,
    penaltyMultipliers: [1.0, 1.15, 1.31],
    classCounts: [4, 3, 2],
  },
  2: { // Standard
    regular: 2000,
    discounted: 1500,
    baseCoefficient: 1.05,
    penaltyMultipliers: [1.0, 1.08, 1.26, 1.5],
    classCounts: [6, 5, 4, 3],
  },
  3: { // Professional
    regular: 4500,
    discounted: 3600,
    baseCoefficient: 1.0,
    penaltyMultipliers: [1.0, 1.03, 1.1, 1.32, 1.44],
    classCounts: [12, 10, 8, 6, 5],
  }
};

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: Omit<PaymentRequest, 'paymentMethod'>;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  paymentRequest
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'remitly' | 'mpesa'>('paystack');
  const { processPayment, isLoading } = usePayment();

  const handleProceed = async () => {
    await processPayment({
      ...paymentRequest,
      paymentMethod: selectedMethod
    });
    onClose();
  };

  // Calculate savings for display
  const calculateSavings = () => {
    if (paymentRequest.orderType !== 'subscription') return null;
    
    const planId = paymentRequest.itemId;
    const config = PRICING_CONFIG[planId as keyof typeof PRICING_CONFIG];
    if (!config) return null;

    const regularPrice = config.regular;
    const discountedPrice = config.discounted;
    const savings = regularPrice - discountedPrice;
    const savingsPercentage = Math.round((savings / regularPrice) * 100);

    return {
      amount: savings,
      percentage: savingsPercentage
    };
  };

  const savings = calculateSavings();
  const isSubscription = paymentRequest.orderType === 'subscription';
  const displayAmount = (paymentRequest.amount / 100).toLocaleString();
  const planName = paymentRequest.itemName.replace(' Subscription', '').replace(/Class Pack \(\d+ classes\)/, '').trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg border-0 shadow-lg">
        <DialogHeader className="space-y-4">
          <DialogTitle className="font-proxima text-center text-xl">
            {isSubscription ? 'Confirm Subscription' : 'Confirm Class Purchase'}
          </DialogTitle>
          
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-muted">
            <p className="text-sm font-medium text-center">
              {planName} Plan
            </p>
            
            <div className="flex flex-col items-center">
              {isSubscription ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gold">
                      KSh {displayAmount}
                    </span>
                    {savings && (
                      <span className="text-muted-foreground line-through">
                        KSh {savings.amount + parseInt(displayAmount)}
                      </span>
                    )}
                  </div>
                  {savings && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                      Save {savings.percentage}%
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    per month, billed monthly
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gold">
                    KSh {displayAmount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentRequest.classCount} classes
                    {paymentRequest.classCount && paymentRequest.classCount > 1 && (
                      <span> · KSh {Math.round(parseInt(displayAmount) / paymentRequest.classCount)} per class</span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
          onProceed={handleProceed}
          isLoading={isLoading}
          amount={paymentRequest.amount}
          currency={paymentRequest.currency}
        />

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleProceed}
            disabled={isLoading}
            className={cn(
              "w-full font-medium py-5 bg-gold hover:bg-gold/90 text-white",
              isLoading && "opacity-70"
            )}
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full py-5"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
