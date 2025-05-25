
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PaymentRequest {
  orderType: 'subscription' | 'service' | 'product';
  itemId: string;
  itemName: string;
  amount: number;
  currency?: string;
  paymentMethod: 'stripe' | 'paypal' | 'mpesa';
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentSession {
  orderId: string;
  sessionData: {
    sessionId: string;
    url?: string;
    provider: string;
    checkoutRequestId?: string;
  };
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPaymentSession = async (request: PaymentRequest): Promise<PaymentSession | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          ...request,
          currency: request.currency || 'USD'
        }
      });

      if (error) throw error;

      if (data?.success) {
        return {
          orderId: data.orderId,
          sessionData: data.sessionData
        };
      }

      throw new Error('Failed to create payment session');
    } catch (error) {
      console.error('Payment session creation failed:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToPayment = (sessionData: PaymentSession['sessionData']) => {
    if (sessionData.url) {
      window.location.href = sessionData.url;
    } else if (sessionData.provider === 'mpesa') {
      toast({
        title: "M-Pesa Payment",
        description: "Please check your phone for the M-Pesa payment prompt.",
      });
    }
  };

  const processPayment = async (request: PaymentRequest) => {
    const session = await createPaymentSession(request);
    if (session) {
      redirectToPayment(session.sessionData);
    }
  };

  return {
    isLoading,
    createPaymentSession,
    redirectToPayment,
    processPayment
  };
};
