// components/ui/FeatureTriggerCounter.tsx
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface FeatureTriggerCounterProps {
  currentCount: number;
  maxCount: number;
  featureName: string;
}

export const FeatureTriggerCounter: React.FC<FeatureTriggerCounterProps> = ({
  currentCount,
  maxCount,
  featureName
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="cursor-help">
            {featureName}: {currentCount}/{maxCount}
            <Info className="ml-1 h-3 w-3" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>This feature will stop appearing after {maxCount} uses</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
