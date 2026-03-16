'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { MobileSidebar } from './MobileSidebar';
import { MobileNavMenu, NAV_ITEMS } from './MobileNavMenu';

const navItems = NAV_ITEMS;

export default function MainHeader({ minimal = false }: { minimal?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const linkClass = (href: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    const base = 'no-underline transition-colors';
    if (minimal) {
      return `${base} text-[15px] font-normal ${isActive ? 'text-black font-medium' : 'text-[#333] hover:text-black hover:underline'}`;
    }
    return `${base} px-3 py-2 rounded-button font-medium ${
      isActive ? 'text-accent-fg bg-accent-fg/10' : 'text-foreground hover:text-accent-fg hover:bg-btn-bg'
    }`;
  };

  return (
    <>
      <header className={`sticky top-0 z-[999] flex items-center ${minimal ? 'header-home bg-white h-16' : 'bg-background/80 backdrop-blur-md border-b border-divider h-14'}`}>
        <div className={minimal ? 'header-home-inner w-full mx-auto flex items-center h-full justify-start' : 'w-full mx-auto flex items-center h-full max-w-container px-5 sm:px-8 justify-between'}>
          {minimal ? null : (
            <h1 className="flex items-center gap-3 min-w-0">
              <a href="/" className="flex items-center gap-3 shrink-0">
                <Image src="/favicon.ico" alt="" className="shrink-0 rounded-sm" width={28} height={28} />
                <div className="flex flex-col min-w-0">
                  <span className="font-serif italic text-base font-medium text-foreground leading-tight">
                    Hg. Q
                  </span>
                  <span className="text-[0.6875rem] text-tag-line font-normal tracking-wide truncate">
                    Built, not just listed
                  </span>
                </div>
              </a>
            </h1>
          )}

          <nav className={`hidden md:flex items-center shrink-0 ${minimal ? 'gap-6 text-[#333]' : 'gap-8'}`} aria-label="Main">
            {navItems.map(({ href, label, external }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              const cls = minimal
                ? 'no-underline text-[15px] font-normal text-[#333] hover:text-black hover:underline'
                : `no-underline text-sm px-3 py-2 rounded-button font-medium ${isActive ? 'text-accent-fg bg-accent-fg/10' : 'text-foreground hover:text-accent-fg hover:bg-btn-bg'}`;
              const style = minimal && isActive ? { fontWeight: 600, color: '#000' } : undefined;
              return external ? (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ) : (
                <Link key={href} href={href} className={cls} style={style} onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className={`flex items-center gap-2 sm:gap-3 ${minimal ? 'header-home-menu-wrap' : ''}`}>
            {!minimal && <ThemeToggle />}
          <button
            type="button"
            data-testid="hamburger-button"
            className={`inline-flex items-center justify-center md:hidden ${minimal ? 'header-home-menu-btn' : ''}`}
            style={{
              width: 36,
              height: 36,
              padding: 0,
              background: 'transparent',
              border: '1px solid #ccc',
              borderRadius: 8,
              cursor: 'pointer',
              color: '#333',
            }}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          </div>
        </div>
      </header>

      {/* Sidebar overlay: dùng chung với blog (MobileNavMenu) */}
      <MobileSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MobileNavMenu
          onLinkClick={() => setMenuOpen(false)}
          showTitle={!minimal}
          showThemeToggle={!minimal}
        />
      </MobileSidebar>
    </>
  );
}
