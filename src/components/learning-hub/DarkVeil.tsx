import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "@/components/learning-hub/DarkVeil.css";

interface DarkVeilProps {
  isVisible: boolean;
  onClick: () => void;
}

const DarkVeil = ({ isVisible, onClick }: DarkVeilProps) => {
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!veilRef.current) return;
    
    if (isVisible) {
      gsap.to(veilRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }, [isVisible]);

  return (
    <div
      ref={veilRef}
      className={`darkveil ${isVisible ? 'visible' : ''}`}
      onClick={onClick}
      aria-hidden={!isVisible}
    />
  );
};

export default DarkVeil;
