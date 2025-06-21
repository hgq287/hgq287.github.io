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
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      style={{
        background: 'transparent',
        border: '1px solid var(--color-primary)',
        color: 'var(--color-primary)',
        borderRadius: '999px',
        padding: '0.4rem 0.8rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {isLight ? (
        <>
          <MoonIcon size={25} color="#000000" />
          {/* <span>Dark</span> */}
        </>
      ) : (
        <>
          <SunIcon size={25} color="#ffffff" />
          {/* <span>Light</span> */}
        </>
      )}
    </button>
  );
}