'use client';
import { useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { useTheme } from "@/context/ThemeContext";
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
  velocityMultiplier?: number;
  style?: React.CSSProperties;
  idleWaveInterval?: number;
  waveAmplitude?: number;
  waveSpeed?: number;
}

const DotGrid = ({
  dotSize = 7,
  gap = 22.5,
  lightBaseColor = "#f5f2e6",
  lightActiveColor = "#A67C00",
  darkBaseColor = "#3a2e2e",
  darkActiveColor = "#A67C00",
  proximity = 80,
  speedTrigger = 80,
  shockRadius = 250,
  shockStrength = 2.5,
  maxSpeed = 5000,
  resistance = 1200,
  returnDuration = 2.1,
  velocityMultiplier = 0.005,
  className = "",
  style,
}: DotGridProps) => {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<any[]>([]);
  const pointerRef = useRef({
    x: 0, y: 0, vx: 0, vy: 0, speed: 0, lastTime: 0, lastX: 0, lastY: 0,
  });
  const wavesRef = useRef<Array<{
    id: number;
    x: number;
    y: number;
    start: number;
    amplitude: number;
    speed: number;
    wavelength: number;
    alpha: number;
    sigma: number;
    duration: number;
    colorGain: number;
  }>>([]);
  const waveId = useRef(0);
  const idleRef = useRef({ lastMove: performance.now(), idle: false });
  const waveTimeout = useRef<NodeJS.Timeout | null>(null);

  const baseColor = theme === "dark" ? darkBaseColor : lightBaseColor;
  const activeColor = theme === "dark" ? darkActiveColor : lightActiveColor;
  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined" || !window.Path2D) return null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const IDLE_AFTER = 3000;
  const WAVE_PERIOD = 10000;
  const WAVE_JITTER = 4000;
  const MAX_CONCURRENT_WAVES = 2;
  const BASE_WAVE = {
    amplitude: 34,
    speed: 700,
    wavelength: 600,
    alpha: 0.0018,
    sigma: 160,
    duration: 7.0,
    colorGain: 1.25
  };

  const markActivity = useCallback(() => {
    idleRef.current.lastMove = performance.now();
    idleRef.current.idle = false;
    if (waveTimeout.current) clearTimeout(waveTimeout.current);
    waveTimeout.current = null;
  }, []);

  const createWave = useCallback((
    x?: number,
    y?: number,
    fromEdge = true,
    overrides?: Partial<typeof BASE_WAVE>
  ) => {
    const wrap = wrapperRef.current;
    if (!wrap || wavesRef.current.length >= MAX_CONCURRENT_WAVES) return;

    const rect = wrap.getBoundingClientRect();
    let originX: number, originY: number;

    if (fromEdge || x === undefined || y === undefined) {
      const edge = Math.floor(Math.random() * 4);
      const offFactor = 0.25 + Math.random() * 0.25;
      switch (edge) {
        case 0: 
          originX = Math.random() * rect.width; 
          originY = -rect.height * offFactor; 
          break;
        case 1: 
          originX = rect.width + rect.width * offFactor; 
          originY = Math.random() * rect.height; 
          break;
        case 2: 
          originX = Math.random() * rect.width; 
          originY = rect.height + rect.height * offFactor; 
          break;
        case 3: 
          originX = -rect.width * offFactor; 
          originY = Math.random() * rect.height; 
          break;
        default: 
          originX = rect.width / 2; 
          originY = rect.height / 2;
      }
    } else {
      originX = x;
      originY = y;
    }

    const wave = {
      id: waveId.current++,
      x: originX,
      y: originY,
      start: performance.now(),
      ...BASE_WAVE,
      ...overrides,
    };
    wavesRef.current.push(wave);
  }, []);

  const spawnRandomOffscreenWave = useCallback(() => {
    createWave(undefined, undefined, true);
  }, [createWave]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;
    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const extraX = width - gridW;
    const extraY = height - gridH;
    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;
    let rafId: number;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      const { x: px, y: py } = pointerRef.current;
      const proxSq = proximity * proximity;

      wavesRef.current = wavesRef.current.filter(w => 
        (now - w.start) / 1000 <= w.duration
      );

      for (const dot of dotsRef.current) {
        let totalDispX = dot.xOffset;
        let totalDispY = dot.yOffset;
        let intensity = 0;

        for (const wave of wavesRef.current) {
          const elapsed = (now - wave.start) / 1000;
          const dx = dot.cx - wave.x;
          const dy = dot.cy - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const frontPos = wave.speed * elapsed;
          const frontDist = dist - frontPos;
          const frontFalloff = Math.exp(-(frontDist * frontDist) / (2 * wave.sigma * wave.sigma));
          const atten = Math.exp(-wave.alpha * dist);
          const phase = 2 * Math.PI * (dist - frontPos) / wave.wavelength;
          const raw = Math.sin(phase);
          const localAmp = wave.amplitude * raw * frontFalloff * atten * (1 - elapsed / wave.duration);

          if (dist > 0) {
            const ux = dx / dist;
            const uy = dy / dist;
            totalDispX += ux * localAmp;
            totalDispY += uy * localAmp;
          }
          intensity += Math.min(1, (Math.abs(localAmp) * wave.colorGain) / Math.max(0.001, wave.amplitude));
        }

        const ox = dot.cx + totalDispX;
        const oy = dot.cy + totalDispY;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;
        let color = baseColor;

        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          color = `rgb(${r}, ${g}, ${b})`;
        }

        intensity = Math.min(1, intensity);
        if (intensity > 0) {
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * intensity);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * intensity);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * intensity);
          color = `rgb(${r}, ${g}, ${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = color;
        ctx.fill(circlePath);
        ctx.restore();
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && "ResizeObserver" in window) {
      ro = new ResizeObserver(buildGrid);
      if (wrapperRef.current) ro.observe(wrapperRef.current);
    } else if (typeof window !== 'undefined') {
      (window as any).addEventListener("resize", buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else if (typeof window !== 'undefined' && (window as any).removeEventListener) {
        (window as any).removeEventListener("resize", buildGrid);
      }
    };
  }, [buildGrid]);

  useEffect(() => {
    const scheduleWave = () => {
      if (waveTimeout.current) return;
      const delay = WAVE_PERIOD + (Math.random() * 2 - 1) * WAVE_JITTER;
      waveTimeout.current = setTimeout(() => {
        if (idleRef.current.idle) spawnRandomOffscreenWave();
        waveTimeout.current = null;
        scheduleWave();
      }, delay);
    };

    const checkIdle = () => {
      const now = performance.now();
      idleRef.current.idle = now - idleRef.current.lastMove > IDLE_AFTER;
      if (idleRef.current.idle && !waveTimeout.current) scheduleWave();
    };

    const idleInterval = setInterval(checkIdle, 1000);
    return () => clearInterval(idleInterval);
  }, [spawnRandomOffscreenWave]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      markActivity();
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

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = (dot.cx - pr.x) + vx * velocityMultiplier;
          const pushY = (dot.cy - pr.y) + vy * velocityMultiplier;
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
                ease: "elastic.out(1, 0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      markActivity();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      createWave(cx, cy, false);
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener("mousemove", throttledMove as EventListener);
    window.addEventListener("click", onClick as EventListener);
    return () => {
      window.removeEventListener("mousemove", throttledMove as EventListener);
      window.removeEventListener("click", onClick as EventListener);
    };
  }, [maxSpeed, speedTrigger, proximity, returnDuration, velocityMultiplier, createWave, markActivity]);

  return (
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
};

export default DotGrid;
