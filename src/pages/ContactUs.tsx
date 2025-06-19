
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Mail, MessageSquare, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ContactUs = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "We'll get back to you soon. Thank you!",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-proxima font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">Get in touch with the Saem's Tunes team. We'd love to hear from you!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="How can we help you?" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Type your message here..." 
                    rows={5} 
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-gold hover:bg-gold-dark">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-muted-foreground text-sm">saemstunes@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-muted-foreground text-sm">++254 798 903 373</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-medium">WhatsApp</h4>
                    <p className="text-muted-foreground text-sm">+254 798 903 373</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-medium">Studio Location</h4>
                    <p className="text-muted-foreground text-sm">Nairobi, Kenya</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-medium">Business Hours</h4>
                    <p className="text-muted-foreground text-sm">Monday - Friday: 10am - 5pm</p>
                    <p className="text-muted-foreground text-sm">Saturday: 10am - 3pm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  We aim to respond to all inquiries within 24-48 hours during business days.
                  For urgent matters, please contact us via WhatsApp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-proxima font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">How do I book a lesson?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                You can book lessons through your account dashboard after signing up.
              </p>
            </div>
            <div>
              <h3 className="font-medium">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                We accept M-Pesa, credit/debit cards, and PayPal.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Can I reschedule my booking?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Yes, bookings can be rescheduled up to 24 hours before the scheduled time.
              </p>
            </div>
            <div>
              <h3 className="font-medium">How do online lessons work?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Online lessons are conducted via Zoom. You'll receive a link before your scheduled lesson.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUs;
