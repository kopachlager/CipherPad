import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  Type,
  Save,
  Minus,
  Plus,
  Heart,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Share,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Mic,
  MicOff,
  Loader,
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
  isRecording?: boolean;
  isTranscribing?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  note,
  onToggleCodeMode,
  onToggleFavorite,
  onToggleEncryption,
  onStartRecording,
  onStopRecording,
  isRecording = false,
  isTranscribing = false,
}) => {
  const { settings } = useStore();
  const { updateSettings } = useStore();

  if (settings.distractionFreeMode) {
    return null;
  }

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    tooltip: string;
    active?: boolean;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
  }> = ({ icon, tooltip, active, onClick, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`p-2 rounded-md transition-colors duration-150 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          :
        active
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
      }`}
    >
      {icon}
    </button>
  );

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Focus back to editor after command
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (editor) {
      editor.focus();
    }
  };

  const handleFontSizeChange = (increase: boolean) => {
    const newSize = increase 
      ? Math.min(settings.fontSize + 2, 24)
      : Math.max(settings.fontSize - 2, 12);
    updateSettings({ fontSize: newSize });
  };

  const handleToggleFocusMode = () => {
    updateSettings({ distractionFreeMode: !settings.distractionFreeMode });
  };

  const handleDownload = () => {
    exportNote(note, 'txt');
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(note.content);
    }
  };

  return (
    <div className="h-12 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 overflow-x-auto flex-shrink-0">
      <div className="flex items-center space-x-1 flex-shrink-0">
        {!note.isCodeMode ? (
          // Rich Text Formatting Tools
          <div className="flex items-center space-x-1">
            {/* Headings */}
            <div className="hidden md:flex items-center space-x-1">
              <ToolbarButton
                icon={<Heading1 className="w-4 h-4" />}
                tooltip="Heading 1"
                onClick={() => execCommand('formatBlock', 'h1')}
              />
              <ToolbarButton
                icon={<Heading2 className="w-4 h-4" />}
                tooltip="Heading 2"
                onClick={() => execCommand('formatBlock', 'h2')}
              />
              <ToolbarButton
                icon={<Heading3 className="w-4 h-4" />}
                tooltip="Heading 3"
                onClick={() => execCommand('formatBlock', 'h3')}
              />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
            </div>

            {/* Text Formatting */}
            <ToolbarButton
              icon={<Bold className="w-4 h-4" />}
              tooltip="Bold (Ctrl+B)"
              onClick={() => execCommand('bold')}
            />
            <ToolbarButton
              icon={<Italic className="w-4 h-4" />}
              tooltip="Italic (Ctrl+I)"
              onClick={() => execCommand('italic')}
            />
            <ToolbarButton
              icon={<Underline className="w-4 h-4" />}
              tooltip="Underline (Ctrl+U)"
              onClick={() => execCommand('underline')}
            />
            <ToolbarButton
              icon={<Strikethrough className="w-4 h-4" />}
              tooltip="Strikethrough"
              onClick={() => execCommand('strikeThrough')}
            />

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />

            {/* Alignment - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-1">
              <ToolbarButton
                icon={<AlignLeft className="w-4 h-4" />}
                tooltip="Align Left"
                onClick={() => execCommand('justifyLeft')}
              />
              <ToolbarButton
                icon={<AlignCenter className="w-4 h-4" />}
                tooltip="Align Center"
                onClick={() => execCommand('justifyCenter')}
              />
              <ToolbarButton
                icon={<AlignRight className="w-4 h-4" />}
                tooltip="Align Right"
                onClick={() => execCommand('justifyRight')}
              />
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />

            {/* Lists */}
            <ToolbarButton
              icon={<List className="w-4 h-4" />}
              tooltip="Bullet List"
              onClick={() => execCommand('insertUnorderedList')}
            />
            <ToolbarButton
              icon={<ListOrdered className="w-4 h-4" />}
              tooltip="Numbered List"
              onClick={() => execCommand('insertOrderedList')}
            />

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />

            {/* Additional Tools - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1">
              <ToolbarButton
                icon={<Quote className="w-4 h-4" />}
                tooltip="Quote"
                onClick={() => execCommand('formatBlock', 'blockquote')}
              />
              <ToolbarButton
                icon={<Link className="w-4 h-4" />}
                tooltip="Insert Link"
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) execCommand('createLink', url);
                }}
              />
            </div>
          </div>
        ) : (
          // Code Mode - Show language indicator
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500 font-mono">
              {note.language || 'plaintext'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1 flex-shrink-0">
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
            tooltip={isRecording ? "Stop Recording" : "Start Voice Recording"}
            active={isRecording}
            onClick={isRecording ? (onStopRecording || (() => {})) : (onStartRecording || (() => {}))}
          />
        )}

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Font Size Controls */}
        <ToolbarButton
          icon={<Minus className="w-4 h-4" />}
          tooltip="Decrease Font Size"
          onClick={() => handleFontSizeChange(false)}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 px-1 hidden sm:inline">
          {settings.fontSize}px
        </span>
        <ToolbarButton
          icon={<Plus className="w-4 h-4" />}
          tooltip="Increase Font Size"
          onClick={() => handleFontSizeChange(true)}
        />
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
        
        {/* Note Actions */}
        <ToolbarButton
          icon={<Code className="w-4 h-4" />}
          tooltip="Toggle Code Mode"
          active={note.isCodeMode}
          onClick={onToggleCodeMode}
        />
        <ToolbarButton
          icon={<Heart className="w-4 h-4" />}
          tooltip="Toggle Favorite"
          active={note.isFavorite}
          onClick={onToggleFavorite}
        />
        <ToolbarButton
          icon={note.isEncrypted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          tooltip={note.isEncrypted ? "Remove Encryption" : "Encrypt Note"}
          active={note.isEncrypted}
          onClick={onToggleEncryption}
        />
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />
        
        {/* Export & Share */}
        <div className="hidden sm:flex items-center space-x-1">
          <ToolbarButton
            icon={<Download className="w-4 h-4" />}
            tooltip="Download Note"
            onClick={handleDownload}
          />
          <ToolbarButton
            icon={<Share className="w-4 h-4" />}
            tooltip="Share Note"
            onClick={handleShare}
          />
        </div>
        
        <ToolbarButton
          icon={<Eye className="w-4 h-4" />}
          tooltip="Toggle Focus Mode"
          onClick={handleToggleFocusMode}
        />
      </div>
    </div>
  );
};

export default Toolbar;