import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useStore } from '../../hooks/useStore';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Mic,
  MicOff,
  Upload,
  Loader,
} from 'lucide-react';

export interface RichTextEditorHandle {
  focus: () => void;
  getRoot: () => HTMLDivElement | null;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  isCodeMode?: boolean;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(({ 
  content,
  onChange,
  isCodeMode = false,
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const { settings } = useStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    // Avoid clobbering user typing: only sync when not focused
    if (!isFocused && el.innerHTML !== content) {
      el.innerHTML = content || '';
      lastHtmlRef.current = el.innerHTML;
    }
  }, [content, isFocused]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    onChange(html);
  };

  const insertText = (text: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      handleInput();
    }
  };

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
      setAudioChunks(chunks);
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
      
      insertText(transcribedText + ' ');
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus(),
    getRoot: () => editorRef.current,
  }));

  return (
    <div className="flex-1 flex flex-col relative min-h-0">
      {isCodeMode ? (
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
          placeholder="Start coding..."
          aria-label="Code editor"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 p-6 outline-none overflow-y-auto leading-relaxed editor-content min-h-0"
          style={{
            minHeight: '200px',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight as unknown as string,
          }}
          placeholder="Start writing..."
          suppressContentEditableWarning={true}
          aria-label="Rich text editor"
          data-gramm="false"
          data-gramm_editor="false"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Recording...</span>
        </div>
      )}

      {/* Transcribing Indicator */}
      {isTranscribing && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-full">
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Transcribing...</span>
        </div>
      )}
    </div>
  );
});

export default RichTextEditor;
