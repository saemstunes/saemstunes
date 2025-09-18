import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import GlitchText from "@/components/GlitchText";

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();

  const handleRequestFeature = () => {
    navigate("/music-tools", { state: { openSuggestTool: true } });
  };

  return (
    <div className="min-h-screen bg-card text-foreground flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-4xl"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full flex items-center justify-center">
            <div className="opacity-20 w-full flex items-center justify-center">
              <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={false}
                className="text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[14rem] xl:text-[18rem] font-serif leading-none"
              >
                404
              </GlitchText>
            </div>
          </div>
        </div>

        <Card className="relative z-10 bg-card/90 border border-border/10 shadow-lg backdrop-blur-sm">
          <CardContent className="px-8 py-12 lg:px-16 lg:py-20 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-4xl sm:text-5xl md:text-5xl font-serif font-semibold text-foreground mb-3"
            >
              Coming Soon
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground mb-6"
            >
              We are preparing a refined musical experience for Saem’s Tunes. The page you
              requested is undergoing careful work and will be available shortly.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground mb-8"
            >
              If you want to be notified when this feature launches or suggest a tool,
              use the requests button below. For now, you can return to the homepage.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => navigate("/")}
                variant="default"
                size="lg"
                aria-label="Return to home"
                className="min-w-[160px] bg-gold text-background hover:bg-gold/95"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return Home
              </Button>

              <Button
                onClick={handleRequestFeature}
                variant="outline"
                size="lg"
                aria-label="Request a feature"
                className="min-w-[160px] border border-gold text-gold hover:bg-gold/10"
              >
                <MessageSquarePlus className="mr-2 h-5 w-5" />
                Request Feature
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.6 }}
              className="mt-8 text-sm text-muted-foreground"
            >
              <div className="max-w-prose mx-auto">
                <p className="mb-1">Need faster updates? Follow Saem’s Tunes on social media.</p>
                <p className="text-xs text-muted-foreground/80">Thank you for your patience — we’re building something worth the wait.</p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
