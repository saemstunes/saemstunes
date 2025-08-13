import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { FolderOpen, Folder as FolderIcon } from "lucide-react";
import "@/components/learning-hub/Folder.css";

interface FolderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  itemCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Folder = ({
  title,
  description,
  icon,
  color,
  itemCount,
  isExpanded,
  onToggle,
  children
}: FolderProps) => {
  const folderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (folderRef.current) {
      gsap.to(folderRef.current, {
        y: isExpanded ? -10 : 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isExpanded]);

  return (
    <div 
      ref={folderRef}
      className="folder-container bg-cream rounded-xl overflow-hidden border border-muted transition-all duration-300 hover:shadow-md"
    >
      <button
        className="w-full p-4 flex items-start text-left"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`folder-content-${title.replace(/\s+/g, '-')}`}
      >
        <div className={`p-3 rounded-lg ${color} mr-3 flex-shrink-0`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-6 w-6 text-white" 
          })}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-brown flex items-center">
            {title}
            <span className="ml-2 text-xs bg-gold/20 text-gold-dark px-2 py-1 rounded-full">
              {itemCount} courses
            </span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        
        <div className="ml-2 flex-shrink-0 text-gold">
          {isExpanded ? 
            <FolderOpen className="h-5 w-5" /> : 
            <FolderIcon className="h-5 w-5" />
          }
        </div>
      </button>
      
      <div
        id={`folder-content-${title.replace(/\s+/g, '-')}`}
        className={`folder-content ${isExpanded ? 'expanded' : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className="p-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Folder;
