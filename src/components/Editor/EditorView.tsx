import React, { useState, useEffect } from 'react';
import MonacoEditor from './MonacoEditor';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import RichTextEditor, { RichTextEditorHandle } from './RichTextEditor';
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
  const [editorRef, setEditorRef] = useState<HTMLTextAreaElement | null>(null);
  const richRef = React.useRef<RichTextEditorHandle>(null);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const langDebounceRef = React.useRef<number | null>(null);

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
    
    // Auto-detect language if in code mode
    if (activeNote && activeNote.isCodeMode) {
      const detectedLanguage = detectLanguage(content);
      if (detectedLanguage !== activeNote.language) {
        if (langDebounceRef.current) {
          clearTimeout(langDebounceRef.current);
        }
        langDebounceRef.current = window.setTimeout(() => {
          updateNote(activeNote.id, { language: detectedLanguage });
        }, 800) as unknown as number;
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
    const content = localContent || '';
    const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
    if (!activeNote.isCodeMode) {
      // WYSIWYG mode: use queryCommandState where possible
      const hasSelection = (window.getSelection()?.toString() || '').length > 0;
      const boldActive = document.queryCommandState('bold');
      const italicActive = document.queryCommandState('italic');
      const underlineActive = document.queryCommandState('underline');
      const strikethroughActive = document.queryCommandState('strikeThrough');
      const bulletActive = document.queryCommandState('insertUnorderedList');
      const orderedActive = document.queryCommandState('insertOrderedList');
      // Detect blockquote by walking up DOM
      let quoteActive = false;
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        let node: Node | null = sel.anchorNode;
        while (node) {
          if ((node as HTMLElement).tagName === 'BLOCKQUOTE') { quoteActive = true; break; }
          node = (node as Node).parentNode;
        }
      }
      const hasLinks = /<a\b[^>]*>/i.test(content);
      const hasCode = /<pre|<code/i.test(content);
      return {
        hasLists: bulletActive || orderedActive,
        hasLinks,
        hasCode,
        hasSelection,
        selectedText: window.getSelection()?.toString() || '',
        wordCount,
        boldActive,
        italicActive,
        underlineActive,
        strikethroughActive,
        bulletActive,
        orderedActive,
        quoteActive,
        selectionVersion,
      } as any;
    }
    // Code mode (plain textarea/Monaco)
    const hasLists = /[-*+]\s|\d+\.\s/.test(content);
    const hasLinks = /https?:\/\//i.test(content) || /<a\b/i.test(content);
    const hasCode = /```|<code|<pre/i.test(content);
    return {
      hasLists,
      hasLinks,
      hasCode,
      hasSelection: false,
      selectedText: '',
      wordCount,
      selectionVersion,
    } as any;
  };

  const applyEditFromToolbar = (
    compute: (value: string, start: number, end: number) => {
      value: string;
      nextStart: number;
      nextEnd: number;
    }
  ) => {
    // Only for Rich Text mode (textarea)
    if (activeNote.isCodeMode) return;
    const ta = editorRef;
    const value = localContent;
    const start = ta ? ta.selectionStart : value.length;
    const end = ta ? ta.selectionEnd : value.length;
    const result = compute(value, start, end);
    setLocalContent(result.value);
    handleContentChange(result.value);
    // Restore selection
    requestAnimationFrame(() => {
      const el = editorRef;
      if (el) {
        el.setSelectionRange(result.nextStart, result.nextEnd);
        el.focus();
      }
      setSelectionVersion(v => v + 1);
    });
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
          editorRef={editorRef}
          onApplyEdit={applyEditFromToolbar}
          onRichCommand={(cmd, value) => {
            // Focus the rich editor to keep selection
            richRef.current?.focus();
            try {
              if (cmd === 'bold' || cmd === 'italic' || cmd === 'underline' || cmd === 'strikeThrough') {
                document.execCommand(cmd);
              } else if (cmd === 'insertUnorderedList' || cmd === 'insertOrderedList') {
                document.execCommand(cmd);
              } else if (cmd === 'formatBlock') {
                document.execCommand('formatBlock', false, value || 'blockquote');
              } else if (cmd === 'createLink') {
                const url = value || prompt('Enter URL:') || '';
                if (url) document.execCommand('createLink', false, url);
              } else if (cmd === 'pre') {
                document.execCommand('formatBlock', false, 'pre');
              }
            } catch (e) {
              console.error('Rich command failed', cmd, e);
            }
            // After execCommand, trigger change
            const root = richRef.current?.getRoot();
            if (root) {
              const html = root.innerHTML;
              setLocalContent(html);
              handleContentChange(html);
              setSelectionVersion((v) => v + 1);
            }
          }}
        />
        
        <div className="flex-1 overflow-hidden relative">
          {/* Debug: selection/content length */}
          <div className="absolute top-2 left-2 text-[10px] text-gray-400 bg-white/80 dark:bg-gray-800/60 rounded px-1 pointer-events-none">
            selVer:{selectionVersion} len:{localContent.length}
          </div>
          {activeNote.isCodeMode ? (
            <MonacoEditor
              note={activeNote}
              onChange={handleContentChange}
            />
          ) : (
            <RichTextEditor
              ref={richRef}
              content={localContent}
              onChange={(html) => {
                setLocalContent(html);
                handleContentChange(html);
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
