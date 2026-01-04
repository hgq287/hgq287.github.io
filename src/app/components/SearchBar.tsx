'use client';
import { useState, useEffect } from 'react';
import styles from '../../styles/Header.module.css';

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle Cmd+K shortcut
  useEffect(() => {
    const down = (e: { key: string; metaKey: any; ctrlKey: any; preventDefault: () => void; }) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <button className={styles.searchButton} onClick={() => setIsOpen(true)}>
        <span>Search...</span>
        <span className={styles.kbdShortcut}>⌘ K</span>
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <input type="text" placeholder="Type to search..." autoFocus />
          </div>
        </div>
      )}
    </>
  );
};