import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import './AnimatedList.css';

interface AnimatedItemProps {
children: React.ReactNode;
delay?: number;
index: number;
onMouseEnter: () => void;
onClick: () => void;
}

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }: AnimatedItemProps) => {
const ref = useRef(null);
const inView = useInView(ref, { amount: 0.5, once: false });
return (
<motion.div
ref={ref}
data-index={index}
onMouseEnter={onMouseEnter}
onClick={onClick}
initial={{ scale: 0.7, opacity: 0 }}
animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
transition={{ duration: 0.2, delay }}
style={{ marginBottom: '1rem', cursor: 'pointer' }}
>
{children}
</motion.div>
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
}: AnimatedListProps) => {
const listRef = useRef<HTMLDivElement>(null);
const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
const [keyboardNav, setKeyboardNav] = useState(false);
const [topGradientOpacity, setTopGradientOpacity] = useState(0);
const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

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
<div className={`scroll-list-container ${className}`}>
<div
ref={listRef}
className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`}
onScroll={handleScroll}
>
{items.map((item, index) => (
<AnimatedItem
key={index}
delay={0.1}
index={index}
onMouseEnter={() => setSelectedIndex(index)}
onClick={() => {
setSelectedIndex(index);
if (onItemSelect) {
onItemSelect(item, index);
}
}}
>
<div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`}>
<p className="item-text">{item}</p>
</div>
</AnimatedItem>
))}
</div>
{showGradients && (
<>
<div
className="top-gradient"
style={{ opacity: topGradientOpacity }}
></div>
<div
className="bottom-gradient"
style={{ opacity: bottomGradientOpacity }}
></div>
</>
)}
</div>
);
};

export default AnimatedList;
