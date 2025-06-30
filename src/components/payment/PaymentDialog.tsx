import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { useToast } from "@/hooks/use-toast";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Types
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

type PaymentMethod = 'paystack' | 'remitly' | 'mpesa';

interface PaymentResponse {
  success: boolean;
  sessionData?: {
    url?: string;
    transactionId?: string;
  };
  error?: string;
  message?: string;
}

interface EnvironmentConfig {
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
}

// Environment configuration with better error handling
const getEnvironmentConfig = (): EnvironmentConfig => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  // Client-side environment variables
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || (window as any).ENV?.SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (window as any).ENV?.SUPABASE_ANON_KEY,
  };
};

// Custom hook for Supabase client
const useSupabaseClient = () => {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeClient = () => {
      try {
        const config = getEnvironmentConfig();
        
        if (!config.supabaseUrl || !config.supabaseAnonKey) {
          setError('Missing Supabase configuration');
          console.error('❌ Cannot create Supabase client: Missing environment variables', {
            supabaseUrl: config.supabaseUrl ? '✅ Set' : '❌ Missing',
            supabaseAnonKey: config.supabaseAnonKey ? '✅ Set' : '❌ Missing',
          });
          return;
        }

        const supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
        setClient(supabaseClient);
        setError(null);
        console.log('✅ Supabase client created successfully');
      } catch (err) {
        const errorMessage = 'Failed to initialize Supabase client';
        setError(errorMessage);
        console.error('❌ Error creating Supabase client:', err);
      }
    };

    initializeClient();
  }, []);

  return { client, error };
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  paymentRequest
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paystack');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { client: supabase, error: supabaseError } = useSupabaseClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const MAX_RETRIES = 3;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsLoading(false);
    };
  }, []);

  // Log component mount and payment request
  useEffect(() => {
    if (isOpen) {
      console.log('💳 PaymentDialog Component Mounted');
      console.log('📋 Payment Request:', paymentRequest);
      console.log('🔌 Supabase Status:', supabase ? 'Connected' : 'Not Connected');
    }
  }, [isOpen, paymentRequest, supabase]);

  const validatePaymentRequest = useCallback((request: PaymentRequest): boolean => {
    const required: (keyof PaymentRequest)[] = ['orderType', 'itemId', 'itemName', 'amount', 'currency'];
    const missing = required.filter(field => {
      const value = request[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missing.length > 0) {
      console.error('❌ Missing required payment fields:', missing);
      return false;
    }

    // Validate amount is positive
    if (request.amount <= 0) {
      console.error('❌ Invalid amount:', request.amount);
      return false;
    }
    
    return true;
  }, []);

  const isNetworkError = (error: Error): boolean => {
    return error.message.toLowerCase().includes('fetch') || 
           error.message.toLowerCase().includes('network') ||
           error.message.toLowerCase().includes('timeout') ||
           error.name === 'AbortError';
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
        description: supabaseError || "Payment system not properly configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    // Validate M-Pesa phone number
    if (selectedMethod === 'mpesa' && !phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number for M-Pesa payment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

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

      // Get environment config
      const envConfig = getEnvironmentConfig();
      if (!envConfig.supabaseUrl) {
        throw new Error('Supabase URL not configured');
      }

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

      // Make API call with timeout
      const apiUrl = `${envConfig.supabaseUrl}/functions/v1/create-payment-session`;
      console.log('🌐 API endpoint:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      console.log('📥 Response status:', response.status);

      let responseData: PaymentResponse;
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

        // Reset retry count on success
        setRetryCount(0);
      } else {
        console.error('❌ Unexpected response format:', responseData);
        throw new Error('Payment service returned unexpected response format');
      }

    } catch (error) {
      console.error('💥 Payment process failed:', error);
      
      // Handle abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🚫 Payment request was cancelled');
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Check if we should retry
      if (error instanceof Error && isNetworkError(error) && retryCount < MAX_RETRIES) {
        console.log(`🔄 Retrying payment request (${retryCount + 1}/${MAX_RETRIES})`);
        setRetryCount(retryCount + 1);
        
        // Retry after a delay
        setTimeout(() => {
          handleProceed(phoneNumber);
        }, 1000 * (retryCount + 1));
        
        toast({
          title: "Connection Issue",
          description: `Retrying payment request (${retryCount + 1}/${MAX_RETRIES})...`,
          duration: 3000,
        });
        return;
      }
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      console.log('🏁 Payment process completed');
    }
  };

  // Render error state if system is not properly configured
  if (supabaseError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-proxima text-red-600">
              Configuration Error
            </DialogTitle>
            <DialogDescription>
              {supabaseError}. Please contact support for assistance.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // Don't render if Supabase client is not ready
  if (!supabase) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-proxima">
              Loading Payment System...
            </DialogTitle>
            <DialogDescription>
              Please wait while we initialize the payment system.
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
