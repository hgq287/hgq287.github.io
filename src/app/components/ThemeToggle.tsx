'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isLight = theme === 'light';

  return (
    <button
      className="theme-toggle-btn"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
    >
      {isLight ? (
        <>
          <MoonIcon size={20} color="#000000" />
          {/* <span style={{paddingLeft: 5}}>Dark</span> */}
        </>
      ) : (
        <>
          <SunIcon size={20} color="#ffffff" />
          {/* <span style={{paddingLeft: 5}}>Light</span> */}
        </>
      )}
    </button>
  );
}