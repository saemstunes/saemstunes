
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/EnhancedAuthContext";

export interface PaymentRequest {
  orderType: 'subscription' | 'service' | 'product';
  itemId: string;
  itemName: string;
  amount: number;
  currency?: string;
  paymentMethod: 'paystack' | 'remitly' | 'mpesa';
  successUrl?: string;
  cancelUrl?: string;
  guestCheckout?: boolean;
}

export interface PaymentSession {
  orderId: string;
  sessionData: {
    sessionId: string;
    url?: string;
    provider: string;
    checkoutRequestId?: string;
    message?: string;
  };
}

export const useEnhancedPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const createPaymentSession = async (request: PaymentRequest): Promise<PaymentSession | null> => {
    setIsLoading(true);
    try {
      // Get auth token if user is logged in
      const authHeader = user ? `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` : undefined;

      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          ...request,
          currency: request.currency || 'USD',
          userEmail: user?.email || profile?.email || request.guestCheckout ? 'guest@saemstunes.com' : undefined,
          guestCheckout: !user || request.guestCheckout
        },
        headers: authHeader ? { Authorization: authHeader } : undefined
      });

      if (error) {
        console.error('Payment session error:', error);
        throw new Error(error.message || 'Failed to create payment session');
      }

      if (data?.success) {
        return {
          orderId: data.orderId,
          sessionData: data.sessionData
        };
      }

      throw new Error(data?.error || 'Failed to create payment session');
    } catch (error: any) {
      console.error('Payment session creation failed:', error);
      
      let errorMessage = 'Failed to initialize payment. Please try again.';
      
      if (error.message?.includes('Missing required fields')) {
        errorMessage = 'Please fill in all required payment information.';
      } else if (error.message?.includes('Amount must be greater than 0')) {
        errorMessage = 'Please enter a valid payment amount.';
      } else if (error.message?.includes('Paystack')) {
        errorMessage = 'Payment provider error. Please try a different payment method.';
      } else if (error.message?.includes('configuration missing')) {
        errorMessage = 'Payment system is temporarily unavailable. Please try again later.';
      }
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToPayment = (sessionData: PaymentSession['sessionData']) => {
    if (sessionData.url) {
      // Open payment URL in new tab for better UX
      const paymentWindow = window.open(sessionData.url, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
      
      if (!paymentWindow) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups and try again.",
          variant: "destructive",
        });
        return;
      }

      // Monitor the payment window
      const checkClosed = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkClosed);
          toast({
            title: "Payment Window Closed",
            description: "If you completed the payment, it may take a few minutes to process.",
          });
        }
      }, 1000);

    } else if (sessionData.provider === 'mpesa') {
      toast({
        title: "M-Pesa Payment",
        description: sessionData.message || "Please check your phone for the M-Pesa payment prompt.",
        duration: 10000,
      });
    } else if (sessionData.provider === 'remitly') {
      toast({
        title: "Remitly Transfer",
        description: "Redirecting to Remitly for international transfer to M-Pesa...",
      });
    }
  };

  const processPayment = async (request: PaymentRequest) => {
    // Validate request before processing
    if (!request.itemId || !request.itemName || !request.amount || request.amount <= 0) {
      toast({
        title: "Invalid Payment",
        description: "Please check your payment details and try again.",
        variant: "destructive",
      });
      return;
    }

    const session = await createPaymentSession(request);
    if (session) {
      redirectToPayment(session.sessionData);
      return session;
    }
    return null;
  };

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, payment_provider_id, updated_at')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in checkPaymentStatus:', error);
      return null;
    }
  };

  return {
    isLoading,
    createPaymentSession,
    redirectToPayment,
    processPayment,
    checkPaymentStatus
  };
};
