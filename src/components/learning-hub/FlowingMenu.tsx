import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./FlowingMenu.css";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    
    if (isOpen) {
      gsap.fromTo(menuRef.current, 
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1,
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current && 
        !menuRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className={`flowing-menu-container ${className}`}
      onMouseEnter={!isMobile && trigger === "hover" ? handleOpen : undefined}
      onMouseLeave={!isMobile && trigger === "hover" ? handleClose : undefined}
    >
      <button 
        ref={buttonRef}
        className="flowing-menu-button"
        onTouchStart={isMobile ? handleOpen : undefined}
        onTouchEnd={isMobile ? () => clearTimeout(longPressTimer.current!) : undefined}
        onClick={isMobile && mobileBehavior === "click" ? handleOpen : undefined}
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
          className="flowing-menu-items"
          onMouseLeave={!isMobile ? handleClose : undefined}
        >
          {items.map((item, index) => (
            <button
              key={index}
              className={`flowing-menu-item ${item.disabled ? 'opacity-60' : ''}`}
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
