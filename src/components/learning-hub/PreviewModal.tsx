import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Star, Lock, ArrowUpRight } from "lucide-react";
import DarkVeil from "./DarkVeil";
import "./PreviewModal.css";

interface PreviewModalProps {
  content: any;
  accessStatus: any;
  isVisible: boolean;
  onClose: () => void;
  onSignup: () => void;
  onUpgrade: () => void;
}

const PreviewModal = ({
  content,
  accessStatus,
  isVisible,
  onClose,
  onSignup,
  onUpgrade
}: PreviewModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;
    
    if (isVisible) {
      gsap.fromTo(modalRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(modalRef.current, 
        { opacity: 0, y: 50, duration: 0.3, ease: "power2.in" }
      );
    }
  }, [isVisible]);

  const getPreviewContent = () => {
    if (!content.preview) return null;
    
    switch (content.preview.type) {
      case "video":
        return (
          <div className="preview-video-container">
            <video 
              src={content.preview.url}
              autoPlay
              muted
              controls
              className="w-full h-full object-cover"
            />
            <div className="preview-watermark">SAEM'S TUNES</div>
          </div>
        );
      
      case "audio":
        return (
          <div className="bg-cream rounded-lg p-6 flex items-center">
            <div className="bg-gold/10 p-4 rounded-full mr-4">
              <Play className="h-8 w-8 text-gold" />
            </div>
            <div>
              <h3 className="font-medium">Audio Preview</h3>
              <p className="text-sm text-muted-foreground">
                {content.title} - {content.instructor.name}
              </p>
            </div>
            <audio 
              src={content.preview.url}
              controls
              className="ml-auto"
            />
          </div>
        );
      
      case "text":
        return (
          <div className="bg-cream rounded-lg p-6 max-h-60 overflow-y-auto">
            <h3 className="font-medium mb-2">Preview Content</h3>
            <p className="text-sm whitespace-pre-line">
              {content.preview.content}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <DarkVeil isVisible={isVisible} onClick={onClose} />
      
      <div 
        ref={modalRef}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-brown">
              Preview: {content.title}
            </h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            {getPreviewContent()}
            
            <div className="flex items-center my-6">
              <div className="bg-muted border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
              <div>
                <h3 className="font-medium">{content.instructor.name}</h3>
                <p className="text-sm text-muted-foreground">Instructor</p>
              </div>
            </div>
            
            <p className="text-brown mb-6">{content.description}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-cream rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">Lessons</p>
                <p className="font-medium">{content.lessons}</p>
              </div>
              <div className="bg-cream rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{content.duration} min</p>
              </div>
              <div className="bg-cream rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="font-medium capitalize">{content.level}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-cream border-t">
            {accessStatus.status === "granted" ? (
              <Button 
                className="w-full bg-gold hover:bg-gold-dark text-white"
                onClick={() => {
                  onClose();
                  accessStatus.action();
                }}
              >
                {content.progress > 0 ? "Continue Learning" : "Start Learning"}
                <Play className="ml-2 h-4 w-4" />
              </Button>
            ) : accessStatus.status === "locked" ? (
              <div className="space-y-3">
                <p className="text-center font-medium">
                  Sign up to unlock full course
                </p>
                <Button 
                  className="w-full bg-gold hover:bg-gold-dark text-white"
                  onClick={() => {
                    onClose();
                    onSignup();
                  }}
                >
                  Create Free Account
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  7-day free trial • Cancel anytime
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-center font-medium">
                  Upgrade to PRO for full access
                </p>
                <Button 
                  className="w-full bg-gold hover:bg-gold-dark text-white"
                  onClick={() => {
                    onClose();
                    onUpgrade();
                  }}
                >
                  Unlock Premium Content
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewModal;
