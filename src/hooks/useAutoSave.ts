import { useEffect, useRef } from 'react';
import { useStore } from './useStore';

export const useAutoSave = (noteId: string | null, content: string) => {
  const { updateNote, settings } = useStore();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!settings.autoSave || !noteId) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      updateNote(noteId, { content });
    }, 1000); // 1 second delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, noteId, updateNote, settings.autoSave]);
};