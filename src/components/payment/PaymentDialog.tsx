
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-proxima">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You're purchasing: {paymentRequest.itemName}
          </DialogDescription>
        </DialogHeader>
        
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
          onProceed={handleProceed}
          isLoading={isLoading}
          amount={paymentRequest.amount}
          currency={paymentRequest.currency}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
