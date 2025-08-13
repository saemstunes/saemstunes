import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onComplete?: () => void;
}

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onComplete
}: SplitTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompleted = useRef(false);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!ref.current || !text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const el = ref.current;
    animationCompleted.current = false;

    // Set position for lines splitType
    if (splitType === "lines") {
      el.style.position = "relative";
    }

    // Create SplitText instance
    const splitter = new GSAPSplitText(el, {
      type: splitType,
      linesClass: "split-line",
    });

    // Determine targets based on split type
    let targets: HTMLElement[];
    switch (splitType) {
      case "lines": targets = splitter.lines; break;
      case "words": targets = splitter.words; break;
      case "chars": targets = splitter.chars; break;
      default: targets = splitter.chars;
    }

    if (!targets || targets.length === 0) return;

    // Prepare elements for animation
    targets.forEach(t => {
      t.style.willChange = "transform, opacity";
      gsap.set(t, { ...from, immediateRender: true });
    });

    // Calculate scroll trigger start position
    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch?.[2] || "px";
    const sign = marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
        once: true,
        onToggle: self => { scrollTriggerInstance.current = self }
      },
      onComplete: () => {
        animationCompleted.current = true;
        gsap.set(targets, { ...to, clearProps: "willChange" });
        onComplete?.();
      }
    });

    tl.set(targets, { ...from, immediateRender: false })
      .to(targets, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000
      });

    return () => {
      tl.kill();
      scrollTriggerInstance.current?.kill();
      splitter.revert();
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin, onComplete]);

  return (
    <p
      ref={ref}
      className={`split-parent font-serif ${className}`}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
      aria-label={text}
    >
      {text}
    </p>
  );
};

export default SplitText;
