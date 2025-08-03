import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { usePayment, PaymentRequest } from "@/hooks/usePayment";
import { useToast } from "@/hooks/use-toast";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: Omit<PaymentRequest, 'paymentMethod'>;
}

type PaymentMethod = 'paystack' | 'remitly' | 'mpesa';

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  paymentRequest
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const { processPayment } = usePayment();
  const { toast } = useToast();
  const isMounted = useRef(true);
  const retryCountRef = useRef(0);
  
  const MAX_RETRIES = 3;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      retryCountRef.current = 0;
    }
  }, [isOpen]);

  const validateRequest = useCallback((): boolean => {
    const requiredFields: (keyof typeof paymentRequest)[] = [
      'itemId', 'itemName', 'amount', 'currency'
    ];
    
    const missingFields = requiredFields.filter(
      field => !paymentRequest[field] && paymentRequest[field] !== 0
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Required fields missing: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    if (paymentRequest.amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be greater than zero",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [paymentRequest, toast]);

  const isNetworkError = (error: unknown): boolean => {
    return error instanceof Error && (
      error.message.toLowerCase().includes('network') || 
      error.message.toLowerCase().includes('fetch') ||
      error.message.toLowerCase().includes('timeout')
    );
  };

  const handlePayment = useCallback(async (phoneNumber?: string) => {
    if (!validateRequest()) return false;

    try {
      const payload: PaymentRequest = {
        ...paymentRequest,
        paymentMethod: selectedMethod,
        ...(selectedMethod === 'mpesa' && { userPhone: phoneNumber })
      };

      await processPayment(payload);
      return true;
    } catch (error) {
      throw error;
    }
  }, [validateRequest, paymentRequest, selectedMethod, processPayment]);

  const handleProceed = useCallback(async (phoneNumber?: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Validate M-Pesa phone number
    if (selectedMethod === 'mpesa' && !phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number for M-Pesa payment.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    try {
      const success = await handlePayment(phoneNumber);
      
      if (success) {
        if (selectedMethod === 'mpesa') {
          toast({
            title: "M-Pesa Payment Initiated",
            description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
            duration: 5000,
          });
        }
        
        retryCountRef.current = 0;
        onClose();
      }
    } catch (error) {
      retryCountRef.current++;
      
      // Handle retryable network errors
      if (isNetworkError(error) && retryCountRef.current <= MAX_RETRIES) {
        const retryDelay = 1000 * retryCountRef.current * retryCountRef.current;
        
        toast({
          title: "Connection Issue",
          description: `Retrying payment (${retryCountRef.current}/${MAX_RETRIES})...`,
          duration: 3000,
        });
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return handleProceed(phoneNumber);
      }
      
      // Final error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Payment processing failed';
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      retryCountRef.current = 0;
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  }, [isProcessing, selectedMethod, toast, handlePayment, onClose]);

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
          isLoading={isProcessing}
          amount={paymentRequest.amount}
          currency={paymentRequest.currency}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
