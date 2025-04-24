
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Calendar, Download, Home, BookOpen } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, total, transactionId } = location.state || {
    service: { title: "Service" },
    total: 0,
    transactionId: "ST-12345678"
  };

  // Format date for receipt
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-green-600 dark:text-green-500" />
        </div>
        
        <h1 className="text-3xl font-proxima font-bold text-center mb-2">Payment Successful</h1>
        <p className="text-center text-muted-foreground mb-8">
          Thank you for your purchase! Your transaction has been completed.
        </p>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{service.title}</h3>
                <p className="text-sm text-muted-foreground">Transaction ID: {transactionId}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${total}</p>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-muted/50 p-4 rounded-md space-y-2">
              <p className="text-sm font-medium">What's Next?</p>
              {service.title.toLowerCase().includes('lesson') ? (
                <div className="space-y-2">
                  <p className="text-sm">Your lesson has been scheduled. You'll receive a confirmation email with all details shortly.</p>
                  <div className="flex items-center text-sm text-gold">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Add to calendar</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm">
                  Our team will contact you within 24 hours to coordinate your {service.title.toLowerCase()}.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex items-center" onClick={() => window.print()}>
              Print
            </Button>
          </CardFooter>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-gold hover:bg-gold-dark flex items-center"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/library')}
            className="flex items-center"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Explore Resources
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentSuccess;
