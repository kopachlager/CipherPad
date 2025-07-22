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
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { exportNote } from '../../utils/helpers';

interface ToolbarProps {
  note: any;
  onToggleCodeMode: () => void;
  onToggleFavorite: () => void;
  onToggleEncryption: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  note,
  onToggleCodeMode,
  onToggleFavorite,
  onToggleEncryption,
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
  }> = ({ icon, tooltip, active, onClick }) => (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-md transition-colors duration-150 ${
        active
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
      }`}
    >
      {icon}
    </button>
  );

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
        {!note.isCodeMode && (
          <div className="hidden sm:flex items-center space-x-1">
            <ToolbarButton
              icon={<Bold className="w-4 h-4" />}
              tooltip="Bold (Ctrl+B)"
              onClick={() => {}}
            />
            <ToolbarButton
              icon={<Italic className="w-4 h-4" />}
              tooltip="Italic (Ctrl+I)"
              onClick={() => {}}
            />
            <ToolbarButton
              icon={<Underline className="w-4 h-4" />}
              tooltip="Underline (Ctrl+U)"
              onClick={() => {}}
            />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
            <ToolbarButton
              icon={<List className="w-4 h-4" />}
              tooltip="Bullet List"
              onClick={() => {}}
            />
            <ToolbarButton
              icon={<ListOrdered className="w-4 h-4" />}
              tooltip="Numbered List"
              onClick={() => {}}
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1 flex-shrink-0">
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