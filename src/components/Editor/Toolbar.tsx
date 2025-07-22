import React, { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Type,
  List,
  ListOrdered,
  Quote,
  Link,
  Mic,
  MicOff,
  Loader,
  Heart,
  Lock,
  Unlock,
  Download,
  Share,
  Eye,
  ChevronDown,
  Palette,
  Languages,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { exportNote } from '../../utils/helpers';

interface ToolbarProps {
  note: any;
  onToggleCodeMode: () => void;
  onToggleFavorite: () => void;
  onToggleEncryption: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onLanguageChange?: (language: string) => void;
  isRecording?: boolean;
  isTranscribing?: boolean;
  selectedText?: string;
  cursorPosition?: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
  note,
  onToggleCodeMode,
  onToggleFavorite,
  onToggleEncryption,
  onStartRecording,
  onStopRecording,
  onLanguageChange,
  isRecording = false,
  isTranscribing = false,
  selectedText = '',
}) => {
  const { settings, updateSettings } = useStore();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [detectedFormat, setDetectedFormat] = useState<string[]>([]);

  // Auto-detect content format and suggest tools
  useEffect(() => {
    const content = note.content || '';
    const formats: string[] = [];

    // Detect markdown
    if (content.includes('# ') || content.includes('## ') || content.includes('### ')) {
      formats.push('markdown');
    }
    
    // Detect lists
    if (content.includes('- ') || content.includes('* ') || /^\d+\.\s/.test(content)) {
      formats.push('lists');
    }
    
    // Detect links
    if (content.includes('http') || content.includes('[') && content.includes('](')) {
      formats.push('links');
    }
    
    // Detect code blocks
    if (content.includes('```') || content.includes('`')) {
      formats.push('code');
    }

    setDetectedFormat(formats);
  }, [note.content]);

  if (settings.distractionFreeMode) {
    return null;
  }

  const languages = [
    { value: 'plaintext', label: 'Plain Text' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'sql', label: 'SQL' },
    { value: 'shell', label: 'Shell' },
  ];

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    tooltip: string;
    active?: boolean;
    onClick: () => void;
    disabled?: boolean;
    suggested?: boolean;
  }> = ({ icon, tooltip, active, onClick, disabled = false, suggested = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`relative p-2 rounded-md transition-all duration-150 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : active
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
          : suggested
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
      }`}
    >
      {icon}
      {suggested && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}
    </button>
  );

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (editor) {
      editor.focus();
    }
  };

  const handleDownload = () => {
    exportNote(note, note.isCodeMode ? 'txt' : 'md');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(note.content);
    }
  };

  const handleToggleFocusMode = () => {
    updateSettings({ distractionFreeMode: !settings.distractionFreeMode });
  };

  return (
    <div className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 overflow-x-auto flex-shrink-0">
      <div className="flex items-center space-x-1">
        {/* Mode Toggle */}
        <ToolbarButton
          icon={<Code className="w-4 h-4" />}
          tooltip={note.isCodeMode ? "Switch to Rich Text" : "Switch to Code Mode"}
          active={note.isCodeMode}
          onClick={onToggleCodeMode}
        />

        {note.isCodeMode ? (
          /* Code Mode Tools */
          <div className="flex items-center space-x-1 ml-2">
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Languages className="w-3 h-3" />
                <span className="font-mono">
                  {languages.find(l => l.value === note.language)?.label || 'Plain Text'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showLanguageMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => {
                        onLanguageChange?.(lang.value);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        note.language === lang.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Rich Text Tools - Smart & Contextual */
          <div className="flex items-center space-x-1 ml-2">
            {/* Basic Formatting */}
            <ToolbarButton
              icon={<Bold className="w-4 h-4" />}
              tooltip="Bold (Ctrl+B)"
              onClick={() => execCommand('bold')}
              suggested={detectedFormat.includes('markdown')}
            />
            <ToolbarButton
              icon={<Italic className="w-4 h-4" />}
              tooltip="Italic (Ctrl+I)"
              onClick={() => execCommand('italic')}
              suggested={detectedFormat.includes('markdown')}
            />
            <ToolbarButton
              icon={<Underline className="w-4 h-4" />}
              tooltip="Underline (Ctrl+U)"
              onClick={() => execCommand('underline')}
            />

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

            {/* Lists - Show when detected or selected */}
            <ToolbarButton
              icon={<List className="w-4 h-4" />}
              tooltip="Bullet List"
              onClick={() => execCommand('insertUnorderedList')}
              suggested={detectedFormat.includes('lists')}
            />
            <ToolbarButton
              icon={<ListOrdered className="w-4 h-4" />}
              tooltip="Numbered List"
              onClick={() => execCommand('insertOrderedList')}
              suggested={detectedFormat.includes('lists')}
            />

            {/* Contextual Tools */}
            {(detectedFormat.includes('links') || selectedText.length > 0) && (
              <>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                <ToolbarButton
                  icon={<Link className="w-4 h-4" />}
                  tooltip="Insert Link"
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) execCommand('createLink', url);
                  }}
                  suggested={detectedFormat.includes('links')}
                />
              </>
            )}

            {detectedFormat.includes('code') && (
              <>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                <ToolbarButton
                  icon={<Code className="w-4 h-4" />}
                  tooltip="Inline Code"
                  onClick={() => {
                    const selection = window.getSelection();
                    if (selection && selection.toString()) {
                      execCommand('insertHTML', `<code>${selection.toString()}</code>`);
                    }
                  }}
                  suggested={true}
                />
              </>
            )}

            <ToolbarButton
              icon={<Quote className="w-4 h-4" />}
              tooltip="Quote"
              onClick={() => execCommand('formatBlock', 'blockquote')}
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {/* Audio Recording */}
        {isTranscribing ? (
          <ToolbarButton
            icon={<Loader className="w-4 h-4 animate-spin" />}
            tooltip="Transcribing..."
            onClick={() => {}}
            disabled={true}
          />
        ) : (
          <ToolbarButton
            icon={isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            tooltip={isRecording ? "Stop Recording" : "Voice to Text"}
            active={isRecording}
            onClick={isRecording ? (onStopRecording || (() => {})) : (onStartRecording || (() => {}))}
          />
        )}

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Note Actions */}
        <ToolbarButton
          icon={<Heart className="w-4 h-4" />}
          tooltip="Favorite"
          active={note.isFavorite}
          onClick={onToggleFavorite}
        />
        <ToolbarButton
          icon={note.isEncrypted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          tooltip={note.isEncrypted ? "Encrypted" : "Encrypt"}
          active={note.isEncrypted}
          onClick={onToggleEncryption}
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Export & Focus */}
        <ToolbarButton
          icon={<Download className="w-4 h-4" />}
          tooltip="Download"
          onClick={handleDownload}
        />
        <ToolbarButton
          icon={<Share className="w-4 h-4" />}
          tooltip="Share"
          onClick={handleShare}
        />
        <ToolbarButton
          icon={<Eye className="w-4 h-4" />}
          tooltip="Focus Mode"
          onClick={handleToggleFocusMode}
        />
      </div>

      {/* Click outside to close language menu */}
      {showLanguageMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </div>
  );
};

export default Toolbar;