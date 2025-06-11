
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  format?: 'webp' | 'jpeg' | 'png';
  quality?: number;
  priority?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width = 400,
  height = 400,
  mobileWidth = 300,
  mobileHeight = 300,
  fit = 'cover',
  format = 'webp',
  quality = 80,
  priority = false,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if the image URL already has query parameters
  const hasQueryParams = src.includes('?');
  const separator = hasQueryParams ? '&' : '?';

  // Create desktop image URL with optimization parameters
  const desktopImageUrl = `${src}${separator}w=${width}&h=${height}&fit=${fit}&format=${format}&quality=${quality}`;
  
  // Create mobile image URL with smaller dimensions
  const mobileImageUrl = `${src}${separator}w=${mobileWidth}&h=${mobileHeight}&fit=${fit}&format=${format}&quality=${quality}`;

  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-muted rounded flex items-center justify-center text-muted-foreground",
          className
        )}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <picture className={cn("block", className)}>
      {/* Mobile version */}
      <source 
        media="(max-width: 768px)" 
        srcSet={mobileImageUrl}
      />
      
      {/* Desktop version */}
      <img
        src={desktopImageUrl}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          "w-full h-full object-cover rounded"
        )}
        {...props}
      />
    </picture>
  );
};
