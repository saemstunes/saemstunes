// src/gsap/SplitText.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

// Type definition for GSAP SplitText options
type SplitTextOptions = {
  type?: string;
  charsClass?: string;
  linesClass?: string;
  wordsClass?: string;
};

interface SplitTextProps {
  text: string;
  className?: string;
  duration?: number;
  stagger?: number;
  delay?: number;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  ease?: string;
  splitOptions?: SplitTextOptions;
}

const SplitText = ({
  text,
  className = "",
  duration = 0.8,
  stagger = 0.03,
  delay = 0,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  ease = "power3.out",
  splitOptions = { type: "chars", charsClass: "char-anim" }
}: SplitTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animated = useRef(false);
  const splitInstance = useRef<GSAPSplitText | null>(null);

  useEffect(() => {
    if (!ref.current || animated.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const element = ref.current;
    
    // Create SplitText instance
    splitInstance.current = new GSAPSplitText(element, splitOptions as any);
    
    // Get targets based on split type
    const targets = getSplitTargets(splitInstance.current, splitOptions.type || "chars");
    
    if (!targets || targets.length === 0) {
      console.warn("No valid targets for SplitText animation");
      return;
    }

    gsap.set(targets, from);
    
    const animation = gsap.to(targets, {
      ...to,
      duration,
      ease,
      stagger,
      delay,
      onComplete: () => {
        gsap.set(targets, { clearProps: "opacity,transform,willChange" });
      }
    });

    animated.current = true;

    return () => {
      animation.kill();
      if (splitInstance.current?.revert) {
        splitInstance.current.revert();
      }
    };
  }, [text, duration, stagger, delay, from, to, ease, splitOptions]);

  // Helper function to get proper targets
  const getSplitTargets = (split: GSAPSplitText, type: string) => {
    switch (type) {
      case "chars": return split.chars;
      case "words": return split.words;
      case "lines": return split.lines;
      default: return split.chars;
    }
  };

  return (
    <p 
      ref={ref}
      className={`split-text-wrapper ${className}`}
      aria-label={text}
    >
      {text}
    </p>
  );
};

export default SplitText;
