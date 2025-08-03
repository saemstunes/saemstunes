
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Music, Clock, Star, BookOpen, Mic, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const viewMode = user?.role || "student";
  const [activeTab, setActiveTab] = useState("lessons");

  // Service data based on setmore.com website
  const musicLessons = [
    {
      id: "piano-lessons",
      title: "Piano Lessons",
      description: "One-on-one piano lessons tailored to your skill level and goals",
      duration: "30-60 min",
      price: viewMode === "student" ? "$30-50" : "$45-75",
      image: "/placeholder.svg",
      instructor: "Saem",
      availability: "Mon, Wed, Fri"
    },
    {
      id: "guitar-lessons",
      title: "Guitar Lessons",
      description: "Learn acoustic, electric, or bass guitar with personalized instruction",
      duration: "45 min",
      price: viewMode === "student" ? "$35" : "$55", 
      image: "/placeholder.svg",
      instructor: "Saem",
      availability: "Tue, Thu"
    },
    {
      id: "vocal-lessons",
      title: "Vocal Training",
      description: "Develop your singing voice with professional vocal coaching",
      duration: "45-60 min",
      price: viewMode === "student" ? "$40" : "$65",
      image: "/placeholder.svg",
      instructor: "Lisa",
      availability: "Mon-Fri"
    },
    {
      id: "songwriting",
      title: "Songwriting Workshop",
      description: "Learn to write compelling lyrics and compose original music",
      duration: "60 min",
      price: viewMode === "student" ? "$45" : "$70",
      image: "/placeholder.svg",
      instructor: "Saem",
      availability: "Weekends"
    }
  ];

  const recordingServices = [
    {
      id: "recording-session",
      title: "Studio Recording Session",
      description: "Professional recording session in our state-of-the-art studio",
      duration: "2 hours",
      price: "$120",
      image: "/placeholder.svg",
      availability: "By appointment"
    },
    {
      id: "mixing-mastering",
      title: "Mixing & Mastering",
      description: "Expert audio mixing and mastering for your recordings",
      duration: "Per project",
      price: "From $150",
      image: "/placeholder.svg",
      availability: "3-5 day turnaround"
    },
    {
      id: "music-production",
      title: "Music Production",
      description: "Full production services for your musical project",
      duration: "Custom",
      price: "Quote based",
      image: "/placeholder.svg",
      availability: "Contact for details"
    }
  ];
  
  const performanceServices = [
    {
      id: "live-performance",
      title: "Live Performance",
      description: "Book Saem's Tunes musicians for your event or venue",
      duration: "1-3 hours",
      price: "From $300",
      image: "/placeholder.svg",
      availability: "Weekends"
    },
    {
      id: "custom-composition",
      title: "Custom Composition",
      description: "Commission original music for your project, event, or personal use",
      duration: "Per project",
      price: "From $250",
      image: "/placeholder.svg",
      availability: "2-4 weeks delivery"
    }
  ];

  // Navigate to payment or booking based on service type
  const handleServiceSelect = (service) => {
    // For lessons, navigate to booking
    if (activeTab === "lessons") {
      navigate(`/book/${service.id}`, { state: { service } });
    } else {
      // For other services, navigate to payment
      navigate(`/payment`, { state: { service } });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-proxima font-bold">Our Services</h1>
          <p className="text-muted-foreground mt-1">
            Discover music lessons, recording services, and performances offered by Saem's Tunes
          </p>
        </div>

        {/* Featured service banner */}
        <div className="relative rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-r from-gold/30 to-gold-dark/30 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
          <img 
            src="/placeholder.svg" 
            alt="Featured service" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="relative z-20 p-6 flex flex-col h-full justify-end">
            <div className="inline-block bg-gold text-white px-2 py-1 rounded-md text-xs mb-2 w-fit">
              FEATURED
            </div>
            <h3 className="text-xl md:text-2xl font-proxima text-white font-bold mb-1">
              One-on-One Music Instruction
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-lg">
              Personalized lessons tailored to your goals and skill level
            </p>
            <Button 
              className="mt-4 bg-gold hover:bg-gold-dark w-fit"
              onClick={() => navigate('/book/featured-lesson')}
            >
              Book Now
            </Button>
          </div>
        </div>

        <Tabs defaultValue="lessons" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="lessons">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Music Lessons</span>
            </TabsTrigger>
            <TabsTrigger value="recording">
              <Mic className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Recording</span>
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Music className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lessons" className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-proxima font-semibold">Music Instruction</h2>
              <Button variant="outline" className="text-sm" onClick={() => navigate('/library')}>
                View Related Resources
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {musicLessons.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onSelect={() => handleServiceSelect(service)}
                  buttonText="Book Lesson"
                  icon={<BookOpen className="h-5 w-5" />}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recording" className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-proxima font-semibold">Recording Services</h2>
              <Button variant="outline" className="text-sm" onClick={() => navigate('/library')}>
                View Sample Work
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recordingServices.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onSelect={() => handleServiceSelect(service)}
                  buttonText="Request Service"
                  icon={<Mic className="h-5 w-5" />}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-proxima font-semibold">Performance & Composition</h2>
              <Button variant="outline" className="text-sm" onClick={() => navigate('/library')}>
                Listen to Our Work
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceServices.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onSelect={() => handleServiceSelect(service)}
                  buttonText="Inquire"
                  icon={<Music className="h-5 w-5" />}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Testimonials */}
        <div className="mt-12">
          <h2 className="text-xl font-proxima font-semibold mb-6">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="The piano lessons with Saem completely transformed my playing. I went from beginner to performing confidently in just a few months."
              name="Michael R."
              role="Piano Student"
              rating={5}
            />
            <TestimonialCard 
              quote="I've always wanted to record my own songs, and the studio recording session at Saem's Tunes made that dream come true with professional-quality results."
              name="Sarah K."
              role="Recording Client"
              rating={5}
            />
            <TestimonialCard 
              quote="The songwriting workshop opened up my creativity in ways I never expected. I now have the tools to express myself through music."
              name="David L."
              role="Songwriting Student"
              rating={4}
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-muted p-6 rounded-lg mt-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-proxima font-semibold mb-2">Ready to Start Your Musical Journey?</h2>
            <p className="text-muted-foreground max-w-lg mb-4">
              Whether you're looking to learn an instrument, record your music, or book performers for an event,
              we're here to help you bring your musical vision to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-gold hover:bg-gold-dark" onClick={() => navigate('/contact-us')}>
                Contact Us
              </Button>
              <Button variant="outline" onClick={() => navigate('/book/consultation')}>
                Book a Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Service Card Component
const ServiceCard = ({ service, onSelect, buttonText, icon }) => (
  <Card className="overflow-hidden flex flex-col h-full">
    <div className="relative">
      <img src={service.image} alt={service.title} className="w-full h-40 object-cover" />
      <div className="absolute top-2 right-2">
        <Badge className="bg-gold">{service.price}</Badge>
      </div>
    </div>
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <CardTitle className="text-lg">{service.title}</CardTitle>
        <span className="bg-gold/10 p-1 rounded-full">
          {icon}
        </span>
      </div>
      <CardDescription>{service.description}</CardDescription>
    </CardHeader>
    <CardContent className="pb-2 flex-grow">
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{service.duration}</span>
        </div>
        {service.instructor && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Instructor: {service.instructor}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{service.availability}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button 
        className="w-full bg-gold hover:bg-gold-dark"
        onClick={onSelect}
      >
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, name, role, rating }) => (
  <Card className="p-6">
    <div className="flex justify-between items-start">
      <div className="text-gold flex">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-gold" />
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <Star key={i + rating} className="h-4 w-4" />
        ))}
      </div>
      <DollarSign className="h-8 w-8 text-muted-foreground/20" />
    </div>
    <p className="mt-4 text-sm italic">"{quote}"</p>
    <div className="mt-4 pt-4 border-t">
      <p className="font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </Card>
);

export default Services;
