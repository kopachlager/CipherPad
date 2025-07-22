import React, { useState, useEffect } from 'react';
import MonacoEditor from './MonacoEditor';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import { useStore } from '../../hooks/useStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { detectLanguage } from '../../utils/helpers';
import EncryptionModal from '../Encryption/EncryptionModal';

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
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);

  useAutoSave(activeNoteId, localContent);

  useEffect(() => {
    if (activeNote) {
      setLocalContent(activeNote.content);
    }
  }, [activeNote]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      // This would integrate with a speech-to-text service like OpenAI Whisper
      // For now, we'll simulate the transcription
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      // Simulated transcription - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const transcribedText = "This is a simulated transcription. In a real implementation, this would be the actual transcribed text from the audio.";
      
      // Insert transcribed text at the end of current content
      const newContent = localContent + (localContent ? ' ' : '') + transcribedText;
      setLocalContent(newContent);
      handleContentChange(newContent);
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

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
    if (activeNote) {
      updateNote(activeNote.id, { content });
    }
    
    // Auto-detect language if in code mode
    if (activeNote && activeNote.isCodeMode) {
      const detectedLanguage = detectLanguage(content);
      if (detectedLanguage !== activeNote.language) {
        updateNote(activeNote.id, { language: detectedLanguage });
      }
    }
    
    // Update title if empty and content has text
    if (activeNote && (!activeNote.title || activeNote.title === 'Untitled Note')) {
      const firstLine = content.split('\n')[0].substring(0, 50).trim();
      if (firstLine) {
        updateNote(activeNote.id, { title: firstLine });
      }
    }
    
    setLastSaved(new Date());
  };

  const getContentAnalysis = () => {
    if (!activeNote) return { hasLists: false, hasLinks: false, hasCode: false, hasSelection: false };
    
    const content = activeNote.content || '';
    return {
      hasLists: /^[\s]*[-*+]\s|^[\s]*\d+\.\s/m.test(content),
      hasLinks: /https?:\/\/|www\.|\.com|\.org|\.net/i.test(content) || /\[.*?\]\(.*?\)/.test(content),
      hasCode: /```|`[^`]+`|<code>/.test(content),
      hasSelection: window.getSelection()?.toString().length > 0,
      selectedText: window.getSelection()?.toString() || '',
      wordCount: content.split(/\s+/).filter(w => w.length > 0).length
    };
  };

  const handleToggleCodeMode = () => {
    const newCodeMode = !activeNote.isCodeMode;
    const language = newCodeMode ? detectLanguage(activeNote.content) : 'plaintext';
    updateNote(activeNote.id, { 
      isCodeMode: newCodeMode,
      language 
    });
  };

  const handleLanguageChange = (language: string) => {
    updateNote(activeNote.id, { language });
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
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-r-2xl">
        <Toolbar
          note={activeNote}
          onToggleCodeMode={handleToggleCodeMode}
          onToggleFavorite={handleToggleFavorite}
          onToggleEncryption={handleToggleEncryption}
          onLanguageChange={handleLanguageChange}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          contentAnalysis={getContentAnalysis()}
        />
        
        <div className="flex-1 overflow-hidden relative">
          {activeNote.isCodeMode ? (
            <MonacoEditor
              note={activeNote}
              onChange={handleContentChange}
            />
          ) : (
            <textarea
              ref={(ref) => setEditorRef(ref)}
              value={localContent}
              onChange={(e) => {
                const newContent = e.target.value;
                setLocalContent(newContent);
                handleContentChange(newContent);
              }}
              onSelect={(e) => {
                // Update selection for toolbar context
                const target = e.target as HTMLTextAreaElement;
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const selectedText = target.value.substring(start, end);
                // Trigger toolbar update if needed
              }}
              placeholder="Start writing your note..."
              className="flex-1 p-6 outline-none overflow-y-auto leading-relaxed min-h-full w-full resize-none bg-transparent border-none text-gray-900 dark:text-gray-100"
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                fontFamily: settings.fontFamily,
                whiteSpace: 'pre-wrap', // Preserve whitespace and wrap
                wordWrap: 'break-word', // Break long words
                overflowWrap: 'break-word', // Modern word breaking
                wordBreak: 'break-word', // Break words when necessary
              }}
            />
          )}
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-full z-10">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording...</span>
            </div>
          )}

          {/* Transcribing Indicator */}
          {isTranscribing && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-full z-10">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Transcribing...</span>
            </div>
          )}
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