'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ANIMATION_MS = 280;

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Sidebar overlay: positioned on top of the page, blurred backdrop, slide animation, height fits content, Close menu button.
 */
export function MobileSidebar({ isOpen, onClose, children }: MobileSidebarProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
      setIsEntering(false);
    }, ANIMATION_MS);
  };

  useEffect(() => {
    if (!isOpen) return;
    setIsEntering(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsEntering(true));
    });
    return () => cancelAnimationFrame(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const backdropOpacity = isExiting ? 0 : isEntering ? 0.4 : 0;
  const sidebarTranslateX = isExiting ? '-100%' : isEntering ? '0' : '-100%';

  return createPortal(
    <div
      data-testid="mobile-menu-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        display: 'block',
        pointerEvents: 'auto',
      }}
    >
      {/* Backdrop with fade */}
      <div
        data-testid="mobile-menu-backdrop"
        aria-hidden
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          opacity: backdropOpacity,
          transition: `opacity ${ANIMATION_MS}ms ease-out`,
        }}
      />
      {/* Sidebar: height = screen (100vh), toggle close on the left, menu content below */}
      <aside
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 'min(280px, 85vw)',
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          transform: `translateX(${sidebarTranslateX})`,
          transition: `transform ${ANIMATION_MS}ms ease-out`,
        }}
      >
        {/* Toggle close - X icon, rounded wrapper, color matches text */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            data-testid="sidebar-close-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              padding: 0,
              background: 'transparent',
              border: '1px solid #ccc',
              borderRadius: 8,
              cursor: 'pointer',
              color: '#333',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Divider line: separates toggle close and menu content */}
        <div
          role="presentation"
          style={{
            flexShrink: 0,
            height: 1,
            backgroundColor: '#e5e5e5',
            margin: '0 -0.25rem',
          }}
        />
        {/* Menu content positioned below */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {children}
        </div>
      </aside>
    </div>,
    document.body
  );
}
