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

// Environment variables with better validation
const getEnvironmentConfig = () => {
  const config = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  // Debug logging
  console.log('🔧 Environment Configuration:', {
    supabaseUrl: config.supabaseUrl ? '✅ Set' : '❌ Missing',
    supabaseAnonKey: config.supabaseAnonKey ? '✅ Set' : '❌ Missing',
    urlValue: config.supabaseUrl || 'undefined',
    keyPrefix: config.supabaseAnonKey ? `${config.supabaseAnonKey.substring(0, 10)}...` : 'undefined'
  });

  return config;
};

const envConfig = getEnvironmentConfig();

// Create Supabase client only if environment variables are available
let supabase: ReturnType<typeof createClient> | null = null;

try {
  if (envConfig.supabaseUrl && envConfig.supabaseAnonKey) {
    supabase = createClient(envConfig.supabaseUrl, envConfig.supabaseAnonKey);
    console.log('✅ Supabase client created successfully');
  } else {
    console.error('❌ Cannot create Supabase client: Missing environment variables');
  }
} catch (error) {
  console.error('❌ Error creating Supabase client:', error);
}

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
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const { toast } = useToast();

  // Component initialization effect
  useEffect(() => {
    console.log('💳 PaymentDialog Component Mounted');
    console.log('📋 Payment Request:', paymentRequest);
    console.log('🔌 Supabase Status:', supabase ? 'Connected' : 'Not Connected');

    // Check for initialization errors
    if (!supabase) {
      const errorMessage = 'Payment system not properly configured';
      setInitializationError(errorMessage);
      console.error('❌ Initialization Error:', errorMessage);
    } else {
      setInitializationError(null);
    }
  }, [paymentRequest]);

  const validatePaymentRequest = (request: PaymentRequest): boolean => {
    const required = ['orderType', 'itemId', 'itemName', 'amount', 'currency'];
    const missing = required.filter(field => !request[field as keyof PaymentRequest]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required payment fields:', missing);
      return false;
    }
    
    return true;
  };

  const handleProceed = async (phoneNumber?: string) => {
    console.log('🚀 Payment process initiated');

    // Validate payment request
    if (!validatePaymentRequest(paymentRequest)) {
      toast({
        title: "Invalid Payment Request",
        description: "Missing required payment information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Check Supabase client
    if (!supabase) {
      console.error('❌ Supabase client not available');
      toast({
        title: "Configuration Error",
        description: "Payment system not properly configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    // Check environment variables
    if (!envConfig.supabaseUrl) {
      console.error('❌ Supabase URL not configured');
      toast({
        title: "Configuration Error",
        description: "Payment service URL not available. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get user session
      console.log('🔍 Retrieving user session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!session?.access_token) {
        console.warn('⚠️ No valid session found');
        toast({
          title: "Authentication Required",
          description: "Please sign in to proceed with payment.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ User authenticated:', {
        userId: session.user?.id,
        email: session.user?.email,
        tokenExists: !!session.access_token
      });

      // Prepare request body
      const requestBody = {
        orderType: paymentRequest.orderType,
        paymentMethod: selectedMethod,
        amount: Number(paymentRequest.amount),
        currency: paymentRequest.currency,
        itemId: Number(paymentRequest.itemId),
        itemName: paymentRequest.itemName,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
        
        // Optional fields
        ...(paymentRequest.classCount && { classCount: Number(paymentRequest.classCount) }),
        ...(paymentRequest.planId && { planId: Number(paymentRequest.planId) }),
        ...(paymentRequest.paymentType && { paymentType: paymentRequest.paymentType }),
        ...(selectedMethod === 'mpesa' && phoneNumber && { userPhone: phoneNumber })
      };

      console.log('📤 Request payload:', requestBody);

      // Make API call
      const apiUrl = `${envConfig.supabaseUrl}/functions/v1/create-payment-session`;
      console.log('🌐 API endpoint:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      let responseData;
      try {
        responseData = await response.json();
        console.log('📋 Response data:', responseData);
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        throw new Error('Invalid response format from payment service');
      }

      if (!response.ok) {
        console.error('❌ API request failed:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        
        const errorMessage = responseData?.error || 
                           responseData?.message || 
                           `Payment request failed (${response.status})`;
        throw new Error(errorMessage);
      }

      // Handle successful response
      if (responseData?.success && responseData?.sessionData) {
        const { sessionData } = responseData;
        console.log('✅ Payment session created:', sessionData);

        switch (selectedMethod) {
          case 'paystack':
          case 'remitly':
            if (sessionData.url) {
              console.log('🔗 Redirecting to:', sessionData.url);
              window.location.href = sessionData.url;
            } else {
              throw new Error('Payment URL not provided in response');
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
            throw new Error(`Unsupported payment method: ${selectedMethod}`);
        }
      } else {
        console.error('❌ Unexpected response format:', responseData);
        throw new Error('Payment service returned unexpected response format');
      }

    } catch (error) {
      console.error('💥 Payment process failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 Payment process completed');
    }
  };

  // Render error state if system is not properly configured
  if (initializationError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-proxima text-red-600">
              Configuration Error
            </DialogTitle>
            <DialogDescription>
              {initializationError}. Please contact support for assistance.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // Render main payment dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-proxima">
            Complete Your Purchase
          </DialogTitle>
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
