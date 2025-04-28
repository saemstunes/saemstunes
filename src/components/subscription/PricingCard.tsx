
import { SubscriptionPlan } from "@/data/mockData";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PricingCardProps {
  plan: SubscriptionPlan;
  variant?: string;
  className?: string;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  const { toast } = useToast();

  const handleSubscribe = () => {
    toast({
      title: "Coming Soon",
      description: "Subscription functionality will be available soon!",
    });
  };

  return (
    <Card className={cn(
      "relative transition-all duration-300",
      plan.isPopular && "border-gold shadow-lg"
    )}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge className="bg-gold text-white">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className={cn(
        "pb-0 pt-6",
        plan.isPopular && "pt-8"
      )}>
        <h3 className="text-2xl font-serif font-medium text-center">{plan.name}</h3>
        <div className="mt-4 text-center">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1 bg-gold/10 rounded-full p-0.5">
                <Check className="h-4 w-4 text-gold" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={cn(
            "w-full",
            plan.isPopular 
              ? "bg-gold hover:bg-gold-dark text-white" 
              : "bg-muted hover:bg-muted/80"
          )}
          onClick={handleSubscribe}
        >
          Subscribe Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
