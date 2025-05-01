import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/global.css'; // src/main.tsx

createRoot(document.getElementById("root")!).render(<App />);
