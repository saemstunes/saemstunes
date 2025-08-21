"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    addAnimation();
    
    // Re-initialize animation on window resize
    const handleResize = () => {
      if (containerRef.current && scrollerRef.current) {
        // Clear existing animation
        scrollerRef.current.style.animation = 'none';
        
        // Remove any duplicated items
        const scrollerContent = Array.from(scrollerRef.current.children);
        const originalItems = scrollerContent.slice(0, items.length);
        scrollerRef.current.innerHTML = '';
        originalItems.forEach(item => scrollerRef.current?.appendChild(item));
        
        // Re-add animation
        setTimeout(() => addAnimation(), 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items.length, isMobile]);

  const [start, setStart] = useState(false);
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", isMobile ? "30s" : "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", isMobile ? "50s" : "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", isMobile ? "100s" : "80s");
      }
    }
  };
  
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden",
        isMobile 
          ? "[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]" 
          : "[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-3 sm:gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[85vw] xs:w-[75vw] sm:w-[320px] md:w-[380px] lg:w-[450px] max-w-full shrink-0 rounded-2xl border border-b-0 border-border bg-gradient-to-b from-card to-muted p-4 sm:p-5 md:px-6 md:py-5"
            key={item.name + idx}
          >
            <blockquote className="h-full flex flex-col">
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-xs sm:text-sm md:text-base leading-[1.5] sm:leading-[1.6] font-normal text-foreground flex-grow">
                {item.quote}
              </span>
              <div className="relative z-20 mt-3 sm:mt-4 md:mt-5 flex flex-row items-center">
                <span className="flex flex-col gap-0.5 sm:gap-1">
                  <span className="text-xs sm:text-sm md:text-base leading-[1.4] sm:leading-[1.6] font-normal text-primary">
                    {item.name}
                  </span>
                  <span className="text-[10px] xs:text-xs sm:text-sm leading-[1.4] font-normal text-muted-foreground">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
