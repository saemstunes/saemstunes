
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentRequest {
  orderType: 'subscription' | 'service' | 'product';
  itemId: string;
  itemName: string;
  amount: number;
  currency?: string;
  paymentMethod: 'paystack' | 'remitly' | 'mpesa';
  successUrl?: string;
  cancelUrl?: string;
  userPhone?: string; // Required for M-Pesa
}

export interface PaymentSession {
  orderId: string;
  sessionData: {
    sessionId: string;
    url?: string;
    provider: string;
    checkoutRequestId?: string;
    merchantRequestId?: string;
  };
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPaymentSession = async (
    request: PaymentRequest
  ): Promise<PaymentSession | null> => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Authentication Required',
          description:
            'Please sign in to proceed with payment. You need an account to purchase subscriptions and book classes.',
          variant: 'destructive',
          duration: 6000,
        });
        return null;
      }

      if (request.paymentMethod === 'mpesa' && !request.userPhone) {
        toast({
          title: 'Phone Number Required',
          description:
            'Please provide your M-Pesa phone number to proceed with payment.',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase.functions.invoke(
        'create-payment-session',
        {
          body: {
            amount: request.amount,
            currency: request.currency || 'USD',
            item_name: request.itemName,
            item_id: request.itemId,
            order_type: request.orderType,
            payment_method: request.paymentMethod,
            success_url: request.successUrl,
            cancel_url: request.cancelUrl,
            user_phone: request.userPhone,
          },
        }
      );

      if (error) {
        if (
          error.message?.includes('Authentication required') ||
          error.message?.includes('requiresAuth')
        ) {
          toast({
            title: 'Sign In Required',
            description:
              'Please sign in to your account to purchase subscriptions or book classes.',
            variant: 'destructive',
            duration: 8000,
          });
          return null;
        }

        throw error;
      }

      if (data?.success) {
        if (request.paymentMethod === 'mpesa') {
          toast({
            title: 'M-Pesa Payment Initiated',
            description:
              'Please check your phone for the M-Pesa payment prompt and enter your PIN to complete the payment.',
            duration: 8000,
          });
        }

        return {
          orderId: data.orderId,
          sessionData: data.sessionData,
        };
      }

      throw new Error('Failed to create payment session');
    } catch (error: any) {
      console.error('Payment session creation failed:', error);

      if (error.message?.includes('Phone number required')) {
        toast({
          title: 'Phone Number Required',
          description:
            'Please provide your M-Pesa phone number in the format 254XXXXXXXXX to proceed with payment.',
          variant: 'destructive',
        });
      } else if (
        error.message?.includes('Authentication required') ||
        error.message?.includes('sign in')
      ) {
        toast({
          title: 'Sign In Required',
          description:
            'Please sign in to your account to purchase subscriptions or book classes.',
          variant: 'destructive',
          duration: 6000,
        });
      } else {
        toast({
          title: 'Payment Error',
          description:
            error.message ||
            'Failed to initialize payment. Please try again.',
          variant: 'destructive',
        });
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToPayment = (sessionData: PaymentSession['sessionData']) => {
    if (sessionData.url) {
      window.open(sessionData.url, '_blank');
    } else if (sessionData.provider === 'mpesa') {
      toast({
        title: 'M-Pesa Payment Initiated',
        description:
          'Please check your phone for the M-Pesa payment prompt. Enter your PIN to complete the payment.',
        duration: 10000,
      });
    } else if (sessionData.provider === 'remitly') {
      toast({
        title: 'Remitly Transfer',
        description:
          'Redirecting to Remitly for international transfer to M-Pesa...',
      });
    }
  };

  const processPayment = async (request: PaymentRequest) => {
    const session = await createPaymentSession(request);
    if (session) {
      redirectToPayment(session.sessionData);
      return session;
    }
    return null;
  };

  return {
    isLoading,
    createPaymentSession,
    redirectToPayment,
    processPayment,
  };
};
