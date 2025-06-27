import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export interface PaymentRequest {
  orderType: string;
  itemId: number;
  itemName: string;
  amount: number;
  currency: string;
  classCount?: number;
  planId?: number;
  paymentType?: 'subscription' | 'one-time';
}

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: PaymentRequest;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  paymentRequest
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'remitly' | 'mpesa'>('paystack');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProceed = async (phoneNumber?: string) => {
    setIsLoading(true);

    try {
      // Get the current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to proceed with payment.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // FIXED: Prepare request body with correct field names that match your Edge Function
      const requestBody = {
        // Required fields (these were missing!)
        orderType: paymentRequest.orderType,
        paymentMethod: selectedMethod, // This was missing!
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        
        // Optional fields
        itemId: paymentRequest.itemId,
        itemName: paymentRequest.itemName,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
        
        // Additional fields for context
        ...(paymentRequest.classCount && { classCount: paymentRequest.classCount }),
        ...(paymentRequest.planId && { planId: paymentRequest.planId }),
        ...(paymentRequest.paymentType && { paymentType: paymentRequest.paymentType }),
        ...(selectedMethod === 'mpesa' && phoneNumber && { userPhone: phoneNumber })
      };

      console.log('Sending payment request:', requestBody);

      // Call your Supabase edge function
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-payment-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Payment response:', data);

      if (!response.ok) {
        throw new Error(data.error || `Payment failed with status ${response.status}`);
      }

      // Handle successful payment session creation
      if (data.success && data.sessionData) {
        const { sessionData } = data;

        switch (selectedMethod) {
          case 'paystack':
          case 'remitly':
            if (sessionData.url) {
              // Redirect to payment provider
              window.location.href = sessionData.url;
            } else {
              throw new Error('Payment URL not provided');
            }
            break;

          case 'mpesa':
            toast({
              title: "M-Pesa Payment Initiated",
              description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
              duration: 5000,
            });
            onClose();
            break;

          default:
            throw new Error('Unknown payment method');
        }
      } else {
        throw new Error('Invalid response from payment service');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          planId={paymentRequest.planId}
          classCount={paymentRequest.classCount}
          paymentType={paymentRequest.paymentType}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
