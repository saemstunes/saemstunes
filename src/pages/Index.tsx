import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { 
  Music, Play, Users, BookOpen, CalendarClock, ArrowRight, 
  Volume2, Star, Award, Clock, TrendingUp, Zap, User, 
  PlayCircle, ChevronLeft, ChevronRight, Heart, Share2,
  Loader2, RefreshCw, Search, Filter, Grid, List
} from "lucide-react";

// Enhanced constants for better maintainability
const ANIMATION_CONFIG = {
  duration: 0.6,
  delay: 0.1,
  spring: { stiffness: 100, damping: 15 },
  hover: { duration: 0.2 }
};

const RESPONSIVE_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};

// Enhanced useMediaQuery hook
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const handler = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);
  
  return matches;
};

// Enhanced responsive hook with debouncing
const useResponsiveLayout = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    ...windowSize,
    isMobile: windowSize.width < RESPONSIVE_BREAKPOINTS.sm,
    isTablet: windowSize.width >= RESPONSIVE_BREAKPOINTS.sm && windowSize.width < RESPONSIVE_BREAKPOINTS.lg,
    isDesktop: windowSize.width >= RESPONSIVE_BREAKPOINTS.lg
  };
};

// Enhanced loading state hook
const useAsyncState = (initialState = null) => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (asyncFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setState(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { state, loading, error, execute, setState };
};

// Enhanced FloatingCard with error boundaries and accessibility
const FloatingCard = ({ 
  children, 
  delay = 0, 
  className = "", 
  onClick,
  loading = false,
  error = null,
  ariaLabel,
  ...props 
}) => {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div
      ref={cardRef}
      className={`
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 
        rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${loading ? 'opacity-50' : ''}
        ${error ? 'border-red-300 dark:border-red-600' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        opacity: isInView ? 1 : 0,
        transition: `all ${ANIMATION_CONFIG.duration}s ease-out ${delay}s`
      }}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl z-10">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      )}
      {error && (
        <div className="absolute top-2 right-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded">
          Error
        </div>
      )}
      {children}
    </div>
  );
};

// Enhanced Button component with better accessibility
const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    primary: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg focus:ring-yellow-500",
    secondary: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg focus:ring-purple-500",
    outline: "border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    default: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-xl"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      {children}
    </button>
  );
};

// Enhanced ContentCard with better interaction states
const ContentCard = ({ 
  title, 
  instructor, 
  duration, 
  difficulty, 
  isPopular, 
  onClick,
  thumbnail,
  progress = 0,
  isBookmarked = false,
  onBookmark,
  onShare
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };
  
  return (
    <FloatingCard 
      className="p-0 overflow-hidden group" 
      onClick={onClick}
      ariaLabel={`${title} by ${instructor}`}
    >
      <div className="relative">
        {isPopular && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Popular
          </div>
        )}
        
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.();
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isBookmarked 
                ? 'bg-red-500 text-white' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Heart className={`h-3 w-3 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
            className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Share content"
          >
            <Share2 className="h-3 w-3" />
          </button>
        </div>
        
        <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
          {thumbnail && !imageError ? (
            <img 
              src={thumbnail} 
              alt={title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          )}
          
          <PlayCircle className="absolute h-10 w-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
          
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
          
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm mb-1 sm:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{instructor}</span>
          </div>
          <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            difficultyColors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {difficulty}
          </span>
        </div>
      </div>
    </FloatingCard>
  );
};

// Enhanced ContentCarousel with virtualization for performance
const ContentCarousel = ({ title, items, onViewAll, loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { isMobile, isTablet } = useResponsiveLayout();
  
  const itemsPerView = useMemo(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4;
  }, [isMobile, isTablet]);
  
  const maxIndex = Math.max(0, items.length - itemsPerView);
  
  const next = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);
  
  const prev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);
  
  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [next, prev]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(itemsPerView).fill(null).map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prev}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
            aria-label="Previous items"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={next}
            disabled={currentIndex === maxIndex}
            className="h-8 w-8 p-0"
            aria-label="Next items"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onViewAll} className="text-xs sm:text-sm">
            View All
          </Button>
        </div>
      </div>
      
      <div 
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex gap-3 sm:gap-4 transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${(items.length / itemsPerView) * 100}%`
          }}
        >
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex-shrink-0"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <ContentCard 
                {...item} 
                onBookmark={() => console.log('Bookmark', item.title)}
                onShare={() => console.log('Share', item.title)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots indicator for mobile */}
      {isMobile && items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array(maxIndex + 1).fill(null).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Stats Counter with better performance
const StatsCounter = ({ number, label, icon, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  const finalNumber = useMemo(() => parseInt(number.replace(/[^\d]/g, '')), [number]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      const increment = finalNumber / 50;
      let current = 0;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
          setCount(finalNumber);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
      
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [finalNumber, delay, isVisible]);
  
  return (
    <div ref={counterRef} className="text-center group">
      <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        {number.includes('+') ? count.toLocaleString() + '+' : 
         number.includes('%') ? count + '%' : 
         count.toLocaleString()}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
};

// Main Dashboard Component
const MusicLearningDashboard = () => {
  const [user] = useState({ name: "Alex", subscribed: true });
  const [timeGreeting, setTimeGreeting] = useState('');
  const [contentFilter, setContentFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile } = useResponsiveLayout();
  
  const { state: popularLessons, loading: popularLoading, execute: loadPopular } = useAsyncState([]);
  const { state: newReleases, loading: newLoading, execute: loadNew } = useAsyncState([]);
  
  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting('Morning');
    else if (hour < 17) setTimeGreeting('Afternoon');
    else setTimeGreeting('Evening');
  }, []);
  
  // Load content data
  useEffect(() => {
    const mockPopularLessons = [
      { 
        title: "Piano Basics: Your First Chord", 
        instructor: "Sarah Johnson", 
        duration: "12:30", 
        difficulty: "Beginner", 
        isPopular: true,
        progress: 65,
        thumbnail: null
      },
      { 
        title: "Guitar Fingerpicking Fundamentals", 
        instructor: "Mike Rodriguez", 
        duration: "18:45", 
        difficulty: "Intermediate", 
        isPopular: true,
        progress: 30,
        thumbnail: null
      },
      { 
        title: "Jazz Piano Improvisation", 
        instructor: "David Chen", 
        duration: "25:15", 
        difficulty: "Advanced", 
        isPopular: false,
        progress: 0,
        thumbnail: null
      },
      { 
        title: "Vocal Warm-up Exercises", 
        instructor: "Emily Davis", 
        duration: "8:20", 
        difficulty: "Beginner", 
        isPopular: false,
        progress: 100,
        thumbnail: null
      },
      { 
        title: "Blues Guitar Techniques", 
        instructor: "Tom Wilson", 
        duration: "22:10", 
        difficulty: "Intermediate", 
        isPopular: true,
        progress: 45,
        thumbnail: null
      }
    ];
    
    const mockNewReleases = [
      { 
        title: "Advanced Drum Patterns", 
        instructor: "Alex Turner", 
        duration: "15:30", 
        difficulty: "Advanced", 
        isPopular: false,
        progress: 0,
        thumbnail: null
      },
      { 
        title: "Classical Guitar Etudes", 
        instructor: "Maria Santos", 
        duration: "28:15", 
        difficulty: "Intermediate", 
        isPopular: false,
        progress: 0,
        thumbnail: null
      },
      { 
        title: "Electronic Music Production", 
        instructor: "DJ Marcus", 
        duration: "42:20", 
        difficulty: "Intermediate", 
        isPopular: true,
        progress: 0,
        thumbnail: null
      }
    ];
    
    // Simulate API calls
    setTimeout(() => {
      loadPopular(async () => mockPopularLessons);
      loadNew(async () => mockNewReleases);
    }, 500);
  }, [loadPopular, loadNew]);
  
  const stats = [
    { number: "2,500+", label: "Active Students", icon: <Users className="h-6 w-6" /> },
    { number: "15", label: "Expert Instructors", icon: <Award className="h-6 w-6" /> },
    { number: "95%", label: "Success Rate", icon: <Star className="h-6 w-6" /> },
    { number: "500+", label: "Video Lessons", icon: <Play className="h-6 w-6" /> }
  ];
  
  const filteredPopularLessons = useMemo(() => {
    if (!popularLessons) return [];
    
    return popularLessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = contentFilter === 'all' || lesson.difficulty.toLowerCase() === contentFilter.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  }, [popularLessons, searchQuery, contentFilter]);

  // Quick Actions data
  const quickActions = useMemo(() => [
    {
      title: "Browse Lessons",
      description: "Explore our library of 500+ lessons",
      icon: <BookOpen className="h-8 w-8" />,
      color: "from-blue-500 to-purple-500",
      action: () => console.log("Browse Lessons")
    },
    {
      title: "Join Community",
      description: "Connect with fellow musicians",
      icon: <Users className="h-8 w-8" />,
      color: "from-green-500 to-teal-500",
      action: () => console.log("Join Community")
    },
    {
      title: "Book Session",
      description: "Schedule 1-on-1 with experts",
      icon: <CalendarClock className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500",
      action: () => console.log("Book Session")
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Good {timeGreeting}, {user.name}!
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ready to continue your musical journey?
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="hidden sm:flex"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <CalendarClock className="h-4 w-4 mr-2" />
                Book Session
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={contentFilter}
                onChange={(e) => setContentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <FloatingCard key={index} className="p-4" delay={index * 0.1}>
              <StatsCounter
                number={stat.number}
                label={stat.label}
                icon={stat.icon}
                delay={index * 0.1}
              />
            </FloatingCard>
          ))}
        </div>
        
        {/* Content Sections */}
        <div className="space-y-12">
          <ContentCarousel
            title="🔥 Trending Lessons"
            items={filteredPopularLessons}
            loading={popularLoading}
            onViewAll={() => console.log('View all popular')}
          />
          
          <ContentCarousel
            title="✨ Just Released"
            items={newReleases || []}
            loading={newLoading}
            onViewAll={() => console.log('View all new')}
          />
        </div>
        
        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <FloatingCard
              key={index}
              className="p-6 text-center group"
              onClick={action.action}
              delay={index * 0.15}
              ariaLabel={action.title}
            >
              <div className={`bg-gradient-to-r ${action.color} p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{action.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{action.description}</p>
              <Button 
                variant="outline"
                className="group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white group-hover:text-gray-900"
              >
                Get Started
              </Button>
            </FloatingCard>
          ))}
        </div>
        
        {/* Featured Instructor Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Instructor</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-2">
              Learn from our world-class music educators
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Sarah Johnson</h3>
                    <p className="text-purple-200">Professional Pianist & Educator</p>
                  </div>
                </div>
                
                <p className="text-purple-100 mb-6">
                  With over 15 years of teaching experience, Sarah specializes in classical piano 
                  and jazz improvisation. Her students have won numerous competitions and scholarships.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Classical Piano', 'Jazz Improv', 'Music Theory', 'Composition'].map((tag, i) => (
                    <span 
                      key={i} 
                      className="bg-white/20 text-white text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Button className="bg-white text-purple-700 hover:bg-gray-100 max-w-xs">
                  View Profile
                </Button>
              </div>
              
              <div className="hidden lg:flex items-center justify-center p-8 relative">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64" />
                <div className="absolute bottom-6 left-6 bg-black/50 text-white px-4 py-2 rounded-full flex items-center">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  <span>Watch Introduction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">MusicMaster</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Elevating musical journeys through expert guidance and innovative learning.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Navigation</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                {['Home', 'Lessons', 'Instructors', 'Pricing', 'Community'].map((item, i) => (
                  <li key={i} className="hover:text-blue-600 cursor-pointer transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Resources</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                {['Blog', 'Tutorials', 'Sheet Music', 'Learning Paths', 'FAQs'].map((item, i) => (
                  <li key={i} className="hover:text-blue-600 cursor-pointer transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Stay Connected</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to our newsletter for updates and tips
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} MusicMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MusicLearningDashboard;
