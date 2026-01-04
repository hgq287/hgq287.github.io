'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';

import { SearchBar } from './SearchBar';
import { SocialLinks } from './SocialLinks';

export default function MainHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`header ${scrolled ? 'header--scrolled' : ''}`}
    >
      <div className="header__content">
        <h1 className="header__title" style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/">
            <Image src="/favicon.ico" alt="Logo" className="logo-icon" width={32} height={32} />
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
            <span className="author-name">
              Hg. Q
            </span>
            <span className="tagline">
              Built, not just listed
            </span>
          </div>
        </h1>

        <nav className="nav">
          <Link href="/blog" className="nav__link">Blog</Link>
          <Link href="/" className="nav__link">Wiki</Link>
        </nav>
        <div className="header__actions">
          <SearchBar />
          <div className="separator" />
          <SocialLinks />
          <div className="separator" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}