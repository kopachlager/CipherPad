import React from 'react';
import { AnimatePresence } from 'framer-motion';
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
  Heart,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

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

  if (settings.distractionFreeMode) {
    return null;
  }

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    tooltip: string;
    active?: boolean;
    onClick: () => void;
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

  return (
    <AnimatePresence>
      <div className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-1">
          {!note.isCodeMode && (
            <>
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
              <ToolbarButton
                icon={<Strikethrough className="w-4 h-4" />}
                tooltip="Strikethrough"
                onClick={() => {}}
              />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />
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
              <ToolbarButton
                icon={<Quote className="w-4 h-4" />}
                tooltip="Quote"
                onClick={() => {}}
              />
              <ToolbarButton
                icon={<Link className="w-4 h-4" />}
                tooltip="Insert Link"
                onClick={() => {}}
              />
            </>
          )}
        </div>

        <div className="flex items-center space-x-1">
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
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />
          
          <ToolbarButton
            icon={settings.distractionFreeMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            tooltip="Toggle Focus Mode"
            onClick={() => {}}
          />
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Toolbar;