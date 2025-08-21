"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export function WorldMap({
  dots = [],
  lineColor = "#A67C00", // Using your primary gold color
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [svgMap, setSvgMap] = useState<string>("");
  
  // Listen for theme changes using the same logic as your ThemeToggle
  useEffect(() => {
    const checkTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      if (savedTheme) {
        setIsDark(savedTheme === "dark");
      } else {
        setIsDark(prefersDark);
      }
    };
    
    // Check theme initially
    checkTheme();
    
    // Listen for storage events (when theme changes in other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        checkTheme();
      }
    };
    
    // Listen for custom theme change events if your ThemeToggle dispatches them
    const handleThemeChange = () => {
      checkTheme();
    };
    
    // Set up event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("themeChange", handleThemeChange as EventListener);
    
    // Also check for class changes on documentElement as a fallback
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themeChange", handleThemeChange as EventListener);
      observer.disconnect();
    };
  }, []);
  
  // Generate map with proper theme colors
  useEffect(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    
    // Use your exact theme colors
    const backgroundColor = isDark ? "#1e1917" : "#f8f5f0"; // Dark brown / Light cream
    const dotColor = isDark ? "#A6A6A640" : "#66593F40"; // Muted colors from your theme
    
    const generatedSvgMap = map.getSVG({
      radius: 0.22,
      color: dotColor,
      shape: "circle",
      backgroundColor: backgroundColor,
    });
    setSvgMap(generatedSvgMap);
  }, [isDark]);
  
  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - (lat - 5.73)) * (400 / 180);
    return { x, y };
  };
  
  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };
  
  return (
    <div className="w-full aspect-[2/1] bg-background rounded-lg relative font-sans">
      {svgMap && (
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
          alt="world map"
          height="495"
          width="1056"
          draggable={false}
        />
      )}
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
