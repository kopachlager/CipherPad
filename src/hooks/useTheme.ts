import { useEffect } from 'react';
import { useStore } from './useStore';

export const useTheme = () => {
  const { settings, updateSettings } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const computeIsDark = () => settings.theme === 'dark' || (settings.theme === 'system' && mql.matches);
    const isDark = computeIsDark();

    root.classList.toggle('dark', isDark);
    
    // Set accent color
    root.style.setProperty('--accent-color', settings.accentColor);
    
    // Apply accent color to various UI elements
    root.style.setProperty('--color-primary', settings.accentColor);
    root.style.setProperty('--color-primary-hover', adjustColorBrightness(settings.accentColor, -10));
    root.style.setProperty('--color-primary-light', adjustColorBrightness(settings.accentColor, 40));
    
    // Set font settings
    root.style.setProperty('--font-size', `${settings.fontSize}px`);
    root.style.setProperty('--line-height', settings.lineHeight.toString());
    root.style.setProperty('--font-family', settings.fontFamily);

    const handleChange = () => {
      if (settings.theme === 'system') {
        const nextDark = computeIsDark();
        root.classList.toggle('dark', nextDark);
      }
    };
    mql.addEventListener?.('change', handleChange);
    return () => mql.removeEventListener?.('change', handleChange);
  }, [settings.theme, settings.accentColor, settings.fontSize, settings.lineHeight, settings.fontFamily]);

  // Helper function to adjust color brightness
  const adjustColorBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  return { theme: settings.theme, toggleTheme };
};
