"use client";
import { useEffect, useState } from 'react';
import styles from '../../styles/blog.module.css'; 

export default function BlogHeader({ title, headline }: { title: string, headline: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            {/* Hamburger menu button for mobile */}
            <button className={styles.menuButton} onClick={() => setIsMenuOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <div className={styles.logo}>
              <a href="/">
                <img src="/favicon.ico" alt="Logo" width={32} height={32} />
              </a>
            </div>

            <div className={`${styles.textInfo} ${isScrolled ? styles.scrolled : ''}`}>
              <h1 className={styles.blogTitle}>{title}</h1>
              <p className={styles.headline}>{headline}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerOverlay} onClick={() => setIsMenuOpen(false)} />
        <nav className={styles.drawerContent}>
          <div className={styles.drawerHeader}>
            <a href="/">
              <img src="/favicon.ico" alt="Logo" width={32} height={32} />
            </a>
            <button onClick={() => setIsMenuOpen(false)}>✕</button>
          </div>
        </nav>
      </div>
    </>
  );
}