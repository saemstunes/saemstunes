import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold/5 via-background to-gold/10 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-gold/20 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="relative mb-8">
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
                className="bg-gold/10 p-6 rounded-full inline-block"
              >
                <Clock className="h-16 w-16 text-gold mx-auto" />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <GlitchText speed={1} enableShadows={true} enableOnHover={true} className="text-6xl text-gold">
                404
              </GlitchText>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-4 text-foreground"
            >
              🎵 New Feature Coming Soon! 🎵
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-muted-foreground mb-2"
            >
              We're crafting something <span className="text-gold font-semibold">amazing</span> for you!
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-muted-foreground mb-8"
            >
              This feature is currently under construction and will be available soon.
              <br /> Stay tuned for an incredible musical experience! 🎼
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => navigate("/")}
                variant="default"
                size="lg"
                className="bg-gold hover:bg-gold/90 text-white min-w-[160px]"
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
                Request a Feature
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-sm text-muted-foreground"
            >
              <p>Want to be notified when this feature launches?</p>
              <p className="text-gold">Follow us on social media for updates!</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
