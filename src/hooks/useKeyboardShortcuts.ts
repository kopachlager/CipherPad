import { useHotkeys } from 'react-hotkeys-hook';
import { shallow } from 'zustand/shallow';
import { useStore } from './useStore';

export const useKeyboardShortcuts = () => {
  const createNote = useStore((state) => state.createNote);
  const { sidebarOpen, setSidebarOpen } = useStore(
    (state) => ({
      sidebarOpen: state.sidebarOpen,
      setSidebarOpen: state.setSidebarOpen,
    }),
    shallow
  );
  const distractionFreeMode = useStore((state) => state.settings.distractionFreeMode);
  const updateSettings = useStore((state) => state.updateSettings);

  // New note
  useHotkeys('ctrl+n,cmd+n', (e) => {
    e.preventDefault();
    createNote();
  });

  // Toggle sidebar
  useHotkeys('ctrl+b,cmd+b', (e) => {
    e.preventDefault();
    setSidebarOpen(!sidebarOpen);
  });

  // Search
  useHotkeys('ctrl+f,cmd+f', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  // Toggle distraction-free mode
  useHotkeys('ctrl+shift+d,cmd+shift+d', (e) => {
    e.preventDefault();
    updateSettings({ distractionFreeMode: !distractionFreeMode });
  });

  // Save (manual save)
  useHotkeys('ctrl+s,cmd+s', (e) => {
    e.preventDefault();
    // Auto-save is handled elsewhere, this just prevents browser save dialog
  });
};
