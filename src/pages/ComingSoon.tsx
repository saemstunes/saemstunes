
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Sparkles, Clock, ArrowLeft, MessageSquarePlus, Play, Users, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderOne } from "@/components/ui/loader";
import SEOHead from "@/components/seo/SEOHead";

const ComingSoon = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mounted, setMounted] = useState(false);

  const features = [
    {
      icon: Music,
      title: "Advanced Music Tools",
      description: "Professional-grade music creation and editing tools"
    },
    {
      icon: Users,
      title: "Community Features",
      description: "Connect with fellow musicians and share your journey"
    },
    {
      icon: BookOpen,
      title: "Enhanced Learning",
      description: "Immersive learning experiences with AI-powered guidance"
    }
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleRequestFeature = () => {
    navigate("/music-tools", { state: { openSuggestTool: true } });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <LoaderOne />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Coming Soon | Saem's Tunes"
        description="Exciting new features are coming to Saem's Tunes. Stay tuned for amazing musical experiences and enhanced learning tools."
        path="/coming-soon"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl relative z-10"
        >
          <Card className="border-primary/20 shadow-2xl bg-card/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              {/* Hero Icon Animation */}
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-6 -left-6 text-primary/30"
                >
                  <Music className="h-8 w-8" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 text-accent/30"
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-full inline-block relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <Clock className="h-20 w-20 text-primary mx-auto relative z-10" />
                </motion.div>
              </div>

              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-6 text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                Exciting Features Coming Soon
              </motion.h1>

              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                We're crafting something <span className="text-primary font-semibold">extraordinary</span> for your musical journey!
              </motion.p>

              {/* Feature Preview */}
              <motion.div 
                className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {React.createElement(features[currentFeature].icon, {
                        className: "h-8 w-8 text-primary"
                      })}
                    </motion.div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-foreground">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-muted-foreground">
                        {features[currentFeature].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  onClick={() => navigate("/")}
                  variant="default"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[160px] group"
                >
                  <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  Return to Home
                </Button>

                <Button
                  onClick={handleRequestFeature}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10 min-w-[160px] group"
                >
                  <MessageSquarePlus className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Request a Feature
                </Button>

                <Button
                  onClick={() => navigate("/discover")}
                  variant="ghost"
                  size="lg"
                  className="text-accent hover:bg-accent/10 min-w-[160px] group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Explore Now
                </Button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 p-4 bg-muted/30 rounded-lg"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  Want to be notified when these features launch?
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <motion.a
                    href="/follow-us"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/follow-us");
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📱 Follow Us
                  </motion.a>
                  <motion.a
                    href="/community"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/community");
                    }}
                    className="text-accent hover:text-accent/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    👥 Join Community
                  </motion.a>
                  <motion.a
                    href="/subscriptions"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/subscriptions");
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ⭐ Get Premium Access
                  </motion.a>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ComingSoon;
