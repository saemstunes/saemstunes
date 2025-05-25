
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Globe, DollarSign } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: 'paystack' | 'remitly' | 'mpesa';
  onMethodChange: (method: 'paystack' | 'remitly' | 'mpesa') => void;
  onProceed: () => void;
  isLoading?: boolean;
  amount: number;
  currency?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  onProceed,
  isLoading = false,
  amount,
  currency = 'USD'
}) => {
  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'KES') {
      return `KSh ${(amount / 100).toFixed(2)}`;
    }
    return `$${(amount / 100).toFixed(2)}`;
  };

  const paymentMethods = [
    {
      id: 'paystack' as const,
      name: 'Card Payment',
      description: 'Pay securely with your credit/debit card via Paystack',
      icon: <CreditCard className="h-6 w-6 text-blue-600" />,
      available: true
    },
    {
      id: 'remitly' as const,
      name: 'Remitly (US/Europe)',
      description: 'International transfer to M-Pesa (Great rates: $1 = 130 KSh)',
      icon: <Globe className="h-6 w-6 text-green-600" />,
      available: currency === 'USD' || currency === 'EUR'
    },
    {
      id: 'mpesa' as const,
      name: 'M-Pesa (Kenya)',
      description: 'Pay using M-Pesa mobile money',
      icon: <Smartphone className="h-6 w-6 text-green-600" />,
      available: currency === 'KES'
    }
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center font-proxima">
          Choose Payment Method
        </CardTitle>
        <p className="text-center text-2xl font-bold text-gold">
          {formatAmount(amount, currency)}
        </p>
        {currency === 'USD' && selectedMethod === 'remitly' && (
          <p className="text-center text-sm text-muted-foreground">
            Will arrive as ~KSh {(amount * 1.3).toLocaleString()} on M-Pesa
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedMethod}
          onValueChange={onMethodChange}
          className="space-y-3"
        >
          {paymentMethods
            .filter(method => method.available !== false)
            .map((method) => (
            <div key={method.id} className="flex items-center space-x-3">
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <Label
                htmlFor={method.id}
                className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border border-muted hover:border-gold transition-colors"
              >
                {method.icon}
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={onProceed}
          disabled={isLoading}
          className="w-full bg-gold hover:bg-gold/90 text-white font-medium"
        >
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your payment is secured with industry-standard encryption
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
