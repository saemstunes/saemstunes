import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Sparkles, Clock, ArrowLeft, MessageSquarePlus, Home, Search, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import GlitchText from "@/components/GlitchText";
import Logo from "@/components/branding/Logo";

const ComingSoon = () => {
  const navigate = useNavigate();

  const handleRequestFeature = () => {
    navigate("/music-tools", { state: { openSuggestTool: true } });
  };

  const goBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <section aria-labelledby="comingsoon-title" className="max-w-md w-full text-center relative" role="article">
        
        <header className="mb-8">
          <Logo size="lg" className="mx-auto" />
        </header>

        <div className="relative mb-8">
          {/* Background Glitch Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <GlitchText
              speed={0.7}
              enableShadows={true}
              enableOnHover={false}
              className="text-gold/10 opacity-30 text-[min(30vw,20rem)]"
            >
              SOON
            </GlitchText>
          </div>
          
          <div className="relative z-10">
            {/* Animated icons */}
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -left-4 text-gold/30"
              >
                <Music className="h-8 w-8" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 text-gold/30"
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gold/10 p-5 rounded-full inline-block"
              >
                <Clock className="h-12 w-12 text-gold mx-auto" />
              </motion.div>
            </div>

            {/* Combined header with "Coming" and glitched "SOON" */}
            <h1 id="comingsoon-title" className="text-3xl font-proxima font-bold mb-2 flex justify-center items-center">
              <span className="mr-2">Coming</span>
              <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={true}
                className="text-3xl font-bold text-gold"
              >
                SOON
              </GlitchText>
            </h1>

            <div className="space-y-4 mb-6">
              <p className="text-muted-foreground">
                We're crafting something <span className="text-gold font-semibold">extraordinary</span> for you!
              </p>
              <p className="text-muted-foreground text-sm">
                This feature is currently under development and will be available in the near future.
                Stay tuned for an enhanced musical experience.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Button
            onClick={goBack}
            variant="outline"
            className="flex items-center justify-center gap-2"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-gold hover:bg-gold/90 text-white flex items-center justify-center gap-2"
            aria-label="Go home"
            title="Go home"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <Button 
            onClick={handleRequestFeature}
            variant="ghost" 
            size="sm" 
            aria-label="Request feature"
            className="flex items-center gap-2"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Request Feature
          </Button>
          <Button asChild variant="ghost" size="sm" aria-label="Contact support">
            <Link to="/contact-us" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Get help
            </Link>
          </Button>
        </div>

        <div className="pt-6 border-t border-gold/20">
          <p className="text-sm text-muted-foreground mb-1">
            Want to be notified when this feature launches?
          </p>
          <p className="text-gold font-medium text-sm">
            Follow us on{" "}
            <Link to="/follow-us" className="underline hover:text-gold/90">
              social media
            </Link>
            {" "}for updates
          </p>
        </div>

      </section>
    </main>
  );
};

export default ComingSoon;
