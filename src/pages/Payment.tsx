
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { CalendarCheck, CreditCard, Landmark, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const service = location.state?.service || {
    title: "Service Payment",
    price: "$0",
    description: "No service selected"
  };
  
  // Extract numeric price for calculations
  const basePrice = parseInt(service.price?.replace(/[^0-9]/g, '')) || 0;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    savePaymentInfo: false,
    agreeToTerms: false,
    paymentMethod: 'card'
  });

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  
  // Calculate totals
  const discount = discountApplied ? Math.round(basePrice * 0.1) : 0;
  const subtotal = basePrice;
  const processingFee = Math.round(subtotal * 0.03);
  const total = subtotal - discount + processingFee;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      paymentMethod: value
    });
  };

  const applyDiscount = () => {
    if (discountCode.toLowerCase() === 'student10') {
      setDiscountApplied(true);
      toast({
        title: "Discount Applied",
        description: "10% student discount has been applied to your order.",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "The discount code you entered is invalid or expired.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation checks
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "You must agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    // Process payment
    toast({
      title: "Payment Processing",
      description: "Your payment is being processed...",
    });
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      navigate('/payment-success', { state: { 
        service, 
        total, 
        transactionId: `ST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }});
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-16">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-proxima font-bold">Payment</h1>
            <p className="text-muted-foreground">Complete your payment for {service.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Please enter your payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Method</h3>
                    <RadioGroup 
                      defaultValue="card" 
                      value={formData.paymentMethod}
                      onValueChange={handleRadioChange}
                    >
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center">
                          <Landmark className="mr-2 h-4 w-4" />
                          Bank Transfer
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input 
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input 
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv"
                            name="cvv"
                            type="password"
                            maxLength={3}
                            value={formData.cvv}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'bank' && (
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Bank Transfer Instructions</h4>
                      <p className="text-sm mb-2">
                        Please make your payment to the following account:
                      </p>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Bank:</span> First National Bank</p>
                        <p><span className="font-medium">Account Name:</span> Saem's Tunes</p>
                        <p><span className="font-medium">Account Number:</span> 123456789</p>
                        <p><span className="font-medium">Routing Number:</span> 987654321</p>
                        <p><span className="font-medium">Reference:</span> Your email address</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="savePaymentInfo" 
                        name="savePaymentInfo"
                        checked={formData.savePaymentInfo}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, savePaymentInfo: checked === true})
                        }
                      />
                      <Label htmlFor="savePaymentInfo">Save payment information for future purchases</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeToTerms" 
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, agreeToTerms: checked === true})
                        }
                        required
                      />
                      <Label htmlFor="agreeToTerms">
                        I agree to the <a href="/terms" className="text-gold hover:underline">terms and conditions</a>
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-gold hover:bg-gold-dark">
                    Pay ${total}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      {service.duration && (
                        <div className="flex items-center mt-2 text-sm">
                          <CalendarCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{service.duration}</span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium">${subtotal}</span>
                  </div>
                </div>
                
                {/* Discount Code */}
                <div>
                  <Label htmlFor="discountCode">Discount Code</Label>
                  <div className="flex mt-1">
                    <Input
                      id="discountCode"
                      placeholder="Enter code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button 
                      type="button" 
                      onClick={applyDiscount} 
                      className="rounded-l-none"
                      variant="secondary"
                    >
                      Apply
                    </Button>
                  </div>
                  {discountApplied && (
                    <p className="text-sm text-green-600 mt-1">Student discount applied!</p>
                  )}
                </div>
                
                <Separator />
                
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Student Discount (10%)</span>
                      <span>-${discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>${processingFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded text-sm text-muted-foreground mt-4">
                  <p>Need help with your purchase?</p>
                  <a href="/contact-us" className="text-gold hover:underline">Contact our support team</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Payment;
