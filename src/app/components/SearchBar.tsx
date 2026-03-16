'use client';
import { useState, useEffect } from 'react';

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
      <button 
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600" 
        onClick={() => setIsOpen(true)}
      >
        <span>Search...</span>
        <span className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 px-1.5 py-0.5 rounded text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          ⌘ K
        </span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center pt-[100px] z-[1000]" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 p-5 rounded-xl w-[90%] max-w-[500px] h-max shadow-2xl border border-slate-200 dark:border-slate-800" 
            onClick={e => e.stopPropagation()}
          >
            <input 
              type="text" 
              placeholder="Type to search..." 
              autoFocus 
              className="w-full p-2.5 border-none text-lg outline-none bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      )}
    </>
  );
};