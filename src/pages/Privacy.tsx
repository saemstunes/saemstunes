
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import { ArrowLeft, ChevronRight, FileText, Lock, Search, Shield, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Privacy = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  const dateUpdated = "April 28, 2025";
  
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `At Saem's Tunes, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
      disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Services").`,
      category: "basics"
    },
    {
      id: "information",
      title: "Information We Collect",
      content: `We may collect information about you in a variety of ways:
      
      • Personal Data: Name, email address, phone number, and payment information
      • Account Information: Username, password, and profile information
      • Usage Data: Information about how you access and use our Services
      • Device Data: Information about your device and internet connection`,
      category: "data"
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: `We may use the information we collect about you for various purposes:
      
      • To provide and maintain our Services
      • To process your transactions and manage your account
      • To improve our Services and develop new features
      • To communicate with you regarding updates, support, and promotional offers
      • To monitor and analyze usage patterns
      • To prevent fraudulent activities and enhance security`,
      category: "data"
    },
    {
      id: "disclosure",
      title: "Disclosure of Your Information",
      content: `We may share information we have collected about you in certain situations:
      
      • With Service Providers: We may share your information with third-party vendors who perform services on our behalf
      • For Business Transfers: We may share your information in connection with a merger, acquisition, or sale of our assets
      • For Legal Compliance: We may disclose your information to comply with applicable laws and regulations`,
      category: "sharing"
    },
    {
      id: "security",
      title: "Security of Your Information",
      content: `We use administrative, technical, and physical security measures to protect your personal information. However, no 
      data transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.`,
      category: "security"
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      content: `Depending on your location, you may have certain rights regarding your personal information:
      
      • Right to access and receive a copy of your personal information
      • Right to rectify or update your personal information
      • Right to request deletion of your personal information
      • Right to restrict or object to processing of your personal information
      • Right to data portability`,
      category: "rights"
    },
    {
      id: "children",
      title: "Children's Privacy",
      content: `Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from 
      children under 13. If we learn we have collected personal information from a child under 13, we will delete that information.`,
      category: "rights"
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: `We may use cookies, web beacons, and similar technologies to enhance your experience with our Services. You can choose to 
      disable cookies through your browser settings, but this may affect the functionality of our Services.`,
      category: "tracking"
    },
    {
      id: "third-party",
      title: "Third-Party Websites",
      content: `Our Services may contain links to third-party websites. We are not responsible for the privacy practices or content of 
      these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
      category: "security"
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
      on this page and updating the "Last updated" date.`,
      category: "basics"
    },
    {
      id: "contact",
      title: "Contact Us",
      content: `If you have questions or concerns about this Privacy Policy, please contact us at privacy@saemstunes.com.`,
      category: "basics"
    }
  ];
  
  const highlights = [
    {
      icon: <Shield className="h-5 w-5 text-gold" />,
      title: "Data Protection",
      content: "We implement robust security measures to protect your personal data."
    },
    {
      icon: <ThumbsUp className="h-5 w-5 text-gold" />,
      title: "No Data Selling",
      content: "We never sell your personal information to third parties."
    },
    {
      icon: <Search className="h-5 w-5 text-gold" />,
      title: "Transparency",
      content: "You can request access to the data we hold about you at any time."
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
              onClick={() => navigate("/terms")}
            >
              Terms of Service
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-serif font-bold flex items-center">
                    <Lock className="mr-3 h-6 w-6 text-gold" />
                    Privacy Policy
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">Last updated: {dateUpdated}</span>
                </div>
                <CardDescription>
                  Learn how we collect, use, and protect your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6 grid grid-cols-3 md:grid-cols-6 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                    <TabsTrigger value="sharing">Sharing</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="rights">Rights</TabsTrigger>
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
                            <div className="pl-8 prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
                              {section.content}
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
                  By using Saem's Tunes, you acknowledge that you have read and understand this Privacy Policy
                  and how we process your personal data.
                </div>
                <div className="md:hidden w-full mt-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}>
                    Print Policy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/terms")}
                  >
                    View Terms of Service
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:w-1/4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Commitments</CardTitle>
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
                <CardTitle className="text-lg">Your Data Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You have the right to request access to, correction, or deletion of your data at any time.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/contact-us")}
                >
                  Request Your Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Link to="/terms">
            <Button variant="outline">View Terms of Service</Button>
          </Link>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Privacy;
