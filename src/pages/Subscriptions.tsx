import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Gift, RotateCcw, ShoppingBag, Music, Calendar, UserCheck, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockSubscriptionPlans } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import PricingCard from "@/components/subscription/PricingCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PaymentMethod {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  type: "card" | "mpesa" | "paypal" | "bank";
  isDefault: boolean;
}

// Mock user subscription data
const mockUserSubscription = {
  planId: "pro",
  status: "active",
  validUntil: "2024-12-31",
  credits: 5,
  usedCredits: 2
};

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
    id: "mpesa1",
    name: "M-Pesa",
    last4: "2547",
    expiry: "",
    type: "mpesa",
    isDefault: false
  }
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"subscriptions" | "payments" | "usage">("subscriptions");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods);
  const [userSubscription, setUserSubscription] = useState(mockUserSubscription);
  const [isLoading, setIsLoading] = useState(false);
  
  const urlSearchParams = new URLSearchParams(location.search);
  const contentType = urlSearchParams.get('contentType');
  const contentId = urlSearchParams.get('contentId');

  useEffect(() => {
    // In a real app, you would fetch the user's subscription and payment methods here
    // For demo purposes, we're using mock data
  }, [user]);

  const handleAddPaymentMethod = () => {
    navigate("/add-payment-method");
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan",
        variant: "default",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUserSubscription({
        planId,
        status: "active",
        validUntil: "2024-12-31",
        credits: planId === "pro" ? 8 : 4,
        usedCredits: 0
      });
      
      toast({
        title: "Subscription successful!",
        description: `You've successfully subscribed to the ${mockSubscriptionPlans.find(p => p.id === planId)?.name} plan`,
      });
      
      setIsLoading(false);
    }, 1500);
  };

  const handleBookSession = () => {
    navigate("/bookings");
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "mpesa":
        return <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>;
      case "paypal":
        return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">P</div>;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodColor = (type: string) => {
    switch (type) {
      case "card":
        return "bg-blue-50 text-blue-500";
      case "mpesa":
        return "bg-green-50 text-green-600";
      case "paypal":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
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
              Manage your subscriptions, payment methods, and session credits
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
          onValueChange={(value) => setActiveTab(value as "subscriptions" | "payments" | "usage")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-[500px]">
            <TabsTrigger value="subscriptions">
              <RotateCcw className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="usage">
              <Zap className="h-4 w-4 mr-2" />
              Usage & Credits
            </TabsTrigger>
          </TabsList>
  
          <TabsContent value="subscriptions" className="mt-6 space-y-6">
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
              
              {userSubscription.status === "active" && (
                <Card className="border-gold/20 bg-gold/5">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Your Active Plan
                          <Badge className="bg-green-600">Active</Badge>
                        </CardTitle>
                        <CardDescription>
                          You're subscribed to the {mockSubscriptionPlans.find(p => p.id === userSubscription.planId)?.name} plan
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage Subscription
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Valid until: {new Date(userSubscription.validUntil).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <div>
                <h2 className="text-2xl font-proxima font-semibold mb-4">Choose Your Plan</h2>
                <p className="text-muted-foreground mb-6 max-w-3xl">
                  Select the subscription that fits your musical journey. All plans include access to premium content 
                  and exclusive resources from Saem's Tunes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockSubscriptionPlans.map((plan, index) => (
                    <PricingCard 
                      key={plan.id}
                      plan={plan}
                      variant={index === 1 ? "default" : "outline"}
                      isCurrentPlan={userSubscription.planId === plan.id}
                      onSubscribe={() => handleSubscribe(plan.id)}
                      isLoading={isLoading}
                      className={cn(
                        index === 1 && "ring-2 ring-gold ring-offset-2"
                      )}
                    />
                  ))}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-6 max-w-3xl mx-auto">
                <h3 className="text-lg font-medium mb-2 text-center">Why subscribe to Saem's Tunes?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="bg-gold/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Music className="h-6 w-6 text-gold" />
                    </div>
                    <h4 className="font-medium">Exclusive Content</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Access premium lessons and resources not available to free users
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gold/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UserCheck className="h-6 w-6 text-gold" />
                    </div>
                    <h4 className="font-medium">Personal Coaching</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get personalized feedback and guidance from experienced instructors
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gold/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="h-6 w-6 text-gold" />
                    </div>
                    <h4 className="font-medium">Flexible Booking</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Book sessions at your convenience with our easy scheduling system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
  
          <TabsContent value="payments" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your stored payment methods for seamless transactions
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
                        getPaymentMethodColor(method.type)
                      )}>
                        {getPaymentMethodIcon(method.type)}
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
                        <Badge variant="secondary" className="bg-gold/20 text-gold-foreground">Default</Badge>
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
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={handleAddPaymentMethod}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Card
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <div className="mr-2 h-4 w-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
                    Add M-Pesa
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your past transactions and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <CreditCard className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No transactions yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your billing history will appear here once you make a purchase.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="mt-6 space-y-6">
            {userSubscription.status === "active" ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Session Credits</CardTitle>
                    <CardDescription>
                      You have {userSubscription.credits - userSubscription.usedCredits} out of {userSubscription.credits} credits remaining this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(userSubscription.usedCredits / userSubscription.credits) * 100} className="h-2 mb-4" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{userSubscription.usedCredits} used</span>
                      <span>{userSubscription.credits - userSubscription.usedCredits} remaining</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Book a Session</CardTitle>
                    <CardDescription>
                      Use your credits to book a session with our instructors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Private Lesson</h4>
                        <p className="text-sm text-muted-foreground mb-3">1-on-1 session with an instructor</p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">1 credit</span>
                          <Button size="sm" onClick={handleBookSession}>
                            Book Now
                          </Button>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Group Session</h4>
                        <p className="text-sm text-muted-foreground mb-3">Join a group learning session</p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">2 credits</span>
                          <Button size="sm" onClick={handleBookSession}>
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>
                      Your scheduled lessons and appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">No upcoming sessions</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Book your first session to get started on your musical journey.
                      </p>
                      <Button onClick={handleBookSession}>
                        Book a Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Alert>
                <AlertTitle>No active subscription</AlertTitle>
                <AlertDescription>
                  You need an active subscription to access credits and book sessions.
                  <Button className="ml-4" onClick={() => setActiveTab("subscriptions")}>
                    View Plans
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Subscriptions;
