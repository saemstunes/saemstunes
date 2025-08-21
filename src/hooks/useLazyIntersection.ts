// src/hooks/useLazyIntersection.ts
import { useState, useEffect, useRef } from 'react';

interface UseLazyIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useLazyIntersection = (options: UseLazyIntersectionOptions = {}) => {
  const { threshold = 0.1, rootMargin = '150px' } = options;
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { elementRef, shouldLoad };
};
