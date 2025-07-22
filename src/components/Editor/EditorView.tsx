import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MonacoEditor from './MonacoEditor';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import { useStore } from '../../hooks/useStore';
import { detectLanguage } from '../../utils/helpers';

const EditorView: React.FC = () => {
  const { 
    notes, 
    activeNoteId, 
    updateNote, 
    toggleNoteFavorite,
    settings 
  } = useStore();

  const activeNote = notes.find((note) => note.id === activeNoteId);
  const [localContent, setLocalContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();

  useEffect(() => {
    if (activeNote) {
      setLocalContent(activeNote.content);
    }
  }, [activeNote]);

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-gray-400 dark:text-gray-600"
          >
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">No note selected</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Select a note from the sidebar or create a new one to start writing
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    
    // Auto-detect language if in code mode
    if (activeNote.isCodeMode) {
      const detectedLanguage = detectLanguage(content);
      if (detectedLanguage !== activeNote.language) {
        updateNote(activeNote.id, { language: detectedLanguage });
      }
    }
    
    // Update title if empty and content has text
    if (!activeNote.title || activeNote.title === 'Untitled Note') {
      const firstLine = content.split('\n')[0].substring(0, 50).trim();
      if (firstLine) {
        updateNote(activeNote.id, { title: firstLine });
      }
    }
    
    updateNote(activeNote.id, { content });
    setLastSaved(new Date());
  };

  const handleToggleCodeMode = () => {
    const newCodeMode = !activeNote.isCodeMode;
    const language = newCodeMode ? detectLanguage(activeNote.content) : 'plaintext';
    updateNote(activeNote.id, { 
      isCodeMode: newCodeMode,
      language 
    });
  };

  const handleToggleFavorite = () => {
    toggleNoteFavorite(activeNote.id);
  };

  const handleToggleEncryption = () => {
    // This would open an encryption dialog
    updateNote(activeNote.id, { isEncrypted: !activeNote.isEncrypted });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-white dark:bg-gray-900"
    >
      <Toolbar
        note={activeNote}
        onToggleCodeMode={handleToggleCodeMode}
        onToggleFavorite={handleToggleFavorite}
        onToggleEncryption={handleToggleEncryption}
      />
      
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          note={activeNote}
          onChange={handleContentChange}
        />
      </div>
      
      <StatusBar
        note={activeNote}
        lastSaved={lastSaved}
      />
    </motion.div>
  );
};

export default EditorView;