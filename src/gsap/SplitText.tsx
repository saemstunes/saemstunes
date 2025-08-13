import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(GSAPSplitText);

interface SplitTextProps {
  text: string;
  className?: string;
  duration?: number;
  stagger?: number;
  delay?: number;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  ease?: string;
}

const SplitText = ({
  text,
  className = "",
  duration = 0.8,
  stagger = 0.03,
  delay = 0,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  ease = "power3.out"
}: SplitTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!ref.current || animated.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const element = ref.current;
    const split = new GSAPSplitText(element, { 
      type: "chars", 
      charsClass: "char-anim" 
    });

    gsap.set(split.chars, from);
    
    gsap.to(split.chars, {
      ...to,
      duration,
      ease,
      stagger,
      delay,
      onComplete: () => {
        gsap.set(split.chars, { clearProps: "opacity,transform" });
      }
    });

    animated.current = true;

    return () => {
      split.revert();
    };
  }, [text, duration, stagger, delay, from, to, ease]);

  return (
    <p 
      ref={ref}
      className={`split-parent font-serif font-bold text-gold ${className}`}
      aria-label={text}
    >
      {text}
    </p>
  );
};

export default SplitText;
