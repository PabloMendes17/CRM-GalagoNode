"use client";

import { createContext,useState, useEffect,useContext } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const ThemeContext = createContext<{ isDarkMode: boolean, toggleDarkMode: (checked: boolean) => void } | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}


export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const savedMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
        setIsDarkMode(savedMode);
        document.body.className = savedMode ? 'dark' : '';
    }, []);

    const toggleDarkMode = (checked: boolean) => {
        setIsDarkMode(checked);
        localStorage.setItem('darkMode', JSON.stringify(checked));
        document.body.className = checked ? 'dark' : '';
      };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {children}
            </main>
            </div>
        </ThemeContext.Provider>    
    );
}
