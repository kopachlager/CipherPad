import React, { useState, useEffect } from 'react';
import MonacoEditor from './MonacoEditor';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import { useStore } from '../../hooks/useStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { detectLanguage } from '../../utils/helpers';
import EncryptionModal from '../Encryption/EncryptionModal';
import { encryptData, decryptData } from '../../utils/crypto';

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
  const [showEncryptionModal, setShowEncryptionModal] = useState(false);

  useAutoSave(activeNoteId, localContent);

  useEffect(() => {
    if (activeNote) {
      setLocalContent(activeNote.content);
    }
  }, [activeNote]);

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-600">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">No note selected</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Select a note from the sidebar or create a new one to start writing
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    
    // Update the note immediately for real-time sync
    updateNote(activeNote.id, { content });
    
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
    setShowEncryptionModal(true);
  };

  const handleEncryptionSave = (content: string, isEncrypted: boolean) => {
    updateNote(activeNote.id, { 
      content,
      isEncrypted 
    });
    setLocalContent(content);
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
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
      </div>

      <EncryptionModal
        isOpen={showEncryptionModal}
        onClose={() => setShowEncryptionModal(false)}
        note={activeNote}
        onSave={handleEncryptionSave}
      />
    </>
  );
};

export default EditorView;