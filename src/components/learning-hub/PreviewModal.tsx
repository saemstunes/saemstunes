import React from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Star, Lock, ArrowUpRight } from "lucide-react";
import "./PreviewModal.css";

interface PreviewModalProps {
  content: any;
  accessStatus: any;
  onClose: () => void;
  onSignup: () => void;
  onUpgrade: () => void;
}

const PreviewModal = ({
  content,
  accessStatus,
  onClose,
  onSignup,
  onUpgrade
}: PreviewModalProps) => {
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

  return (
    <div className="preview-modal-container">
      <div className="preview-modal">
        <div className="preview-modal-header">
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
        
        <div className="preview-modal-content">
          <div className="mb-6">
            {getPreviewContent()}
          </div>
          
          <div className="flex items-center mb-6">
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
        
        <div className="preview-modal-footer">
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
  );
};

export default PreviewModal;
