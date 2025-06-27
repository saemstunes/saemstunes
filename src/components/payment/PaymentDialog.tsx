import React, { useState, useEffect } from "react";
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

// Get environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('🔧 PaymentDialog Environment Check:', {
  url_exists: !!supabaseUrl,
  url_value: supabaseUrl,
  key_exists: !!supabaseAnonKey,
  key_prefix: supabaseAnonKey?.substring(0, 10) + '...'
});

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing or undefined');
}
if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or undefined');
}

// Create Supabase client with fallback error handling
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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

  // Debug effect to check if component receives proper data
  useEffect(() => {
    console.log('💳 PaymentDialog mounted with:', {
      paymentRequest,
      supabaseConfigured: !!supabase,
      supabaseUrl: supabaseUrl
    });
  }, [paymentRequest]);

  const handleProceed = async (phoneNumber?: string) => {
    // Early validation
    if (!supabase) {
      console.error('❌ Supabase client not initialized');
      toast({
        title: "Configuration Error",
        description: "Payment system not properly configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    if (!supabaseUrl) {
      console.error('❌ Supabase URL not available for API call');
      toast({
        title: "Configuration Error",
        description: "Payment service URL not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('🚀 Starting payment process...');

    try {
      // Get the current user session
      console.log('🔍 Getting user session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!session) {
        console.warn('⚠️ No active session found');
        toast({
          title: "Authentication Required",
          description: "Please sign in to proceed with payment.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ User session found:', {
        userId: session.user?.id,
        email: session.user?.email
      });

      // Prepare request body with correct field names
      const requestBody = {
        // Required fields
        orderType: paymentRequest.orderType,
        paymentMethod: selectedMethod,
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

      console.log('📤 Sending payment request:', requestBody);

      // Construct the API URL
      const apiUrl = `${supabaseUrl}/functions/v1/create-payment-session`;
      console.log('🌐 API URL:', apiUrl);

      // Call your Supabase edge function
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);
      
      const data = await response.json();
      console.log('📋 Payment response:', data);

      if (!response.ok) {
        console.error('❌ Payment request failed:', {
          status: response.status,
          data
        });
        throw new Error(data.error || `Payment failed with status ${response.status}`);
      }

      // Handle successful payment session creation
      if (data.success && data.sessionData) {
        const { sessionData } = data;
        console.log('✅ Payment session created successfully');

        switch (selectedMethod) {
          case 'paystack':
          case 'remitly':
            if (sessionData.url) {
              console.log('🔗 Redirecting to payment provider:', sessionData.url);
              window.location.href = sessionData.url;
            } else {
              throw new Error('Payment URL not provided');
            }
            break;

          case 'mpesa':
            console.log('📱 M-Pesa payment initiated');
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
        console.error('❌ Invalid response format:', data);
        throw new Error('Invalid response from payment service');
      }

    } catch (error) {
      console.error('💥 Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 Payment process completed');
    }
  };

  // Show error state if Supabase is not configured
  if (!supabase) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-proxima text-red-600">Configuration Error</DialogTitle>
            <DialogDescription>
              Payment system is not properly configured. Please contact support.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

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
