'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import GithubIcon from './icons/GithubIcon';

export default function Header() {
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
        <h1 className="header__title">
          <Image src="/favicon.ico" alt="Logo" className="logo-icon" width={32} height={32} />
          <span style={{marginLeft: 10}} className="wellcome-text">
            <span className="author-name">Hg Q.</span>
            <br />
            <span style={{marginLeft: 10}} className="tagline">
              Built, not just listed
            </span>
             
          </span>
        </h1>

        <nav className="nav">
          <Link href="/blog" className="nav__link">Blog</Link>
          <Link href="/" className="nav__link">Apps</Link>
          <Link href="/" className="nav__link">Wiki</Link>
        </nav>
        <div className="header__actions">
          <ThemeToggle />
          <a
            href="https://github.com/hgq287/hgq287.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="GitHub"
          >
            <GithubIcon size={24} color="currentColor" />
          </a>
          
        </div>
      </div>
    </header>
  );
}