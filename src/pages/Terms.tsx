
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Terms = () => {
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
        
        <h1 className="text-3xl font-serif font-bold mb-6">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>Last updated: April 28, 2025</p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to Saem's Tunes ("we," "our," or "us"). By accessing or using our website, mobile application, 
            and services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). 
            Please read these Terms carefully.
          </p>
          
          <h2>2. Acceptance of Terms</h2>
          <p>
            By accessing or using our Services, you confirm that you accept these Terms and agree to comply with them. 
            If you do not agree to these Terms, you must not access or use our Services.
          </p>
          
          <h2>3. Changes to Terms</h2>
          <p>
            We may revise these Terms at any time by updating this page. Please check this page regularly to take notice 
            of any changes, as they are binding on you.
          </p>
          
          <h2>4. Account Registration</h2>
          <p>
            To access certain features of our Services, you may be required to register for an account. When you register, 
            you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality 
            of your account credentials and for all activities that occur under your account.
          </p>
          
          <h2>5. User Content</h2>
          <p>
            Our Services may allow you to upload, submit, store, send, or receive content. You retain ownership of any 
            intellectual property rights that you hold in that content. By uploading content, you grant us a worldwide, 
            royalty-free license to use, reproduce, modify, and distribute your content solely for the purpose of operating 
            and improving our Services.
          </p>
          
          <h2>6. Subscription Services</h2>
          <p>
            Certain aspects of our Services require a paid subscription. By subscribing, you agree to the pricing, payment, 
            and billing terms. Subscriptions automatically renew unless canceled in advance. You may cancel your subscription 
            at any time, but refunds are only provided in accordance with our refund policy.
          </p>
          
          <h2>7. Intellectual Property</h2>
          <p>
            All contents of the Services, including text, graphics, logos, icons, images, and software, are the property of 
            Saem's Tunes or our licensors and are protected by copyright, trademark, and other intellectual property laws.
          </p>
          
          <h2>8. Prohibited Activities</h2>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use our Services in any way that violates any applicable laws</li>
            <li>Use our Services for unauthorized commercial purposes</li>
            <li>Attempt to interfere with or disrupt the integrity of our Services</li>
            <li>Attempt to gain unauthorized access to our Services or associated systems</li>
            <li>Engage in any activity that could disable, overburden, or impair our Services</li>
          </ul>
          
          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your access to all or part of our Services immediately, without prior notice, 
            for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>
          
          <h2>10. Disclaimer of Warranties</h2>
          <p>
            Our Services are provided "as is" without warranties of any kind, either express or implied. We do not warrant 
            that our Services will be uninterrupted or error-free.
          </p>
          
          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of or inability to use our Services.
          </p>
          
          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law principles.
          </p>
          
          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:info@saemstunes.com">info@saemstunes.com</a>.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/privacy">
            <Button variant="outline">View Privacy Policy</Button>
          </Link>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Terms;
