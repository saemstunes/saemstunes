
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <motion.div 
        className="container max-w-4xl py-8 px-4"
        {...pageTransition}
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-serif font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>Last updated: April 28, 2025</p>
          
          <h2>1. Introduction</h2>
          <p>
            At Saem's Tunes, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Services").
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways:
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, phone number, and payment information</li>
            <li><strong>Account Information:</strong> Username, password, and profile information</li>
            <li><strong>Usage Data:</strong> Information about how you access and use our Services</li>
            <li><strong>Device Data:</strong> Information about your device and internet connection</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>
            We may use the information we collect about you for various purposes:
          </p>
          <ul>
            <li>To provide and maintain our Services</li>
            <li>To process your transactions and manage your account</li>
            <li>To improve our Services and develop new features</li>
            <li>To communicate with you regarding updates, support, and promotional offers</li>
            <li>To monitor and analyze usage patterns</li>
            <li>To prevent fraudulent activities and enhance security</li>
          </ul>
          
          <h2>4. Disclosure of Your Information</h2>
          <p>
            We may share information we have collected about you in certain situations:
          </p>
          <ul>
            <li><strong>With Service Providers:</strong> We may share your information with third-party vendors who perform services on our behalf</li>
            <li><strong>For Business Transfers:</strong> We may share your information in connection with a merger, acquisition, or sale of our assets</li>
            <li><strong>For Legal Compliance:</strong> We may disclose your information to comply with applicable laws and regulations</li>
          </ul>
          
          <h2>5. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to protect your personal information. However, no 
            data transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>
          
          <h2>6. Your Privacy Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul>
            <li>Right to access and receive a copy of your personal information</li>
            <li>Right to rectify or update your personal information</li>
            <li>Right to request deletion of your personal information</li>
            <li>Right to restrict or object to processing of your personal information</li>
            <li>Right to data portability</li>
          </ul>
          
          <h2>7. Children's Privacy</h2>
          <p>
            Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from 
            children under 13. If we learn we have collected personal information from a child under 13, we will delete that information.
          </p>
          
          <h2>8. Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies, web beacons, and similar technologies to enhance your experience with our Services. You can choose to 
            disable cookies through your browser settings, but this may affect the functionality of our Services.
          </p>
          
          <h2>9. Third-Party Websites</h2>
          <p>
            Our Services may contain links to third-party websites. We are not responsible for the privacy practices or content of 
            these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>
          
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
            on this page and updating the "Last updated" date.
          </p>
          
          <h2>11. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:privacy@saemstunes.com">privacy@saemstunes.com</a>.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/terms">
            <Button variant="outline">View Terms of Service</Button>
          </Link>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Privacy;
