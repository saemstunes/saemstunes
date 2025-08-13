import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  disabled?: boolean;
}

interface FlowingMenuProps {
  items: MenuItem[];
  trigger?: "hover" | "click";
  className?: string;
  mobileBehavior?: "long-press" | "click";
}

const FlowingMenu = ({
  items,
  trigger = "hover",
  className = "",
  mobileBehavior = "long-press"
}: FlowingMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    
    if (isOpen) {
      gsap.fromTo(menuRef.current.children, 
        { opacity: 0, y: 10 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.3,
          ease: "power2.out"
        }
      );
    }
  }, [isOpen]);

  const handleOpen = () => {
    if (isMobile && mobileBehavior === "long-press") {
      longPressTimer.current = setTimeout(() => {
        setIsOpen(true);
      }, 500);
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsOpen(false);
  };

  const handleItemClick = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={!isMobile && trigger === "hover" ? handleOpen : undefined}
      onMouseLeave={!isMobile && trigger === "hover" ? handleClose : undefined}
      onTouchStart={isMobile ? handleOpen : undefined}
      onTouchEnd={isMobile ? () => clearTimeout(longPressTimer.current!) : undefined}
      onClick={isMobile && mobileBehavior === "click" ? handleOpen : undefined}
    >
      <button 
        className="w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center transition-colors"
        aria-label="Course actions"
        aria-expanded={isOpen}
      >
        <div className="w-1 h-1 rounded-full bg-gold-dark mx-0.5" />
        <div className="w-1 h-1 rounded-full bg-gold-dark mx-0.5" />
        <div className="w-1 h-1 rounded-full bg-gold-dark mx-0.5" />
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden py-2"
          onMouseLeave={!isMobile ? handleClose : undefined}
        >
          {items.map((item, index) => (
            <button
              key={index}
              className={`w-full px-4 py-3 text-left flex items-center text-sm transition-colors ${
                item.disabled 
                  ? "text-muted-foreground cursor-not-allowed" 
                  : "hover:bg-cream text-brown"
              }`}
              onClick={() => !item.disabled && handleItemClick(item.action)}
              disabled={item.disabled}
              aria-disabled={item.disabled}
            >
              <span className="mr-3 text-gold">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlowingMenu;
