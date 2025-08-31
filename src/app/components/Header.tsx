'use client';

import { useEffect, useState } from 'react';
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
            Welcome to <span className="author-name">Hg Q.</span> 👋
          </span>
        </h1>
        <div className="header__actions">
          <a
            href="https://github.com/hgq287/hgq287.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="GitHub"
          >
            <GithubIcon size={24} color="currentColor" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}