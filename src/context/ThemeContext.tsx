
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'gold' | 'teal';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('gold');
  const [highContrast, setHighContrast] = useState(false);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    const savedHighContrast = localStorage.getItem('highContrast');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    if (savedHighContrast) {
      setHighContrast(savedHighContrast === 'true');
    }
  }, []);

  // Update the document with theme class changes
  useEffect(() => {
    // Remove existing theme class
    document.documentElement.classList.remove('theme-gold', 'theme-teal');
    // Add new theme class
    document.documentElement.classList.add(`theme-${theme}`);
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply CSS variables for the selected theme
    const root = document.documentElement;
    if (theme === 'teal') {
      root.style.setProperty('--color-primary', '#036c5f');
      root.style.setProperty('--color-primary-dark', '#025043');
      root.style.setProperty('--color-primary-light', '#81cdc6');
      root.style.setProperty('--color-primary-text', '#008080');
    } else {
      // Gold theme (default)
      root.style.setProperty('--color-primary', 'hsl(36, 77%, 49%)'); // gold
      root.style.setProperty('--color-primary-dark', 'hsl(36, 77%, 39%)'); // gold-dark
      root.style.setProperty('--color-primary-light', 'hsl(36, 77%, 69%)'); // gold-light
      root.style.setProperty('--color-primary-text', 'hsl(36, 77%, 49%)'); // gold
    }
  }, [theme]);

  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', highContrast.toString());
  }, [highContrast]);

  const toggleTheme = () => {
    setTheme(current => current === 'gold' ? 'teal' : 'gold');
  };

  const toggleHighContrast = () => {
    setHighContrast(current => !current);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      highContrast,
      toggleHighContrast
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
