import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MonacoEditor from './MonacoEditor';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
// Temporarily render textarea for stability; rich editor can be re-enabled later
import RichTextEditor, { RichTextEditorHandle } from './RichTextEditor';
import { Lock } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { detectLanguage } from '../../utils/helpers';
import EncryptionModal from '../Encryption/EncryptionModal';

const TabsBar: React.FC = () => {
  const { openTabs, notes, activeNoteId, setActiveNote, closeTab } = useStore();
  const tabs = openTabs
    .map(id => notes.find(n => n.id === id))
    .filter(Boolean) as any[];
  if (tabs.length <= 1) return null;
  return (
    <div className="h-9 flex items-center gap-1 px-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60">
      {tabs.map((n: any) => (
        <button
          key={n.id}
          onMouseDown={(e)=>{ e.preventDefault(); setActiveNote(n.id); }}
          className={`group flex items-center gap-2 px-3 h-7 rounded-md text-sm whitespace-nowrap ${activeNoteId===n.id ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        >
          <span className="truncate max-w-[160px]">{n.title || 'Untitled'}</span>
          <span
            role="button"
            aria-label="Close"
            onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); closeTab(n.id); }}
            className="opacity-70 group-hover:opacity-100 hover:bg-gray-300/60 dark:hover:bg-gray-700/60 rounded"
          >
            <X className="w-3 h-3" />
          </span>
        </button>
      ))}
    </div>
  );
};

const EditorView: React.FC = () => {
  const { 
    notes, 
    activeNoteId, 
    updateNote, 
    toggleNoteFavorite,
    settings,
    encryptionRequestForNoteId,
    clearEncryptionRequest
  } = useStore();

  const activeNote = notes.find((note) => note.id === activeNoteId);
  const [localContent, setLocalContent] = useState('');
  const [localTitle, setLocalTitle] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [showEncryptionModal, setShowEncryptionModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [editorRef, setEditorRef] = useState<HTMLTextAreaElement | null>(null);
  const richRef = React.useRef<RichTextEditorHandle>(null);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const langDebounceRef = React.useRef<number | null>(null);
  const titleDebounceRef = React.useRef<number | null>(null);

  useAutoSave(activeNoteId, localContent);

  useEffect(() => {
    if (activeNote) {
      setLocalContent(activeNote.content);
      setLocalTitle(activeNote.title || '');
      // Sync title display from active note
    }
  }, [activeNote]);

  // Open encryption modal when requested from elsewhere (e.g., sidebar)
  useEffect(() => {
    if (activeNote && encryptionRequestForNoteId === activeNote.id) {
      setShowEncryptionModal(true);
      clearEncryptionRequest?.();
    }
  }, [encryptionRequestForNoteId, activeNote, clearEncryptionRequest]);

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

  const handleTitleInput = (value: string) => {
    setLocalTitle(value);
    if (!activeNote) return;
    if (titleDebounceRef.current) window.clearTimeout(titleDebounceRef.current);
    titleDebounceRef.current = window.setTimeout(() => {
      updateNote(activeNote.id!, { title: value || 'Untitled Note' });
      setLastSaved(new Date());
    }, 300) as unknown as number;
  };

  const escapeHtml = (text: string) => text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const handleClearFormatting = () => {
    // Convert current rich HTML to plain text, keep line breaks.
    const temp = document.createElement('div');
    temp.innerHTML = localContent || '';
    const plain = temp.innerText || temp.textContent || '';
    const html = escapeHtml(plain).replace(/\n/g, '<br>');
    setLocalContent(html);
    handleContentChange(html);
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-r-2xl paper-surface min-h-0">
        {/* Title Bar */}
        {activeNote && (
          <div className="px-4 pt-3">
            <input
              type="text"
              value={localTitle}
              onChange={(e) => handleTitleInput(e.target.value)}
              disabled={!!activeNote.isEncrypted}
              placeholder="Untitled Note"
              className="w-full bg-transparent text-xl font-semibold text-gray-900 dark:text-gray-100 outline-none border-b border-transparent focus:border-gray-300 dark:focus:border-gray-700 pb-2"
              style={{ fontFamily: settings.fontFamily }}
            />
          </div>
        )}
        {/* Tabs Bar */}
        <TabsBar />
        <Toolbar
          note={activeNote}
          onToggleCodeMode={handleToggleCodeMode}
          onToggleFavorite={handleToggleFavorite}
          onToggleEncryption={handleToggleEncryption}
          onLanguageChange={handleLanguageChange}
          onClearFormatting={handleClearFormatting}
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
        
        <div className="flex-1 overflow-y-auto relative paper-sheet min-h-0 h-full framed-scrollbar">
          {/* Encrypted placeholder */}
          {activeNote.isEncrypted ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">This note is encrypted</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Unlock it to view and edit the contents.</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowEncryptionModal(true)}
                    className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  >
                    Decrypt Note
                  </button>
                </div>
              </div>
            </div>
          ) : activeNote.isCodeMode ? (
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
