import { useEffect } from 'react';
import { useStore } from './useStore';

export const useTheme = () => {
  const { settings, updateSettings } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    const isDark = 
      settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
    
    // Set accent color
    root.style.setProperty('--accent-color', settings.accentColor);
    
    // Set font settings
    root.style.setProperty('--font-size', `${settings.fontSize}px`);
    root.style.setProperty('--line-height', settings.lineHeight.toString());
  }, [settings.theme, settings.accentColor, settings.fontSize, settings.lineHeight]);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  return { theme: settings.theme, toggleTheme };
};