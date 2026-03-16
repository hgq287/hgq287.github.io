'use client';

import { useState, useEffect } from 'react'; 
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false); 
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeName = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'Auto';
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-btn-border bg-btn-bg min-w-[72px] h-8 opacity-60">
        <div className="w-3.5 h-3.5 rounded-full bg-foreground/20 animate-pulse" />
        <span className="text-xs font-medium text-text-secondary">Auto</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-btn-border bg-btn-bg min-w-[72px] h-8 text-xs font-medium text-foreground hover:border-accent-fg/30 hover:bg-accent-fg/5 transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onClick={() => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
      }}
      aria-label={`Theme: ${getThemeName()}. Click to cycle.`}
    >
      {theme === 'light' && <Sun size={14} className="text-foreground shrink-0" />}
      {theme === 'dark' && <Moon size={14} className="text-foreground shrink-0" />}
      {theme === 'system' && <Monitor size={14} className="text-foreground shrink-0" />}
      <span className="capitalize">{getThemeName()}</span>
    </button>
  );
};