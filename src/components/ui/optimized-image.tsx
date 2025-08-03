
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string;
  blurDataURL?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  webpSrc,
  blurDataURL,
  priority = false,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: isLoaded ? 'none' : 'blur(5px)',
        transition: 'filter 0.3s ease-in-out'
      }}
    >
      {isInView && (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover"
            {...props}
          />
        </picture>
      )}
    </div>
  );
};
