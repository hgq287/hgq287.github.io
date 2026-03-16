'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileSidebar } from './MobileSidebar';
import { MobileNavMenu, NAV_ITEMS } from './MobileNavMenu';

const navItems = NAV_ITEMS;

export default function BlogHeader({ title, headline }: { title: string; headline: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <>
      {/* Đồng nhất với header home: cùng bar, container, nav trái, hamburger style */}
      <header className="blog-header-bar header-home bg-white h-16 sticky top-0 z-[999] flex items-center border-none">
        <div className="blog-header-inner header-home-inner w-full mx-auto flex items-center h-full justify-start">
          <nav className="hidden md:flex items-center shrink-0 gap-6" aria-label="Main">
            {navItems.map(({ href, label, external }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              const style = isActive ? { fontWeight: 600, color: '#000' } : undefined;
              return external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline text-[15px] font-normal text-[#333] hover:text-black hover:underline"
                  style={style}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="no-underline text-[15px] font-normal text-[#333] hover:text-black hover:underline"
                  style={style}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 header-home-menu-wrap">
            <button
              type="button"
              data-testid="hamburger-button"
              className="inline-flex items-center justify-center md:hidden header-home-menu-btn"
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

      {/* Sidebar overlay: dùng chung với home (MobileNavMenu), ẩn chữ \"Menu\" cho đồng nhất */}
      <MobileSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MobileNavMenu
          onLinkClick={() => setMenuOpen(false)}
          showTitle={false}
          showThemeToggle={false}
        />
      </MobileSidebar>
    </>
  );
}
