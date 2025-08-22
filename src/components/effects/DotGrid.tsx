// components/effects/DotGrid.tsx
'use client';
import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "@/context/ThemeContext";
import { 
  Music2, 
  PlayCircle, 
  BookOpen, 
  Smile 
} from "lucide-react";
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

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

interface DotGridProps {
  dotSize?: number;
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

const DotGrid = ({
  dotSize = 16,
  gap = 32,
  lightBaseColor = "#f5f2e6",
  lightActiveColor = "#A67C00",
  darkBaseColor = "#3a2e2e",
  darkActiveColor = "#A67C00",
  proximity = 120,
  speedTrigger = 80,
  shockRadius = 250,
  shockStrength = 2.5,
  maxSpeed = 5000,
  resistance = 800,
  returnDuration = 2.1,
  className = "",
  style,
}: DotGridProps) => {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<any[]>([]);
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
  const [icons, setIcons] = useState<JSX.Element[]>([]);

  // Determine colors based on current theme
  const baseColor = theme === "dark" ? darkBaseColor : lightBaseColor;
  const activeColor = theme === "dark" ? darkActiveColor : lightActiveColor;

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  // Array of Lucide icon components
  const iconComponents = useMemo(() => [
    (color: string, size: number) => <Music2 key="music" color={color} size={size} />,
    (color: string, size: number) => <PlayCircle key="play" color={color} size={size} />,
    (color: string, size: number) => <BookOpen key="book" color={color} size={size} />,
    (color: string, size: number) => <Smile key="smile" color={color} size={size} />,
  ], []);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const container = containerRef.current;
    if (!wrap || !container) return;

    const { width, height } = wrap.getBoundingClientRect();
    
    // Clear previous icons
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2;
    const startY = extraY / 2;

    const dots = [];
    const newIcons: JSX.Element[] = [];
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        
        // Randomly select an icon
        const IconComponent = iconComponents[Math.floor(Math.random() * iconComponents.length)];
        
        dots.push({ 
          cx, 
          cy, 
          xOffset: 0, 
          yOffset: 0, 
          _inertiaApplied: false,
          element: null
        });
        
        // Create the icon element
        const iconElement = (
          <div
            key={`${x}-${y}`}
            className="dot-grid__icon"
            style={{
              position: 'absolute',
              left: `${cx}px`,
              top: `${cy}px`,
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              transform: 'translate(-50%, -50%)',
              transition: 'color 0.3s ease',
              color: baseColor,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {IconComponent(baseColor, dotSize * 0.7)}
          </div>
        );
        
        newIcons.push(iconElement);
      }
    }
    
    dotsRef.current = dots;
    setIcons(newIcons);
  }, [dotSize, gap, baseColor, iconComponents]);

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

  // Update icon colors based on proximity
  useEffect(() => {
    if (!containerRef.current) return;

    const icons = containerRef.current.querySelectorAll('.dot-grid__icon');
    if (icons.length === 0) return;

    const { x: px, y: py } = pointerRef.current;
    const proxSq = proximity * proximity;

    icons.forEach((iconEl, index) => {
      const dot = dotsRef.current[index];
      if (!dot) return;

      const dx = dot.cx - px;
      const dy = dot.cy - py;
      const dsq = dx * dx + dy * dy;

      if (dsq <= proxSq) {
        const dist = Math.sqrt(dsq);
        const t = 1 - dist / proximity;
        const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
        const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
        const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        const color = `rgb(${r},${g},${b})`;
        
        (iconEl as HTMLElement).style.color = color;
      } else {
        (iconEl as HTMLElement).style.color = baseColor;
      }

      // Apply position offsets for animation
      (iconEl as HTMLElement).style.transform = `translate(-50%, -50%) translate(${dot.xOffset}px, ${dot.yOffset}px)`;
    });
  }, [proximity, baseColor, activeRgb, baseRgb]);

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

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
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
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
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
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <div ref={containerRef} className="dot-grid__container">
          {icons}
        </div>
      </div>
    </section>
  );
};

export default DotGrid;
