import { useRef, useEffect, useState } from "react";
import { Play, ExternalLink, Clock, Heart } from "lucide-react";

interface ChromaGridItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  location?: string;
  audioUrl?: string;
  duration?: string;
  youtubeUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundGradient?: string;
}

interface ChromaGridProps {
  items?: ChromaGridItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

export const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const demo: ChromaGridItem[] = [
    {
      image: "https://i.pravatar.cc/300?img=8",
      title: "Alex Rivera",
      subtitle: "Full Stack Developer",
      handle: "@alexrivera",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg, #4F46E5, #000)",
      url: "https://github.com/",
      duration: "3:45",
      audioUrl: "https://example.com/track1.mp3",
    },
    {
      image: "https://i.pravatar.cc/300?img=11",
      title: "Jordan Chen",
      subtitle: "DevOps Engineer",
      handle: "@jordanchen",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg, #10B981, #000)",
      url: "https://linkedin.com/in/",
      duration: "4:12",
      audioUrl: "https://example.com/track2.mp3",
    },
    {
      image: "https://i.pravatar.cc/300?img=3",
      title: "Morgan Blake",
      subtitle: "UI/UX Designer",
      handle: "@morganblake",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg, #F59E0B, #000)",
      url: "https://dribbble.com/",
      duration: "2:58",
      audioUrl: "https://example.com/track3.mp3",
    },
    {
      image: "https://i.pravatar.cc/300?img=16",
      title: "Casey Park",
      subtitle: "Data Scientist",
      handle: "@caseypark",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg, #EF4444, #000)",
      url: "https://kaggle.com/",
      duration: "3:21",
      audioUrl: "https://example.com/track4.mp3",
    },
    {
      image: "https://i.pravatar.cc/300?img=25",
      title: "Sam Kim",
      subtitle: "Mobile Developer",
      handle: "@thesamkim",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(225deg, #8B5CF6, #000)",
      url: "https://github.com/",
      duration: "4:05",
      audioUrl: "https://example.com/track5.mp3",
    },
    {
      image: "https://i.pravatar.cc/300?img=60",
      title: "Tyler Rodriguez",
      subtitle: "Cloud Architect",
      handle: "@tylerrod",
      borderColor: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4, #000)",
      url: "https://aws.amazon.com/",
      duration: "3:33",
      audioUrl: "https://example.com/track6.mp3",
    },
  ];
  
  const data = items?.length ? items : demo;

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid-enhanced ${className}`}
      style={{
        "--r": `${radius}px`,
      } as React.CSSProperties}
    >
      {/* Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {data.map((item, i) => (
          <article
            key={i}
            className="chroma-card-enhanced group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            onMouseMove={handleCardMove}
            onMouseEnter={() => setHoveredItem(i)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => handleCardClick(item.url)}
            style={{
              "--card-border": item.borderColor || "transparent",
              "--card-gradient": item.gradient,
              background: item.gradient || "linear-gradient(145deg, #333, #000)",
            } as React.CSSProperties}
          >
            {/* Image Container */}
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover Overlay for Desktop */}
              <div className={`absolute inset-0 bg-black/70 transition-opacity duration-300 flex items-center justify-center ${
                isMobile ? 'opacity-0' : hoveredItem === i ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex gap-3">
                  {item.audioUrl && (
                    <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </button>
                  )}
                  {item.url && (
                    <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
                      <ExternalLink className="h-6 w-6 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Duration Badge */}
              {item.duration && (
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.duration}
                </div>
              )}
            </div>

            {/* Details Section - Always visible on mobile, hover on desktop */}
            <div className={`p-4 transition-all duration-300 ${
              isMobile 
                ? 'opacity-100 translate-y-0' 
                : hoveredItem === i 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-60 translate-y-2'
            }`}>
              <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">
                {item.title}
              </h3>
              
              <p className="text-white/80 text-sm mb-2 line-clamp-1">
                {item.subtitle}
              </p>
              
              {item.handle && (
                <p className="text-white/60 text-xs mb-3">
                  {item.handle}
                </p>
              )}

              {/* Action Buttons for Mobile */}
              {isMobile && (
                <div className="flex gap-2 mt-3">
                  {item.audioUrl && (
                    <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg py-2 px-3 text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                      <Play className="h-4 w-4" />
                      Play
                    </button>
                  )}
                  {item.url && (
                    <button className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-white/30 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Desktop Hover Details */}
              {!isMobile && hoveredItem === i && (
                <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {item.location && (
                    <p className="text-white/60 text-xs">
                      📍 {item.location}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-white/60 text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {Math.floor(Math.random() * 1000)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {Math.floor(Math.random() * 10000)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Card Border Effect */}
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `linear-gradient(45deg, transparent 30%, ${item.borderColor || '#fff'} 50%, transparent 70%)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'subtract',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'subtract',
                padding: '2px',
              }}
            />
          </article>
        ))}
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: animate-in 0.2s ease-out;
        }
        
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .slide-in-from-bottom-2 {
          animation: slideInFromBottom 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInFromBottom {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChromaGrid;
