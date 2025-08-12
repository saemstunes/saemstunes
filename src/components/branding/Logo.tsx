import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
  clickable?: boolean;
  inMobileMenu?: boolean;
  showText?: boolean;
  align?: "left" | "center" | "right";
}

const Logo: React.FC<LogoProps> = ({ 
  variant = "icon", 
  size = "md", 
  className = "", 
  clickable = true,
  inMobileMenu = false,
  showText = false,
  align = "center"
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (clickable) {
      navigate("/");
    }
  };

  // Height-only sizing configuration - maintains natural aspect ratio
  const heightClasses = {
    icon: {
      sm: "h-8",
      md: "h-10",
      lg: "h-12"
    },
    full: {
      sm: "h-8",   // Maintains natural width for full logo
      md: "h-10",  // (will be wider than icon but proportional)
      lg: "h-12"
    }
  };

  // Text sizing to match logo scale
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const heightClass = heightClasses[variant][size];
  const textSizeClass = textSizeClasses[size];

  // Use single SVG source for each variant - scales via height
  const logoSrc = variant === "icon" 
    ? "/lovable-uploads/logo-icon.svg" 
    : "/lovable-uploads/logo-full.svg";

  const logoElement = (
    <div className={cn(
      "flex items-center gap-2",
      align === "center" && "justify-center",
      align === "left" && "justify-start",
      align === "right" && "justify-end",
      clickable && "cursor-pointer",
      className
    )}>
      <picture>
        <img
          src={logoSrc}
          alt="Saem's Tunes Logo"
          className={cn(heightClass, "object-contain")}
          fetchPriority="high"
        />
      </picture>
      {showText && (
        <div className={cn(
          "flex flex-col leading-tight",
          align === "center" && "text-center",
          align === "left" && "text-left",
          align === "right" && "text-right"
        )}> 
          <span className={cn("text-yellow-500 font-bold font-nunito", textSizeClass)}>
            Saem's
          </span> 
          <span className={cn("text-amber-800 font-bold font-nunito", textSizeClass)}>
            Tunes
          </span> 
        </div>
      )}
    </div>
  );

  return clickable ? (
    <Link to="/" className="inline-block">{logoElement}</Link>
  ) : logoElement;
};

export default Logo;
