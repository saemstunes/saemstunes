import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  onClick?: () => void;
}

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "300px",
  imageHeight = "100%",
  imageWidth = "100%",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  onClick,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [resolvedImageSrc, setResolvedImageSrc] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const resolveImage = async () => {
      try {
        if (imageSrc.startsWith('http')) {
          setResolvedImageSrc(imageSrc);
        } else {
          const { data } = supabase.storage.from('tracks').getPublicUrl(imageSrc);
          setResolvedImageSrc(data.publicUrl);
        }
      } catch (error) {
        setResolvedImageSrc('/default-cover.jpg');
      }
    };
    resolveImage();
  }, [imageSrc]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });
  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current || isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    
    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    
    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    if (isMobile) return;
    setIsHovered(true);
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    if (isMobile) return;
    setIsHovered(false);
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  const handleTouch = () => {
    if (!isMobile || !displayOverlayContent || !overlayContent) return;
    setIsHovered(prev => !prev);
  };

  // Mobile placeholder component
  if (isMobile) {
    return (
      <div 
        className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
        onClick={onClick}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-muted-foreground">Loading image...</div>
          </div>
        )}
        <img
          src={resolvedImageSrc}
          alt={altText}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = '/default-cover.jpg';
            setImageLoaded(true);
          }}
        />
        {displayOverlayContent && overlayContent && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            {overlayContent}
          </div>
        )}
        {showMobileWarning && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
            Tap for details
          </div>
        )}
      </div>
    );
  }

  // Desktop TiltedCard component
  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className="tilted-card-inner"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <div 
          className="tilted-card-image-container"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            borderRadius: "15px",
          }}
        >
          {!imageLoaded && (
            <div 
              className="tilted-card-loading"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "hsl(var(--muted))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "hsl(var(--muted-foreground))",
                fontSize: "0.875rem",
              }}
            >
              Loading image...
            </div>
          )}
          
          {resolvedImageSrc && (
            <motion.img
              src={resolvedImageSrc}
              alt={altText}
              className="tilted-card-img"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.5s ease",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = '/default-cover.jpg';
                setImageLoaded(true);
              }}
            />
          )}
        </div>
        
        {displayOverlayContent && overlayContent && (
          <motion.div
            className="tilted-card-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              borderRadius: "15px",
              pointerEvents: "none",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
      
      {showTooltip && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
