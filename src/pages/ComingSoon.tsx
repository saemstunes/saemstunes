import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Sparkles, Clock, ArrowLeft, MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import GlitchText from "@/components/GlitchText";

const ComingSoon = () => {
  const navigate = useNavigate();
  const handleRequestFeature = () => {
    navigate("/music-tools", { state: { openSuggestTool: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060010] via-background to-[#1a001f] p-4 relative overflow-hidden">
      {/* Background 404 Glitch Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <GlitchText
          speed={0.7}
          enableShadows={true}
          enableOnHover={false}
          className="text-gold/10 opacity-30 text-[min(40vw,30rem)]"
        >
          404
        </GlitchText>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="border-[#ffd700]/30 shadow-2xl bg-card/90 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZkNzAwIiBvcGFjaXR5PSIwLjEiPjwvcmVjdD4KPC9zdmc+')] opacity-20"></div>
          
          <CardContent className="p-8 text-center relative z-10">
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

            {/* Main heading */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-2 text-gold uppercase tracking-wider"
            >
              Feature In Development
            </motion.h1>

            {/* Subheading with glitch effect */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={true}
                className="text-2xl font-bold text-white"
              >
                Coming Soon
              </GlitchText>
            </motion.div>

            {/* Description text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              <p className="text-lg text-muted-foreground">
                We're crafting something <span className="text-gold font-semibold">extraordinary</span> for you!
              </p>
              <p className="text-muted-foreground">
                This feature is currently under development and will be available in the near future.
                Stay tuned for an enhanced musical experience.
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
            >
              <Button
                onClick={() => navigate("/")}
                variant="default"
                size="lg"
                className="bg-gold hover:bg-gold/90 text-black min-w-[160px] shadow-lg shadow-gold/20"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Home
              </Button>
              <Button
                onClick={handleRequestFeature}
                variant="outline"
                size="lg"
                className="border-gold text-gold hover:bg-gold/10 min-w-[160px]"
              >
                <MessageSquarePlus className="mr-2 h-5 w-5" />
                Request Feature
              </Button>
            </motion.div>

            {/* Follow prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6 border-t border-gold/20"
            >
              <p className="text-sm text-muted-foreground mb-1">
                Want to be notified when this feature launches?
              </p>
              <p className="text-gold font-medium">
                Follow us on{" "}
                <Link to="/follow-us" className="underline hover:text-gold/90">
                  social media
                </Link>
                  {" "}for updates
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
