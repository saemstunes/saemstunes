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
  align?: "left" | "center"; // New alignment prop
}

const Logo: React.FC<LogoProps> = ({ 
  variant = "icon", 
  size = "md", 
  className = "", 
  clickable = true,
  inMobileMenu = false,
  showText = false,
  align = "center" // Default to center
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (clickable) {
      navigate("/");
    }
  };

  const logoConfig = {
    icon: {
      sm: { src: "/lovable-uploads/logo-icon-sm.svg", width: "w-8", height: "h-8" },
      md: { src: "/lovable-uploads/logo-icon-md.svg", width: "w-10", height: "h-10" },
      lg: { src: "/lovable-uploads/logo-icon-lg.svg", width: "w-12", height: "h-12" }
    },
    full: {
      sm: { src: "/lovable-uploads/logo-full-md.svg", width: "w-24", height: "h-8" },
      md: { src: "/lovable-uploads/logo-full-md.svg", width: "w-32", height: "h-10" },
      lg: { src: "/lovable-uploads/logo-full-lg.svg", width: "w-40", height: "h-12" }
    }
  };

  const config = logoConfig[variant][size];

  const logoElement = (
    <div className={cn(
      "flex items-center gap-2",
      // Apply alignment classes based on prop
      align === "left" ? "justify-start" : "justify-center",
      clickable && "cursor-pointer",
      className
    )}>
      <picture>
        <img
          src={config.src}
          alt="Saem's Tunes Logo"
          className={cn(config.width, config.height, "object-contain")}
          fetchPriority="high"
        />
      </picture>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-yellow-500 font-bold text-base font-nunito">Saem's</span>
          <span className="text-amber-800 font-bold text-base font-nunito">Tunes</span>
        </div>
      )}
    </div>
  );

  return clickable ? (
    <Link to="/" className="inline-block">{logoElement}</Link>
  ) : logoElement;
};

export default Logo;
