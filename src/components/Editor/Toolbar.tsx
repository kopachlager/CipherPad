import React, { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
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
  Languages,
  MoreHorizontal,
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [contextualTools, setContextualTools] = useState<string[]>([]);

  // Auto-detect content and suggest contextual tools
  useEffect(() => {
    const content = note.content || '';
    const tools: string[] = [];

    // Only show contextual tools when they're actually relevant
    if (selectedText.length > 0) {
      tools.push('formatting');
    }
    if (content.includes('http') || content.includes('[') && content.includes('](')) {
      tools.push('link');
    }
    if (content.includes('- ') || content.includes('* ') || /^\d+\.\s/.test(content)) {
      tools.push('lists');
    }
    if (content.includes('```') || content.includes('`')) {
      tools.push('code');
    }

    setContextualTools(tools);
  }, [note.content, selectedText]);

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
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'sql', label: 'SQL' },
  ];

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    tooltip: string;
    active?: boolean;
    onClick: () => void;
    disabled?: boolean;
    contextual?: boolean;
  }> = ({ icon, tooltip, active, onClick, disabled = false, contextual = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`p-2 rounded-md transition-all duration-150 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : active
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          : contextual
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
      }`}
    >
      {icon}
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
    <div className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center space-x-1">
        {/* Essential Tools Only */}
        <ToolbarButton
          icon={<Code className="w-4 h-4" />}
          tooltip={note.isCodeMode ? "Rich Text Mode" : "Code Mode"}
          active={note.isCodeMode}
          onClick={onToggleCodeMode}
        />

        {note.isCodeMode ? (
          /* Code Mode - Language Selector */
          <div className="relative ml-2">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Languages className="w-3 h-3" />
              <span className="font-mono text-xs">
                {languages.find(l => l.value === note.language)?.label || 'Plain Text'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showLanguageMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto min-w-32">
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
        ) : (
          /* Rich Text Mode - Contextual Tools */
          <div className="flex items-center space-x-1 ml-2">
            {/* Always show basic formatting */}
            <ToolbarButton
              icon={<Bold className="w-4 h-4" />}
              tooltip="Bold"
              onClick={() => execCommand('bold')}
              contextual={contextualTools.includes('formatting')}
            />
            <ToolbarButton
              icon={<Italic className="w-4 h-4" />}
              tooltip="Italic"
              onClick={() => execCommand('italic')}
              contextual={contextualTools.includes('formatting')}
            />

            {/* Show lists only when contextually relevant */}
            {contextualTools.includes('lists') && (
              <>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                <ToolbarButton
                  icon={<List className="w-4 h-4" />}
                  tooltip="Bullet List"
                  onClick={() => execCommand('insertUnorderedList')}
                  contextual={true}
                />
                <ToolbarButton
                  icon={<ListOrdered className="w-4 h-4" />}
                  tooltip="Numbered List"
                  onClick={() => execCommand('insertOrderedList')}
                  contextual={true}
                />
              </>
            )}

            {/* Show link tool when links detected */}
            {contextualTools.includes('link') && (
              <>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                <ToolbarButton
                  icon={<Link className="w-4 h-4" />}
                  tooltip="Insert Link"
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) execCommand('createLink', url);
                  }}
                  contextual={true}
                />
              </>
            )}

            {/* More tools in dropdown */}
            <div className="relative">
              <ToolbarButton
                icon={<MoreHorizontal className="w-4 h-4" />}
                tooltip="More Tools"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              />
              
              {showMoreMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 min-w-48">
                  <button
                    onClick={() => {
                      execCommand('underline');
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Underline className="w-4 h-4" />
                    <span>Underline</span>
                  </button>
                  <button
                    onClick={() => {
                      execCommand('strikeThrough');
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Strikethrough className="w-4 h-4" />
                    <span>Strikethrough</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      const url = prompt('Enter URL:');
                      if (url) execCommand('createLink', url);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Link className="w-4 h-4" />
                    <span>Insert Link</span>
                  </button>
                  <button
                    onClick={() => {
                      execCommand('formatBlock', 'blockquote');
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Quote className="w-4 h-4" />
                    <span>Quote</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      handleDownload();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => {
                      handleShare();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {/* Voice Recording */}
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

        {/* Essential Actions */}
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
        <ToolbarButton
          icon={<Eye className="w-4 h-4" />}
          tooltip="Focus Mode"
          onClick={handleToggleFocusMode}
        />
      </div>

      {/* Click outside handlers */}
      {showLanguageMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </div>
  );
};

export default Toolbar;