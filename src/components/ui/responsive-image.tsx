
import { cn } from "@/lib/utils";

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  mobileWidth?: number;
  mobileHeight?: number;
  className?: string;
  priority?: boolean;
}

export const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
  mobileWidth,
  mobileHeight,
  className,
  priority = false,
}: ResponsiveImageProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image: ${src}`);
    e.currentTarget.style.display = 'none';
  };

  return (
    <picture className={cn("block", className)}>
      {mobileWidth && mobileHeight && (
        <source
          media="(max-width: 768px)"
          srcSet={src}
          width={mobileWidth}
          height={mobileHeight}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        fetchPriority={priority ? "high" : "low"}
        loading={priority ? "eager" : "lazy"}
        onError={handleImageError}
        className="w-full h-auto" // Fixed: removed rounded-full
      />
    </picture>
  );
};
