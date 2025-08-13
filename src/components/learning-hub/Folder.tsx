import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import "./Folder.css";

interface FolderProps {
  title: string;
  color?: string;
  size?: number;
  className?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  itemCount?: number;
}

const Folder = ({
  title,
  color = "#5227FF",
  size = 1,
  className = "",
  children,
  isOpen = false,
  onToggle,
  itemCount = 0
}: FolderProps) => {
  const folderRef = useRef<HTMLDivElement>(null);
  const [paperOffsets, setPaperOffsets] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);

  // Calculate colors
  const darken = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return `#${(
      0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1)}`;
  };

  const folderBackColor = darken(color, 10);
  const paper1 = "#f0f0f0";
  const paper2 = "#f8f8f8";
  const paper3 = "#ffffff";

  const handlePaperMouseMove = (
    e: React.MouseEvent,
    index: number
  ) => {
    if (!folderRef.current || !isOpen) return;
    
    const rect = folderRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.1;
    const offsetY = (e.clientY - centerY) * 0.1;
    
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  return (
    <div 
      className={`folder-container ${className}`}
      style={{ transform: `scale(${size})` }}
      ref={folderRef}
    >
      <div 
        className={`folder ${isOpen ? "open" : ""}`}
        style={{
          "--folder-color": color,
          "--folder-back-color": folderBackColor,
          "--paper-1": paper1,
          "--paper-2": paper2,
          "--paper-3": paper3,
        } as React.CSSProperties}
        onClick={onToggle}
        aria-expanded={isOpen}
        role="button"
      >
        <div className="folder__back">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`paper paper-${i + 1}`}
              onMouseMove={(e) => handlePaperMouseMove(e, i)}
              onMouseLeave={() => handlePaperMouseLeave(i)}
              style={{
                transform: isOpen 
                  ? `translate(calc(-50% + ${paperOffsets[i].x}px), calc(-50% + ${paperOffsets[i].y}px))` 
                  : "translate(-50%, 10%)"
              }}
            >
              {i === 2 && children}
            </div>
          ))}
          <div className="folder__front"></div>
          <div className="folder__front right"></div>
        </div>
      </div>
      {title && (
        <div className="folder-title">
          {title}
          {itemCount > 0 && (
            <span className="ml-2 text-xs bg-gold/20 text-gold-dark px-2 py-1 rounded-full">
              {itemCount} courses
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Folder;
