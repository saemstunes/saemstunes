
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import { ArrowLeft, BookOpen, CheckCircle, ChevronDown, ChevronRight, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Terms = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  const dateUpdated = "April 28, 2025";
  
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `Welcome to Saem's Tunes ("we," "our," or "us"). By accessing or using our website, mobile application, 
      and services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). 
      Please read these Terms carefully.`,
      category: "basics"
    },
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: `By accessing or using our Services, you confirm that you accept these Terms and agree to comply with them. 
      If you do not agree to these Terms, you must not access or use our Services.`,
      category: "basics"
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content: `We may revise these Terms at any time by updating this page. Please check this page regularly to take notice 
      of any changes, as they are binding on you.`,
      category: "basics"
    },
    {
      id: "account",
      title: "Account Registration",
      content: `To access certain features of our Services, you may be required to register for an account. When you register, 
      you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality 
      of your account credentials and for all activities that occur under your account.`,
      category: "account"
    },
    {
      id: "content",
      title: "User Content",
      content: `Our Services may allow you to upload, submit, store, send, or receive content. You retain ownership of any 
      intellectual property rights that you hold in that content. By uploading content, you grant us a worldwide, 
      royalty-free license to use, reproduce, modify, and distribute your content solely for the purpose of operating 
      and improving our Services.`,
      category: "content"
    },
    {
      id: "subscription",
      title: "Subscription Services",
      content: `Certain aspects of our Services require a paid subscription. By subscribing, you agree to the pricing, payment, 
      and billing terms. Subscriptions automatically renew unless canceled in advance. You may cancel your subscription 
      at any time, but refunds are only provided in accordance with our refund policy.`,
      category: "subscriptions"
    },
    {
      id: "ip",
      title: "Intellectual Property",
      content: `All contents of the Services, including text, graphics, logos, icons, images, and software, are the property of 
      Saem's Tunes or our licensors and are protected by copyright, trademark, and other intellectual property laws.`,
      category: "legal"
    },
    {
      id: "prohibited",
      title: "Prohibited Activities",
      content: `You agree not to:
      - Use our Services in any way that violates any applicable laws
      - Use our Services for unauthorized commercial purposes
      - Attempt to interfere with or disrupt the integrity of our Services
      - Attempt to gain unauthorized access to our Services or associated systems
      - Engage in any activity that could disable, overburden, or impair our Services`,
      category: "legal"
    },
    {
      id: "termination",
      title: "Termination",
      content: `We may terminate or suspend your access to all or part of our Services immediately, without prior notice, 
      for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.`,
      category: "legal"
    },
    {
      id: "disclaimer",
      title: "Disclaimer of Warranties",
      content: `Our Services are provided "as is" without warranties of any kind, either express or implied. We do not warrant 
      that our Services will be uninterrupted or error-free.`,
      category: "legal"
    },
    {
      id: "limitation",
      title: "Limitation of Liability",
      content: `To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, 
      or punitive damages resulting from your use of or inability to use our Services.`,
      category: "legal"
    },
    {
      id: "governing",
      title: "Governing Law",
      content: `These Terms are governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law principles.`,
      category: "legal"
    },
    {
      id: "contact",
      title: "Contact Information",
      content: `If you have any questions about these Terms, please contact us at info@saemstunes.com.`,
      category: "basics"
    }
  ];
  
  const highlights = [
    {
      icon: <Shield className="h-5 w-5 text-gold" />,
      title: "Music Copyright",
      content: "We respect intellectual property rights and expect our users to do the same with all musical content."
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-gold" />,
      title: "Fair Use Policy",
      content: "Educational content may be used for personal learning but not for commercial distribution."
    },
    {
      icon: <FileText className="h-5 w-5 text-gold" />,
      title: "Content Ownership",
      content: "You retain rights to your uploaded content while granting us license to use it for service delivery."
    }
  ];
  
  const filteredSections = activeTab === "all" 
    ? sections 
    : sections.filter(section => section.category === activeTab);
  
  return (
    <MainLayout>
      <motion.div 
        className="container max-w-4xl py-8 px-4"
        {...pageTransition}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="ml-auto space-x-2 hidden md:block">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-serif font-bold flex items-center">
                    <BookOpen className="mr-3 h-6 w-6 text-gold" />
                    Terms of Service
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">Last updated: {dateUpdated}</span>
                </div>
                <CardDescription>
                  Please read these terms carefully before using Saem's Tunes services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6 grid grid-cols-3 md:grid-cols-5 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="legal">Legal</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value={activeTab} className="mt-0">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredSections.map((section) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="py-4">
                            <div className="flex items-center">
                              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-gold">
                                <ChevronRight className="h-3 w-3" />
                              </span>
                              {section.title}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-8 prose dark:prose-invert max-w-none text-muted-foreground">
                              <p>{section.content}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex-col space-y-2 items-start">
                <div className="text-sm text-muted-foreground italic">
                  By using Saem's Tunes, you acknowledge that you have read and understand these Terms of Service
                  and agree to be bound by them.
                </div>
                <div className="md:hidden w-full mt-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}>
                    Print Terms
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/privacy")}
                  >
                    View Privacy Policy
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:w-1/4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {highlight.icon}
                      <h3 className="font-medium">{highlight.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">{highlight.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you have any questions about our Terms of Service, please contact our support team.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/contact-us")}
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Link to="/privacy">
            <Button variant="outline">View Privacy Policy</Button>
          </Link>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Terms;
