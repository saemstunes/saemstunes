import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Star, Lock, ArrowUpRight } from "lucide-react";
import "./PreviewModal.css";

interface Instructor {
  id?: string;
  name: string;
  avatar?: string;
}

interface Preview {
  mediaUrl?: string;
  mediaType?: string;
  duration?: number;
  poster?: string;
  chapters?: { time: number; title: string }[];
  transcript?: string;
}

interface PreviewModalProps {
  content: {
    id?: string;
    title?: string;
    description?: string;
    instructor?: Instructor;
    lessons?: number;
    duration?: number;
    level?: string;
    progress?: number;
    preview?: Preview;
    valueProps?: string[];
    socialProof?: {
      studentCount?: number;
      rating?: number;
      testimonials?: any[];
    };
    accessStatus?: {
      status: 'locked' | 'upgrade_required' | 'granted';
      action?: () => void;
      messaging?: {
        primary?: string;
        secondary?: string;
        cta?: string;
      };
    };
  };
  onClose: () => void;
  onSignup: () => void;
  onUpgrade: () => void;
}

const PreviewModal = ({
  content,
  onClose,
  onSignup,
  onUpgrade
}: PreviewModalProps) => {
  const [accessStatus, setAccessStatus] = useState({
    status: 'locked' as 'locked' | 'upgrade_required' | 'granted'
  });
  const [countdown, setCountdown] = useState("23:45:12");
  
  useEffect(() => {
    // Safely handle accessStatus from content
    if (content?.accessStatus?.status) {
      setAccessStatus(content.accessStatus);
    }
  }, [content]);

  const getPreviewContent = () => {
    if (!content?.preview) return null;
    
    switch (content.preview.mediaType) {
      case "video":
        return (
          <div className="preview-video-container">
            <video 
              src={content.preview.mediaUrl}
              autoPlay
              muted
              controls
              className="w-full h-full object-cover"
              poster={content.preview.poster}
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
                {content.title} - {content.instructor?.name || "Instructor"}
              </p>
            </div>
            <audio 
              src={content.preview.mediaUrl}
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
              {content.preview.transcript || "Preview content not available"}
            </p>
          </div>
        );
      
      default:
        return (
          <div className="bg-cream rounded-lg p-6 flex items-center justify-center h-40">
            <p className="text-muted-foreground">Preview not available</p>
          </div>
        );
    }
  };

  // Countdown timer effect for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        const [hours, minutes, seconds] = prev.split(":").map(Number);
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes = minutes - 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours = hours - 1;
        }
        
        if (newHours < 0) return "00:00:00";
        
        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="preview-modal-container">
      <div className="preview-modal">
        <div className="preview-modal-header">
          <h2 className="text-xl font-bold text-brown">
            Preview: {content?.title || "Course Preview"}
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
              <h3 className="font-medium">{content?.instructor?.name || "Expert Instructor"}</h3>
              <p className="text-sm text-muted-foreground">Instructor</p>
            </div>
          </div>
          
          <p className="text-brown mb-6">
            {content?.description || "Unlock your musical potential with this comprehensive course"}
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-cream rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">Lessons</p>
              <p className="font-medium">{content?.lessons || "0"}</p>
            </div>
            <div className="bg-cream rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{content?.duration || "0"} min</p>
            </div>
            <div className="bg-cream rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="font-medium capitalize">{content?.level || "All levels"}</p>
            </div>
          </div>
          
          {/* Value Proposition Section */}
          {content?.valueProps && content.valueProps.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">What You'll Learn</h3>
              <ul className="space-y-2">
                {content.valueProps.map((prop, index) => (
                  <li key={index} className="flex items-start">
                    <Star className="h-4 w-4 text-gold mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{prop}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Social Proof Section */}
          {content?.socialProof && (
            <div className="bg-cream/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm">
                  <span className="font-medium">
                    {content.socialProof.studentCount?.toLocaleString() || "2,500+"} 
                  </span> learners
                </p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-gold fill-current mr-1" />
                  <span className="font-medium">
                    {content.socialProof.rating || "4.8"}
                  </span>
                  <span className="text-muted-foreground">/5</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                "This course transformed my understanding of vocal techniques"
              </p>
            </div>
          )}
          
          {/* Urgency Indicator */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-center">
            <Lock className="h-4 w-4 text-red-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Limited time offer expires in: {countdown}
              </p>
              <p className="text-xs text-red-600">
                Enrollment closes soon! Only 12 spots left
              </p>
            </div>
          </div>
        </div>
        
        <div className="preview-modal-footer">
          {accessStatus.status === "granted" ? (
            <Button 
              className="w-full bg-gold hover:bg-gold-dark text-white"
              onClick={onClose}
            >
              {content?.progress && content.progress > 0 
                ? "Continue Learning" 
                : "Start Learning"}
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
              <div className="bg-gold/10 rounded-lg p-3">
                <p className="text-xs text-center text-gold-dark">
                  Includes 1:1 coaching session and certificate
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
