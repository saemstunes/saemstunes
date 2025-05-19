
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/library");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  return (
    <MainLayout>
      <div className="container max-w-lg mx-auto py-10 px-4">
        <Card className="border-green-200">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto my-4 bg-green-100 p-6 rounded-full w-24 h-24 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700 font-proxima">
              Payment Successful!
            </CardTitle>
            <CardDescription>
              Thank you for your subscription to Saem's Tunes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-medium">What's Next?</h3>
              <p className="text-muted-foreground">
                You now have full access to all premium content on Saem's Tunes.
              </p>
            </div>
            
            <div className="rounded-lg bg-muted/30 p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 shrink-0" />
                  <span>Access to premium video lessons</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 shrink-0" />
                  <span>Downloadable resources and sheet music</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 shrink-0" />
                  <span>Music quizzes and interactive learning tools</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 shrink-0" />
                  <span>Community forums and discussion groups</span>
                </li>
              </ul>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Your payment receipt has been sent to your email address.
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <Button 
              className="w-full bg-gold hover:bg-gold/90 text-white" 
              onClick={() => navigate("/library")}
            >
              Explore Premium Content
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground text-center pt-2">
              Redirecting in {countdown} seconds...
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PaymentSuccess;
