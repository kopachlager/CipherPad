import { useEffect, useRef } from 'react';
import { useStore } from './useStore';

export const useAutoSave = (noteId: string | null, content: string) => {
  const updateNote = useStore((state) => state.updateNote);
  const autoSaveEnabled = useStore((state) => state.settings.autoSave);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!autoSaveEnabled || !noteId) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      updateNote(noteId, { content });
    }, 2000); // 2 second delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, noteId, updateNote, autoSaveEnabled]);
};
