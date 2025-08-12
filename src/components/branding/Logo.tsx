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

  // Restored all original SVG versions with height-only sizing
  const logoConfig = {
    icon: {
      sm: { src: "/lovable-uploads/logo-icon-sm.svg", height: "h-8" },
      md: { src: "/lovable-uploads/logo-icon-md.svg", height: "h-10" },
      lg: { src: "/lovable-uploads/logo-icon-lg.svg", height: "h-12" }
    },
    full: {
      sm: { src: "/lovable-uploads/logo-full-md.svg", height: "h-8" },
      md: { src: "/lovable-uploads/logo-full-md.svg", height: "h-10" },
      lg: { src: "/lovable-uploads/logo-full-lg.svg", height: "h-12" }
    }
  };

  // Text sizing to match logo scale
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const config = logoConfig[variant][size];
  const textSizeClass = textSizeClasses[size];

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
          src={config.src}
          alt="Saem's Tunes Logo"
          className={cn(config.height, "object-contain")}
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

  // Apply the same alignment principles to the clickable wrapper
  return clickable ? (
    <Link 
      to="/" 
      className={cn(
        "inline-block",
        align === "center" && "mx-auto block",
        align === "right" && "ml-auto block",
        inMobileMenu && "block" // Ensure proper block behavior in mobile
      )}
    >
      {logoElement}
    </Link>
  ) : logoElement;
};

export default Logo;
