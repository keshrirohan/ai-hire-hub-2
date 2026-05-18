'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  /** compact = icon-only pill; default = icon + label */
  compact?: boolean;
}

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle-btn"
      data-compact={compact}
    >
      {/* Track */}
      <span className="theme-toggle-track" aria-hidden="true">
        <span className={`theme-toggle-thumb ${isDark ? 'theme-toggle-thumb--dark' : 'theme-toggle-thumb--light'}`}>
          {isDark ? (
            <Moon className="w-3 h-3" strokeWidth={2.5} />
          ) : (
            <Sun className="w-3 h-3" strokeWidth={2.5} />
          )}
        </span>
      </span>
      {!compact && (
        <span className="theme-toggle-label">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
