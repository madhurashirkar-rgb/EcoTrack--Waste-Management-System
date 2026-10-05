import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ecotrack_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      return saved;
    }
    return 'light';
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const saved = localStorage.getItem('ecotrack_theme');
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      let active = theme;
      if (theme === 'system') {
        active = mediaQuery.matches ? 'dark' : 'light';
      }
      setResolvedTheme(active);
      const root = document.documentElement;
      if (active === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
      localStorage.setItem('ecotrack_theme', theme);
    };

    applyTheme();

    const handler = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const current = prev === 'system' ? resolvedTheme : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      resolvedTheme,
      isDark: resolvedTheme === 'dark',
      toggleTheme,
      setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

