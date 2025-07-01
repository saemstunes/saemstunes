
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, CreditCard, Gift, RotateCcw, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockSubscriptionPlans } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethod {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  type: "card" | "paypal" | "bank";
  isDefault: boolean;
}

const samplePaymentMethods: PaymentMethod[] = [
  {
    id: "card1",
    name: "Visa ending in 4242",
    last4: "4242",
    expiry: "09/25",
    type: "card",
    isDefault: true
  },
  {
    id: "paypal1",
    name: "PayPal",
    last4: "",
    expiry: "",
    type: "paypal",
    isDefault: false
  }
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"subscriptions" | "payments">("subscriptions");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods);
  const [selectedPlan, setSelectedPlan] = useState<string>(mockSubscriptionPlans[1].id); // Default to middle plan
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  
  const urlSearchParams = new URLSearchParams(location.search);
  const contentType = urlSearchParams.get('contentType');
  const contentId = urlSearchParams.get('contentId');

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(samplePaymentMethods.find(pm => pm.isDefault)?.id || "");

  const toggleCheckout = (planId?: string) => {
    if (planId) {
      setSelectedPlan(planId);
    }
    setIsCheckingOut(!isCheckingOut);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "saem50") {
      setPromoApplied(true);
      toast({
        title: "Promo code applied!",
        description: "You've received a 10% discount on your subscription.",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulating a loading state
    toast({
      title: "Processing payment...",
      description: "Please wait while we process your payment.",
    });
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      navigate("/payment-success");
    }, 2000);
  };

  const selectedPlanDetails = mockSubscriptionPlans.find(p => p.id === selectedPlan);

  const handleAddPaymentMethod = () => {
    navigate("/add-payment-method");
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
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
            <h1 className="text-3xl font-proxima font-bold">Subscriptions & Payments</h1>
            <p className="text-muted-foreground">
              Manage your subscriptions and payment methods
            </p>
          </div>
        </div>
  
        {contentType && contentId && (
          <Alert className="bg-gold/10 border-gold">
            <ShoppingBag className="h-4 w-4 text-gold" />
            <AlertTitle>Access Premium Content</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Subscribe to access {contentType === 'exclusive' ? 'exclusive content' : contentType}</p>
              <Button size="sm" className="bg-gold hover:bg-gold/90 text-white mt-2" onClick={() => setActiveTab("subscriptions")}>
                View Plans
              </Button>
            </AlertDescription>
          </Alert>
        )}
  
        <Tabs 
          defaultValue={activeTab}
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "subscriptions" | "payments")}
        >
          <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
            <TabsTrigger value="subscriptions">
              <RotateCcw className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Methods
            </TabsTrigger>
          </TabsList>
  
          <TabsContent value="subscriptions" className="mt-6 space-y-6">
            {isCheckingOut ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Your Purchase</CardTitle>
                    <CardDescription>Review your order details and checkout</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{selectedPlanDetails?.name} Subscription</span>
                          <span>${selectedPlanDetails?.price}/month</span>
                        </div>
                        
                        {promoApplied && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">Promo: SAEM50</span>
                            <span className="text-green-600">-10%</span>
                          </div>
                        )}
                        
                        <div className="h-px bg-border my-2"></div>
                        
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>
                            ${promoApplied 
                              ? (parseFloat(String(selectedPlanDetails?.price || "0")) * 0.9).toFixed(2) 
                              : selectedPlanDetails?.price}/month
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select 
                          value={selectedPaymentMethod} 
                          onValueChange={setSelectedPaymentMethod}
                        >
                          <SelectTrigger id="payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map(method => (
                              <SelectItem key={method.id} value={method.id}>
                                {method.name}
                                {method.isDefault && " (Default)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full mt-2"
                          onClick={handleAddPaymentMethod}
                        >
                          Add New Payment Method
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="promo">Promo Code</Label>
                          {promoApplied && (
                            <span className="text-xs text-green-600">Applied</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            id="promo" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter promo code"
                            disabled={promoApplied}
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={applyPromoCode}
                            disabled={promoApplied || !promoCode}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                      
                      <Alert className="bg-muted">
                        <Gift className="h-4 w-4" />
                        <AlertTitle>Subscription Benefits</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                            {selectedPlanDetails?.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                        <Button 
                          type="button"
                          variant="outline" 
                          onClick={() => toggleCheckout()}
                          className="flex-1"
                        >
                          Back to Plans
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1 bg-gold hover:bg-gold/90 text-white"
                        >
                          Complete Purchase
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                {!user && (
                  <Alert>
                    <AlertTitle>Sign in to manage subscriptions</AlertTitle>
                    <AlertDescription>
                      You need to be logged in to manage your subscriptions.
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => navigate("/auth")} size="sm">
                          Sign In
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate("/auth?signup=true")}>
                          Create Account
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <h2 className="text-2xl font-proxima font-semibold">Choose Your Plan</h2>
                  
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {mockSubscriptionPlans.map((plan, index) => (
                    <Card 
                      key={plan.id}
                      className={cn(
                        "flex flex-col justify-between",
                        plan.isPopular && "border-gold shadow-md",
                        selectedPlan === plan.id && "ring-2 ring-gold"
                      )}
                    >
                      <CardHeader>
                        {plan.isPopular && (
                          <div className="py-1 px-3 bg-gold/20 text-gold rounded-full text-xs font-medium w-fit mx-auto mb-2">
                            MOST POPULAR
                          </div>
                        )}
                        <CardTitle className="text-xl text-center">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-center">
                          {plan.shortDescription}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-6">
                        <div>
                          <p className="text-4xl font-bold">
                            ${plan.price}
                            <span className="text-muted-foreground text-sm font-normal">/month</span>
                          </p>
                          {plan.annualDiscount && (
                            <p className="text-sm text-muted-foreground">
                              Save ${plan.annualDiscount} annually
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 text-left">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-center">
                              <Check className="h-4 w-4 text-gold mr-2 shrink-0" />
                              <p className="text-sm">{feature}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <div className="p-6 pt-0">
                        <Button
                          className={cn(
                            "w-full",
                            index === 1 
                              ? "bg-gold hover:bg-gold/90 text-white" 
                              : "bg-muted/60 hover:bg-muted text-foreground dark:bg-muted/30 dark:hover:bg-muted/40"
                          )}
                          onClick={() => toggleCheckout(plan.id)}
                        >
                          {selectedPlan === plan.id ? "Selected" : "Subscribe Now"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center max-w-2xl mx-auto">
                  <h3 className="text-lg font-medium mb-2">Why subscribe to Saem's Tunes?</h3>
                  <p className="text-muted-foreground">
                    Get unlimited access to all premium lessons, one-on-one sessions with experienced 
                    instructors, and exclusive content to accelerate your musical journey.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
  
          <TabsContent value="payments" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your stored payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id} 
                    className="flex items-center justify-between border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-full",
                        method.type === "card" ? "bg-blue-50" :
                        method.type === "paypal" ? "bg-blue-100" : "bg-gray-100"
                      )}>
                        <CreditCard className={cn(
                          "h-5 w-5",
                          method.type === "card" ? "text-blue-500" :
                          method.type === "paypal" ? "text-blue-600" : "text-gray-500"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        {method.expiry && (
                          <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Default</span>
                      )}
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-4" onClick={handleAddPaymentMethod}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Merchandise & Products</CardTitle>
                <CardDescription>
                  View your past purchases and orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <ShoppingBag className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No purchases yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore the store to find Saem's Tunes merchandise and products.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/store")}
                  >
                    Browse Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Subscriptions;
