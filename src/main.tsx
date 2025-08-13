// src/main.tsx
import './styles/global.css';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import and register GSAP plugins globally
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(SplitText);

// Set GSAP global defaults
gsap.defaults({
  ease: "power3.out",
  duration: 0.5
});

createRoot(document.getElementById("root")!).render(<App />);
