import React, { useState, useRef, useEffect } from 'react';
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

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  isCodeMode?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  isCodeMode = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
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

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    title: string;
    disabled?: boolean;
  }> = ({ icon, onClick, active, title, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors duration-150 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : active
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
      }`}
    >
      {icon}
    </button>
  );

  if (isCodeMode) {
    return (
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
          placeholder="Start coding..."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Rich Text Toolbar */}
      <div className="flex items-center space-x-1 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <div className="flex items-center space-x-1">
          <ToolbarButton
            icon={<Heading1 className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'h1')}
            title="Heading 1"
          />
          <ToolbarButton
            icon={<Heading2 className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'h2')}
            title="Heading 2"
          />
          <ToolbarButton
            icon={<Heading3 className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'h3')}
            title="Heading 3"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-center space-x-1">
          <ToolbarButton
            icon={<Bold className="w-4 h-4" />}
            onClick={() => execCommand('bold')}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            icon={<Italic className="w-4 h-4" />}
            onClick={() => execCommand('italic')}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            icon={<Underline className="w-4 h-4" />}
            onClick={() => execCommand('underline')}
            title="Underline (Ctrl+U)"
          />
          <ToolbarButton
            icon={<Strikethrough className="w-4 h-4" />}
            onClick={() => execCommand('strikeThrough')}
            title="Strikethrough"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-center space-x-1">
          <ToolbarButton
            icon={<AlignLeft className="w-4 h-4" />}
            onClick={() => execCommand('justifyLeft')}
            title="Align Left"
          />
          <ToolbarButton
            icon={<AlignCenter className="w-4 h-4" />}
            onClick={() => execCommand('justifyCenter')}
            title="Align Center"
          />
          <ToolbarButton
            icon={<AlignRight className="w-4 h-4" />}
            onClick={() => execCommand('justifyRight')}
            title="Align Right"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-center space-x-1">
          <ToolbarButton
            icon={<List className="w-4 h-4" />}
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
          />
          <ToolbarButton
            icon={<ListOrdered className="w-4 h-4" />}
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
          />
          <ToolbarButton
            icon={<Quote className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'blockquote')}
            title="Quote"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-center space-x-1">
          <ToolbarButton
            icon={<Link className="w-4 h-4" />}
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execCommand('createLink', url);
            }}
            title="Insert Link"
          />
          <ToolbarButton
            icon={<Code className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'pre')}
            title="Code Block"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Audio Transcription */}
        <div className="flex items-center space-x-1">
          {isTranscribing ? (
            <ToolbarButton
              icon={<Loader className="w-4 h-4 animate-spin" />}
              onClick={() => {}}
              title="Transcribing..."
              disabled={true}
            />
          ) : (
            <ToolbarButton
              icon={isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              onClick={isRecording ? stopRecording : startRecording}
              title={isRecording ? "Stop Recording" : "Start Voice Recording"}
              active={isRecording}
            />
          )}
        </div>
      </div>

      {/* Rich Text Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 p-6 outline-none overflow-y-auto leading-relaxed"
        style={{
          minHeight: '200px',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
        placeholder="Start writing..."
        suppressContentEditableWarning={true}
      />

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
};

export default RichTextEditor;