'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

/** Shared for overlay menu and desktop nav (MainHeader, BlogHeader). */
export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: 'https://github.com/hgq287/hgq287.github.io#readme', label: 'Systems', external: true },
];

export interface MobileNavMenuProps {
  onLinkClick?: () => void;
  showTitle?: boolean;
  showThemeToggle?: boolean;
}

/**
 * Content of the overlay menu (hamburger): shared for home and blog.
 */
export function MobileNavMenu({ onLinkClick, showTitle = true, showThemeToggle = false }: MobileNavMenuProps) {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return `no-underline text-[15px] font-normal transition-colors ${
      isActive ? 'text-black font-medium' : 'text-[#333] hover:text-black hover:underline'
    }`;
  };

  return (
    <>
      {showTitle && (
        <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#000' }}>Menu</span>
      )}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} aria-label="Mobile menu">
        {NAV_ITEMS.map(({ href, label, external }) => (
          <span key={href} className="block py-2">
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass(href)}
                onClick={onLinkClick}
              >
                {label}
              </a>
            ) : (
              <Link href={href} className={linkClass(href)} onClick={onLinkClick}>
                {label}
              </Link>
            )}
          </span>
        ))}
      </nav>
      {showThemeToggle && (
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
          <ThemeToggle />
        </div>
      )}
    </>
  );
}
