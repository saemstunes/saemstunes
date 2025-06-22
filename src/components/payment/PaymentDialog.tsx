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

  // Format amount for display
  const displayAmount = (paymentRequest.amount / 100).toLocaleString();
  const isSubscription = paymentRequest.orderType === 'subscription';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg border-0 shadow-lg">
        <DialogHeader className="space-y-4">
          <DialogTitle className="font-proxima text-center text-xl">
            Complete Your Purchase
          </DialogTitle>
          <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-center">
              You're purchasing: <span className="text-gold">{paymentRequest.itemName}</span>
            </p>
            <p className="text-2xl font-bold text-center">
              KSh {displayAmount}
              {isSubscription && (
                <span className="text-muted-foreground text-sm font-normal ml-1">
                  /month
                </span>
              )}
            </p>
            {paymentRequest.classCount && (
              <p className="text-sm text-center text-muted-foreground">
                {paymentRequest.classCount} classes included
              </p>
            )}
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
