import React from 'react';
import { Save, Clock, Type, Hash } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { getWordCount, getCharCount, formatDate } from '../../utils/helpers';

interface StatusBarProps {
  note: any;
  lastSaved?: Date;
}

const StatusBar: React.FC<StatusBarProps> = ({ note, lastSaved }) => {
  const { settings } = useStore();

  if (settings.distractionFreeMode) {
    return null;
  }

  const plainText = note.isCodeMode
    ? note.content || ''
    : (note.content || '').replace(/<[^>]*>/g, ' ');
  const wordCount = getWordCount(plainText);
  const charCount = getCharCount(plainText);

  return (
    <div className="h-8 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center space-x-4">
        {settings.showWordCount && (
          <>
            <div className="flex items-center space-x-1">
              <Type className="w-3 h-3" />
              <span>{wordCount} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <Hash className="w-3 h-3" />
              <span>{charCount} characters</span>
            </div>
          </>
        )}
        
        {note.isCodeMode && note.language && (
          <div className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
            {note.language}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {lastSaved && (
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Saved {formatDate(lastSaved)}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <Save className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Auto-saved</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
