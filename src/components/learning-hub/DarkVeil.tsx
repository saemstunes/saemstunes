import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface DarkVeilProps {
  isVisible: boolean;
  onClick: () => void;
  hueShift?: number;
  noiseIntensity?: number;
  speed?: number;
}

const DarkVeil = ({
  isVisible,
  onClick,
  hueShift = 120,
  noiseIntensity = 0.02,
  speed = 0.3
}: DarkVeilProps) => {
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!veilRef.current) return;
    
    if (isVisible) {
      gsap.to(veilRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        display: "block"
      });
    } else {
      gsap.to(veilRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        display: "none"
      });
    }
  }, [isVisible]);

  return (
    <div
      ref={veilRef}
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm hidden opacity-0"
      onClick={onClick}
      aria-hidden={!isVisible}
      style={{
        background: `
          radial-gradient(circle at 70% 30%, 
            hsla(${hueShift}, 70%, 20%, 0.8) 0%, 
            hsla(${hueShift + 30}, 90%, 5%, 0.9) 100%
          ),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23c69b36' fill-opacity='${noiseIntensity}' fill-rule='evenodd'/%3E%3C/svg%3E")
        `
      }}
    />
  );
};

export default DarkVeil;
