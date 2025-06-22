import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Smartphone, Globe } from "lucide-react";
import { calculateRawPrice } from "@/components/subscription/PricingCard";

interface PaymentMethodSelectorProps {
  selectedMethod: 'paystack' | 'remitly' | 'mpesa';
  onMethodChange: (method: 'paystack' | 'remitly' | 'mpesa') => void;
  onProceed: (phoneNumber?: string) => void;
  isLoading: boolean;
  amount: number;
  currency?: string;
  planId?: number;
  classCount?: number;
  paymentType?: 'subscription' | 'one-time';
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  onProceed,
  isLoading,
  amount,
  currency = 'USD',
  planId,
  classCount = 1,
  paymentType = 'subscription'
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const formatAmount = (amount: number, currency: string) => {
    // Use rawPrice if planId is provided, otherwise use the passed amount
    const displayAmount = planId ? calculateRawPrice(planId, classCount, paymentType) : amount;
    
    if (currency === 'USD') {
      return `$${(displayAmount / 130).toFixed(2)}`;
    } else if (currency === 'KES') {
      return `KSh ${(displayAmount / 100).toFixed(2)}`;
    }
    return `${currency} ${(displayAmount / 100).toFixed(2)}`;
  };

  const validatePhoneNumber = (phone: string) => {
    // Kenya phone number validation (254XXXXXXXXX)
    const phoneRegex = /^254[0-9]{9}$/;
    if (!phone) {
      return 'Phone number is required for M-Pesa payments';
    }
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid Kenyan phone number (254XXXXXXXXX)';
    }
    return '';
  };

  const handleProceed = () => {
    if (selectedMethod === 'mpesa') {
      const error = validatePhoneNumber(phoneNumber);
      if (error) {
        setPhoneError(error);
        return;
      }
      onProceed(phoneNumber);
    } else {
      onProceed();
    }
  };

  const handlePhoneChange = (value: string) => {
    // Remove any non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Auto-format: if they start with 07, 01, etc., convert to 254
    let formatted = cleaned;
    if (cleaned.startsWith('0')) {
      formatted = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      formatted = '254' + cleaned;
    }
    
    // Limit to 12 digits (254 + 9 digits)
    if (formatted.length > 12) {
      formatted = formatted.substring(0, 12);
    }
    
    setPhoneNumber(formatted);
    if (phoneError) {
      setPhoneError('');
    }
  };

  const displayAmount = planId ? calculateRawPrice(planId, classCount, paymentType) : amount;

  return (
    <div className="space-y-6">
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-lg font-semibold">
          Total: {formatAmount(displayAmount, currency)}
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Select Payment Method</Label>
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => onMethodChange(value as any)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="paystack" id="paystack" />
            <div className="flex items-center space-x-3 flex-1">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <Label htmlFor="paystack" className="font-medium cursor-pointer">
                  Paystack
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pay with card, bank transfer, or mobile money
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="mpesa" id="mpesa" />
            <div className="flex items-center space-x-3 flex-1">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <Label htmlFor="mpesa" className="font-medium cursor-pointer">
                  M-Pesa
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pay directly with M-Pesa STK Push
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="remitly" id="remitly" />
            <div className="flex items-center space-x-3 flex-1">
              <Globe className="h-5 w-5 text-purple-600" />
              <div>
                <Label htmlFor="remitly" className="font-medium cursor-pointer">
                  Remitly
                </Label>
                <p className="text-sm text-muted-foreground">
                  International transfer to M-Pesa
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      {selectedMethod === 'mpesa' && (
        <div className="space-y-2">
          <Label htmlFor="phone">M-Pesa Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="254712345678"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={phoneError ? "border-red-500" : ""}
          />
          {phoneError && (
            <p className="text-sm text-red-500">{phoneError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter your phone number in the format 254XXXXXXXXX
          </p>
        </div>
      )}

      <Button
        onClick={handleProceed}
        disabled={isLoading}
        className="w-full bg-gold hover:bg-gold/90"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Proceed to Pay ${formatAmount(displayAmount, currency)}`
        )}
      </Button>

      {selectedMethod === 'mpesa' && (
        <div className="text-xs text-muted-foreground text-center">
          You'll receive an STK Push notification on your phone to complete the payment
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
