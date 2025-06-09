
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentRequest {
  amount: number;
  currency: string;
  itemName: string;
  itemId: string;
  orderType: string;
  paymentMethod: 'paystack' | 'remitly' | 'mpesa';
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processPayment = async (paymentRequest: PaymentRequest) => {
    setIsLoading(true);
    
    try {
      console.log('Processing payment with:', paymentRequest);
      
      // Call the create-payment-session edge function with better error handling
      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          amount: paymentRequest.amount,
          currency: paymentRequest.currency,
          item_name: paymentRequest.itemName,
          item_id: paymentRequest.itemId,
          order_type: paymentRequest.orderType,
          payment_method: paymentRequest.paymentMethod
        }
      });

      if (error) {
        console.error('Payment session error:', error);
        toast({
          title: "Payment Error",
          description: error.message || "Failed to create payment session",
          variant: "destructive",
        });
        return;
      }

      if (data?.session_url) {
        // Redirect to payment provider
        window.location.href = data.session_url;
      } else {
        console.error('No session URL returned:', data);
        toast({
          title: "Payment Error", 
          description: "No payment URL received",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { processPayment, isLoading };
};
