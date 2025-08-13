import React, { useRef } from "react";
import { gsap } from "gsap";
import "./FlowingMenu.css";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  disabled?: boolean;
}

interface FlowingMenuProps {
  items: MenuItem[];
  direction?: "horizontal" | "vertical";
  className?: string;
}

const FlowingMenu = ({ 
  items, 
  direction = "vertical",
  className = ""
}: FlowingMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent, item: MenuItem) => {
    if (!menuRef.current || item.disabled) return;
    
    const menuItem = e.currentTarget;
    const marquee = menuItem.querySelector('.marquee') as HTMLElement;
    const rect = menuItem.getBoundingClientRect();
    
    const isTop = e.clientY < rect.top + rect.height / 2;
    const initialY = isTop ? '-101%' : '101%';
    
    gsap.set(marquee, { y: initialY });
    gsap.to(marquee, { 
      y: '0%',
      duration: 0.6,
      ease: "expo.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const menuItem = e.currentTarget;
    const marquee = menuItem.querySelector('.marquee') as HTMLElement;
    const rect = menuItem.getBoundingClientRect();
    
    const isTop = e.clientY < rect.top + rect.height / 2;
    const exitY = isTop ? '-101%' : '101%';
    
    gsap.to(marquee, { 
      y: exitY,
      duration: 0.6,
      ease: "expo.in"
    });
  };

  return (
    <div 
      ref={menuRef}
      className={`menu-wrap ${direction} ${className}`}
    >
      <nav className="menu">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className={`menu__item ${item.disabled ? 'opacity-60' : ''}`}
            onMouseEnter={(e) => handleMouseEnter(e, item)}
            onMouseLeave={handleMouseLeave}
            onClick={item.disabled ? undefined : item.action}
            aria-disabled={item.disabled}
          >
            <div className="menu__item-content">
              {item.icon && <span className="menu-icon">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
            
            <div className="marquee">
              <div className="marquee__inner">
                {[...Array(4)].map((_, i) => (
                  <React.Fragment key={i}>
                    <span>{item.label}</span>
                    <div className="marquee__icon">
                      {item.icon}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default FlowingMenu;
