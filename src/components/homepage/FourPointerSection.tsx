
import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Users, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Pointer {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  cta: string;
  link: string;
  gradient: string;
}

const FourPointerSection: React.FC = () => {
  const navigate = useNavigate();

  const pointers: Pointer[] = [
    {
      icon: Star,
      title: "Why Choose Saem's Tunes",
      description: "Experience authentic music education with personalized learning paths and real-world application.",
      cta: "Discover Our Story",
      link: "/support-us",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: TrendingUp,
      title: "Learning Path Preview",
      description: "From beginner chords to advanced composition - follow a structured journey that grows with you.",
      cta: "View Learning Paths",
      link: "/learning-hub",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Join thousands of musicians who've transformed their musical journey through our supportive community.",
      cta: "Read Success Stories",
      link: "/community",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: Zap,
      title: "Exclusive Benefits",
      description: "Access premium content, one-on-one sessions, and advanced tools designed for serious musicians.",
      cta: "Explore Premium",
      link: "/subscriptions",
      gradient: "from-purple-500/20 to-pink-500/20"
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Your Musical Journey <span className="text-primary">Starts Here</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover what makes Saem's Tunes the perfect platform for musicians at every level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pointers.map((pointer, index) => (
          <motion.div
            key={pointer.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardContent className="p-6 h-full flex flex-col">
                <div className={`bg-gradient-to-br ${pointer.gradient} rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <pointer.icon className="h-6 w-6 text-primary" />
                </div>
                
                <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                  {pointer.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {pointer.description}
                </p>
                
                <Button 
                  variant="ghost" 
                  className="group/btn p-0 h-auto justify-start hover:bg-transparent"
                  onClick={() => navigate(pointer.link)}
                >
                  <span className="text-primary font-medium text-sm">{pointer.cta}</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-primary group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FourPointerSection;
