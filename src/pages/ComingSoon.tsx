import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowLeft, MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import GlitchText from "@/components/GlitchText";

const ComingSoon = () => {
  const navigate = useNavigate();
  const handleRequestFeature = () => {
    navigate("/music-tools", { state: { openSuggestTool: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060010] via-background to-[#1a001f] p-4 relative overflow-hidden">
      {/* Large 404 Background Element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <GlitchText
          speed={0.8}
          enableShadows={true}
          enableOnHover={false}
          className="text-gold/5 opacity-20 text-[min(50vw,40rem)] select-none"
        >
          404
        </GlitchText>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="border-gold/20 shadow-2xl bg-card/90 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-8 text-center">
            {/* Simplified animated element */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gold/5 p-5 rounded-full inline-block mb-6"
            >
              <Clock className="h-12 w-12 text-gold mx-auto" />
            </motion.div>

            {/* Clear hierarchy with main heading */}
            <h1 className="text-3xl font-bold mb-4 text-gold-light uppercase tracking-wide">
              Feature In Development
            </h1>

            {/* Supporting text with clear hierarchy */}
            <p className="text-xl text-muted-foreground mb-6">
              We're crafting an exceptional experience for you
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                This feature is currently under development and will be available in the near future.
              </p>
              <p className="text-muted-foreground">
                Stay tuned for updates as we work to bring you this enhanced functionality.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
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
            </div>

            {/* Follow prompt */}
            <div className="pt-6 border-t border-gold/20">
              <p className="text-sm text-muted-foreground mb-1">
                Want to be notified when this feature launches?
              </p>
              <p className="text-gold font-medium">
                Follow us for updates
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ComingSoon;