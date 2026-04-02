/**
 * DarkModeToggle Component
 *
 * Toggle button for switching between light and dark themes.
 * Persists the preference in localStorage and respects the
 * system's prefers-color-scheme media query as the default.
 */

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  /* Apply or remove the dark class on the document root */
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200"
      aria-label="Toggle dark mode"
    >
      {dark ? <FiSun className="w-5 h-5 text-gold-500" /> : <FiMoon className="w-5 h-5" />}
    </button>
  );
}
