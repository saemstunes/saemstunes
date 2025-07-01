import React, { useState, useRef, useEffect } from "react";
import { motion, useTransform, useSpring } from "framer-motion";
import { Square } from "lucide-react";
import * as Tone from "tone";

interface ChromaGridProps {
  items?: {
    image: string;
    title: string;
    subtitle: string;
    handle: string;
    borderColor: string;
    gradient: string;
    audioUrl: string;
    duration: string;
    previewUrl: string;
    videoUrl: string;
    youtubeUrl: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundGradient: string;
  }[];
  radius?: number;
  damping?: number;
  stiffness?: number;
}

const ChromaGrid: React.FC<ChromaGridProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }
    };

    init();

    return () => {
      // Cleanup Tone.js resources if necessary
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .chroma-grid-container {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            cursor: grab;
          }
          
          .chroma-grid-container:active {
            cursor: grabbing;
          }
        `
      }} />
      
      <div 
        ref={containerRef} 
        className="chroma-grid-container"
        style={{ height: '100%', width: '100%' }}
      />
    </>
  );
};

export default ChromaGrid;
