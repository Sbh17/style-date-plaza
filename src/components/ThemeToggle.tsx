
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, SunMoon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'pill' | 'icon';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'default',
  className
}) => {
  const { theme, toggleTheme } = useTheme();
  
  if (variant === 'pill') {
    return (
      <div 
        className={cn(
          "flex items-center gap-1 p-1 rounded-full border transition-colors cursor-pointer", 
          theme === 'dark' 
            ? "bg-secondary border-secondary" 
            : "bg-white border-border",
          className
        )}
        onClick={toggleTheme}
        role="button"
        aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span 
          className={cn(
            "flex items-center justify-center p-1.5 rounded-full transition-all",
            theme === 'dark' 
              ? "translate-x-[calc(100%+2px)] bg-slate-700 text-white" 
              : "bg-primary/10 text-primary"
          )}
        >
          {theme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </span>
        <span className="w-4" aria-hidden="true" /> {/* Spacer */}
      </div>
    );
  }
  
  if (variant === 'icon') {
    return (
      <button
        className={cn(
          "p-2 rounded-full transition-colors",
          theme === 'dark' 
            ? "hover:bg-white/10" 
            : "hover:bg-primary/10",
          className
        )}
        onClick={toggleTheme}
        aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
      </button>
    );
  }
  
  // Default variant
  return (
    <button
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg transition-colors",
        theme === 'dark' 
          ? "bg-slate-800 hover:bg-slate-700 text-white" 
          : "bg-primary/5 hover:bg-primary/10 text-primary",
        className
      )}
      onClick={toggleTheme}
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <SunMoon className="h-4 w-4" />
      <span className="text-sm font-medium">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
