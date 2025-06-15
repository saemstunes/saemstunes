import { useRef, useState, useEffect } from 'react';

interface AnimatedItemProps {
  children: React.ReactNode;
  delay?: number;
  index: number;
  onMouseEnter: () => void;
  onClick: () => void;
  isVisible: boolean;
}

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick, isVisible }: AnimatedItemProps) => {
  return (
    <div
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`transform transition-all duration-200 cursor-pointer mb-4 ${
        isVisible 
          ? 'scale-100 opacity-100' 
          : 'scale-75 opacity-0'
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

interface AnimatedListProps {
  items?: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
  maxHeight?: string;
}

const AnimatedList = ({
  items = [
    'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5',
    'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10',
    'Item 11', 'Item 12', 'Item 13', 'Item 14', 'Item 15'
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
  maxHeight = '70vh'
}: AnimatedListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  // Intersection Observer for visibility detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleItems(prev => {
          const newSet = new Set(prev);
          entries.forEach(entry => {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            if (entry.isIntersecting) {
              newSet.add(index);
            } else {
              newSet.delete(index);
            }
          });
          return newSet;
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );

    if (listRef.current) {
      const items = listRef.current.querySelectorAll('[data-index]');
      items.forEach(item => observer.observe(item));
    }

    return () => observer.disconnect();
  }, [items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  // Auto-scroll to selected item
  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth',
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-full overflow-hidden ${className}`}
      style={{ 
        maxHeight,
        minHeight: '200px'
      }}
    >
      <div
        ref={listRef}
        className={`h-full overflow-y-auto px-4 py-2 ${
          !displayScrollbar ? 'scrollbar-hide' : ''
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          msOverflowStyle: displayScrollbar ? 'auto' : 'none'
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={Math.min(index * 50, 500)} // Cap delay to prevent long waits
            index={index}
            isVisible={visibleItems.has(index)}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              if (onItemSelect) {
                onItemSelect(item, index);
              }
            }}
          >
            <div 
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedIndex === index 
                  ? 'bg-blue-50 border-blue-300 shadow-md transform scale-105' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              } ${itemClassName}`}
            >
              <p className="text-gray-800 font-medium text-sm md:text-base break-words">
                {item}
              </p>
            </div>
          </AnimatedItem>
        ))}
      </div>
      
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

// Demo component
export default function App() {
  const [selectedItem, setSelectedItem] = useState<string>('');
  
  const sampleItems = [
    'Dashboard Overview',
    'User Management',
    'Analytics & Reports',
    'Settings & Configuration',
    'Billing & Subscriptions',
    'API Documentation',
    'Security Settings',
    'Integration Management',
    'Notification Center',
    'Help & Support',
    'Team Collaboration',
    'Project Templates',
    'File Management',
    'Export Tools',
    'Custom Widgets',
    'Data Visualization',
    'Workflow Automation',
    'Third-party Integrations',
    'Mobile App Settings',
    'Performance Monitoring',
    'Backup & Recovery',
    'User Permissions',
    'Audit Logs',
    'System Health',
    'Advanced Analytics'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Screen-Bounded Animated List
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Navigation Menu
            </h2>
            <AnimatedList
              items={sampleItems}
              onItemSelect={(item, index) => {
                setSelectedItem(`Selected: ${item} (Index: ${index})`);
              }}
              maxHeight="400px"
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selection Info
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  {selectedItem || 'No item selected'}
                </p>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Navigation:</strong> Use arrow keys or Tab/Shift+Tab</p>
                <p><strong>Selection:</strong> Press Enter or click</p>
                <p><strong>Features:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Responsive design that stays within screen bounds</li>
                  <li>Smooth scroll animations</li>
                  <li>Intersection Observer for performance</li>
                  <li>Keyboard navigation support</li>
                  <li>Gradient overlays for scroll indication</li>
                  <li>Configurable maximum height</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
