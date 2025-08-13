import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import "./CircularText.css";

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: "speedUp" | "slowDown" | "pause" | "goBonkers" | "none";
  className?: string;
  size?: number;
}

const CircularText = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
  size = 200
}: CircularTextProps) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const animate = async () => {
      await controls.start({
        rotate: rotation + 360,
        transition: {
          ease: "linear",
          duration: spinDuration,
          repeat: Infinity
        }
      });
    };
    animate();
  }, [controls, rotation, spinDuration]);

  const handleHoverStart = () => {
    if (onHover === "none") return;
    
    let duration = spinDuration;
    switch (onHover) {
      case "speedUp": duration = spinDuration / 4; break;
      case "slowDown": duration = spinDuration * 2; break;
      case "goBonkers": duration = spinDuration / 20; break;
    }

    controls.stop();
    controls.start({
      rotate: rotation + 360,
      transition: {
        ease: "linear",
        duration,
        repeat: Infinity
      }
    });
  };

  const handleHoverEnd = () => {
    if (onHover === "none") return;
    
    controls.stop();
    setRotation(controls.getState().rotate);
    controls.start({
      rotate: rotation + 360,
      transition: {
        ease: "linear",
        duration: spinDuration,
        repeat: Infinity
      }
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ width: size, height: size }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onTouchStart={handleHoverStart}
      onTouchEnd={handleHoverEnd}
      aria-label={text}
    >
      {letters.map((letter, i) => {
        const angle = (360 / letters.length) * i;
        const radian = (angle * Math.PI) / 180;
        const radius = size / 2.5;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        return (
          <motion.span
            key={i}
            className="circular-letter"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
              transformOrigin: "center center"
            }}
            whileHover={{ scale: 1.2 }}
          >
            {letter}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
