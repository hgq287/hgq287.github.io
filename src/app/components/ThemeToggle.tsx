'use client';

import { useState, useEffect } from 'react'; 
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import styles from '../../styles/Header.module.css';

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
      <div className={styles.themeWrapper}>
        <button className={`${styles.themeButton} ${styles.placeholder}`}>
          <div className={styles.iconSkeleton} />
          <span>Auto</span>
        </button>
      </div>
    );
  }

return (
    <div className={styles.themeWrapper}>
      <button 
        className={styles.themeButton}
        onClick={() => {
          if (theme === 'light') setTheme('dark');
          else if (theme === 'dark') setTheme('system');
          else setTheme('light');
        }}
      >
        {theme === 'light' && <Sun size={15} />}
        {theme === 'dark' && <Moon size={15} />}
        {theme === 'system' && <Monitor size={15} />}
        <span style={{ textTransform: 'capitalize' }}>{getThemeName()}</span>
      </button>
    </div>
  );
};