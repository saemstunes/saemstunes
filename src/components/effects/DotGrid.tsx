// components/effects/MusicIconGrid.tsx
'use client';
import { useRef, useEffect, useCallback, useMemo, useContext } from "react";
import { gsap } from "gsap";
import { ThemeContext } from "@/context/ThemeContext";
import "./DotGrid.css";

const throttle = (func: Function, limit: number) => {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

interface DotGridProps {
  iconSize?: number;
  gap?: number;
  lightBaseColor?: string;
  lightActiveColor?: string;
  darkBaseColor?: string;
  darkActiveColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

// SVG Icons as React components
const MusicIcon = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18V5L21 3V16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="18" r="3" fill={color}/>
    <circle cx="18" cy="16" r="3" fill={color}/>
  </svg>
);

const PlayIcon = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3L19 12L5 21V3Z" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BookIcon = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SmileIcon = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="9" r="1" fill={color}/>
    <circle cx="15" cy="9" r="1" fill={color}/>
  </svg>
);

const DotGrid = ({
  iconSize = 24,
  gap = 40,
  lightBaseColor = "#A67C00", // Gold default
  lightActiveColor = "#3B82F6", // Blue accent
  darkBaseColor = "#A67C00", // Gold default
  darkActiveColor = "#3B82F6", // Blue accent
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style,
}: DotGridProps) => {
  const { theme } = useContext(ThemeContext);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<any[]>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  // Determine colors based on current theme
  const baseColor = theme === "dark" ? darkBaseColor : lightBaseColor;
  const activeColor = theme === "dark" ? darkActiveColor : lightActiveColor;

  // Array of icon components
  const iconComponents = useMemo(() => [
    (props: any) => <MusicIcon {...props} />,
    (props: any) => <PlayIcon {...props} />,
    (props: any) => <BookIcon {...props} />,
    (props: any) => <SmileIcon {...props} />,
  ], []);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const container = containerRef.current;
    if (!wrap || !container) return;

    const { width, height } = wrap.getBoundingClientRect();
    
    // Clear previous icons
    container.innerHTML = '';
    
    const cols = Math.floor((width + gap) / (iconSize + gap));
    const rows = Math.floor((height + gap) / (iconSize + gap));
    const cell = iconSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + iconSize / 2;
    const startY = extraY / 2 + iconSize / 2;

    const icons = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        
        // Create icon element
        const iconDiv = document.createElement('div');
        iconDiv.className = 'music-icon';
        iconDiv.style.position = 'absolute';
        iconDiv.style.left = `${cx - iconSize/2}px`;
        iconDiv.style.top = `${cy - iconSize/2}px`;
        iconDiv.style.width = `${iconSize}px`;
        iconDiv.style.height = `${iconSize}px`;
        iconDiv.style.transition = 'color 0.3s ease';
        iconDiv.style.color = baseColor;
        
        // Randomly select an icon
        const IconComponent = iconComponents[Math.floor(Math.random() * iconComponents.length)];
        
        // Render the icon
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconSvg.setAttribute('width', iconSize.toString());
        iconSvg.setAttribute('height', iconSize.toString());
        iconSvg.setAttribute('viewBox', '0 0 24 24');
        iconSvg.innerHTML = IconComponent({ color: baseColor, size: iconSize }).props.children;
        
        iconDiv.appendChild(iconSvg);
        container.appendChild(iconDiv);
        
        icons.push({ 
          element: iconDiv, 
          cx, 
          cy, 
          xOffset: 0, 
          yOffset: 0, 
          _inertiaApplied: false,
          baseColor,
          activeColor
        });
      }
    }
    iconsRef.current = icons;
  }, [iconSize, gap, baseColor, iconComponents]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(buildGrid);
      if (wrapperRef.current) ro.observe(wrapperRef.current);
    } else {
      window.addEventListener("resize", buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const icon of iconsRef.current) {
        const dist = Math.hypot(icon.cx - pr.x, icon.cy - pr.y);
        
        // Change color based on proximity
        if (dist < proximity) {
          const t = 1 - dist / proximity;
          icon.element.style.color = `color-mix(in srgb, ${icon.baseColor} ${(1-t)*100}%, ${icon.activeColor} ${t*100}%)`;
        } else {
          icon.element.style.color = icon.baseColor;
        }
        
        if (speed > speedTrigger && dist < proximity && !icon._inertiaApplied) {
          icon._inertiaApplied = true;
          gsap.killTweensOf(icon);
          const pushX = icon.cx - pr.x + vx * 0.005;
          const pushY = icon.cy - pr.y + vy * 0.005;
          gsap.to(icon, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
              icon.element.style.transform = `translate(${icon.xOffset}px, ${icon.yOffset}px)`;
            },
            onComplete: () => {
              gsap.to(icon, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
                onUpdate: () => {
                  icon.element.style.transform = `translate(${icon.xOffset}px, ${icon.yOffset}px)`;
                },
                onComplete: () => {
                  icon._inertiaApplied = false;
                }
              });
            },
          });
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const icon of iconsRef.current) {
        const dist = Math.hypot(icon.cx - cx, icon.cy - cy);
        if (dist < shockRadius && !icon._inertiaApplied) {
          icon._inertiaApplied = true;
          gsap.killTweensOf(icon);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (icon.cx - cx) * shockStrength * falloff;
          const pushY = (icon.cy - cy) * shockStrength * falloff;
          gsap.to(icon, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
              icon.element.style.transform = `translate(${icon.xOffset}px, ${icon.yOffset}px)`;
            },
            onComplete: () => {
              gsap.to(icon, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
                onUpdate: () => {
                  icon.element.style.transform = `translate(${icon.xOffset}px, ${icon.yOffset}px)`;
                },
                onComplete: () => {
                  icon._inertiaApplied = false;
                }
              });
            },
          });
        }
      }
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener("mousemove", throttledMove as EventListener, { passive: true });
    window.addEventListener("click", onClick as EventListener);

    return () => {
      window.removeEventListener("mousemove", throttledMove as EventListener);
      window.removeEventListener("click", onClick as EventListener);
    };
  }, [maxSpeed, speedTrigger, proximity, returnDuration, shockRadius, shockStrength]);

  return (
    <section className={`music-icon-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <div ref={containerRef} className="dot-grid__container" />
      </div>
    </section>
  );
};

export default DotGrid;
