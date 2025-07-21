
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Users, BookOpen, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FourPointerSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Music className="h-6 w-6 text-gold" />,
      title: "Learn & Create",
      description: "Access interactive lessons, tools, and create your own music with our comprehensive learning platform.",
      action: "Start Learning",
      route: "/learning-hub"
    },
    {
      icon: <Users className="h-6 w-6 text-gold" />,
      title: "Connect & Share",
      description: "Join our vibrant community of musicians, share your tracks, and collaborate with fellow artists.",
      action: "Join Community",
      route: "/community"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-gold" />,
      title: "Resources & Guides",
      description: "Explore our library of infographics, sheet music, and educational materials to enhance your skills.",
      action: "Browse Resources",
      route: "/resources"
    },
    {
      icon: <Award className="h-6 w-6 text-gold" />,
      title: "Track Progress",
      description: "Monitor your musical journey with certificates, achievements, and personalized learning paths.",
      action: "View Progress",
      route: "/profile"
    }
  ];

  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Everything You Need to Succeed</h2>
        <p className="text-muted-foreground">Comprehensive tools and resources for your musical journey</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center h-full flex flex-col">
              <div className="bg-gold/10 rounded-full p-3 w-fit mx-auto mb-4">
                {feature.icon}
              </div>
              
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                {feature.description}
              </p>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(feature.route)}
                className="w-full group"
              >
                {feature.action}
                <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FourPointerSection;
