import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export const ThemeToggle = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      aria-label="Toggle dark mode"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};
