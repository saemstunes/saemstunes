
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
  clickable?: boolean;
  inMobileMenu?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = "icon", 
  size = "md", 
  className = "", 
  clickable = true,
  inMobileMenu = false
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
      "flex items-center",
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
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-block">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export default Logo;
