import { useEffect, useState } from 'react';

const storageKey = 'trustlens_theme';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(storageKey) === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggleDarkMode: () => setIsDark((value) => !value) };
};
