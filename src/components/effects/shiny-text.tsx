import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText = ({ 
  text, 
  disabled = false, 
  speed = 5, 
  className = "" 
}: ShinyTextProps) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        "shiny-text",
        disabled && "disabled",
        className
      )}
      style={{ animationDuration }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
