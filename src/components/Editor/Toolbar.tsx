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
  Heading1,
  Heading2,
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
  editorRef?: HTMLTextAreaElement | null;
  onChangeContent?: (content: string) => void;
  contentAnalysis: {
    hasLists: boolean;
    hasLinks: boolean;
    hasCode: boolean;
    hasSelection: boolean;
    selectedText: string;
    wordCount: number;
  };
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
  editorRef,
  onChangeContent,
  contentAnalysis,
}) => {
  const { settings, updateSettings } = useStore();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

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
    suggested?: boolean;
    disabled?: boolean;
  }> = ({ 
    icon, 
    tooltip, 
    active = false, 
    onClick, 
    disabled = false,
    suggested = false 
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`p-2 rounded-md transition-all duration-150 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : active
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          : suggested
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
      }`}
    >
      {icon}
    </button>
  );

  const handleDownload = () => {
    const currentContent = editorRef?.value ?? note.content;
    const enriched = { ...note, content: currentContent };
    exportNote(enriched, note.isCodeMode ? 'txt' : 'md');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: editorRef?.value ?? note.content,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(editorRef?.value ?? note.content);
    }
  };

  const handleToggleFocusMode = () => {
    updateSettings({ distractionFreeMode: !settings.distractionFreeMode });
  };

  const getTextarea = () => {
    return editorRef ?? (document.querySelector('textarea') as HTMLTextAreaElement | null);
  };

  const applyEdit = (
    compute: (value: string, start: number, end: number) => {
      value: string;
      nextStart: number;
      nextEnd: number;
    }
  ) => {
    const textarea = getTextarea();
    if (!textarea || !onChangeContent) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const { value, nextStart, nextEnd } = compute(textarea.value, start, end);
    onChangeContent(value);
    requestAnimationFrame(() => {
      const ta = getTextarea();
      if (ta) {
        ta.setSelectionRange(nextStart, nextEnd);
        ta.focus();
      }
    });
  };

  const surroundSelection = (beforeText: string, afterText: string = beforeText) => {
    applyEdit((v, s, e) => {
      const selected = v.substring(s, e);
      const insert = `${beforeText}${selected}${afterText}`;
      const value = v.substring(0, s) + insert + v.substring(e);
      const next = s + insert.length;
      return { value, nextStart: next, nextEnd: next };
    });
  };

  const toggleLinePrefix = (prefix: string) => {
    applyEdit((value, selStart, selEnd) => {
      const lineStart = value.lastIndexOf('\n', selStart - 1) + 1;
      const lineEnd = value.indexOf('\n', selEnd);
      const endIndex = lineEnd === -1 ? value.length : lineEnd;
      const block = value.substring(lineStart, endIndex);
      const lines = block.split('\n');
      const allPrefixed = lines.every(l => l.startsWith(prefix));
      const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const newLines = lines.map(l => (allPrefixed ? l.replace(new RegExp('^' + escaped), '') : prefix + l));
      const newBlock = newLines.join('\n');
      const newValue = value.substring(0, lineStart) + newBlock + value.substring(endIndex);
      const delta = newBlock.length - block.length;
      const adjust = allPrefixed ? -prefix.length : prefix.length;
      return {
        value: newValue,
        nextStart: selStart + adjust,
        nextEnd: selEnd + delta,
      };
    });
  };

  const insertLink = () => {
    const textarea = getTextarea();
    if (!textarea) return;
    const url = prompt('Enter URL:');
    if (!url) return;
    applyEdit((v, s, e) => {
      const selected = v.substring(s, e) || 'Link';
      const md = `[${selected}](${url})`;
      const value = v.substring(0, s) + md + v.substring(e);
      const cursor = s + md.length;
      return { value, nextStart: cursor, nextEnd: cursor };
    });
  };

  const wrapCodeBlock = () => {
    const lang = note.language && note.language !== 'plaintext' ? note.language : '';
    applyEdit((v, s, e) => {
      const selected = v.substring(s, e);
      const block = '```' + lang + '\n' + (selected || '') + '\n```';
      const value = v.substring(0, s) + block + v.substring(e);
      const cursor = s + block.length;
      return { value, nextStart: cursor, nextEnd: cursor };
    });
  };

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
    switch (format) {
      case 'bold':
        surroundSelection('**', '**');
        break;
      case 'italic':
        surroundSelection('*', '*');
        break;
      case 'code':
        surroundSelection('`', '`');
        break;
      case 'underline':
        surroundSelection('<u>', '</u>');
        break;
      case 'strikethrough':
        surroundSelection('~~', '~~');
        break;
    }
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
            <ToolbarButton
              icon={<Bold className="w-4 h-4" />}
              tooltip="Bold"
              onClick={() => formatText('bold')}
              suggested={contentAnalysis.hasSelection}
            />
            <ToolbarButton
              icon={<Italic className="w-4 h-4" />}
              tooltip="Italic"
              onClick={() => formatText('italic')}
              suggested={contentAnalysis.hasSelection}
            />
            <ToolbarButton
              icon={<Underline className="w-4 h-4" />}
              tooltip="Underline"
              onClick={() => formatText('underline')}
            />
            <ToolbarButton
              icon={<Strikethrough className="w-4 h-4" />}
              tooltip="Strikethrough"
              onClick={() => formatText('strikethrough')}
            />

            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
            <ToolbarButton
              icon={<List className="w-4 h-4" />}
              tooltip="Bullet List"
              onClick={() => toggleLinePrefix('- ')}
              suggested={contentAnalysis.hasLists}
            />
            <ToolbarButton
              icon={<ListOrdered className="w-4 h-4" />}
              tooltip="Numbered List"
              onClick={() => toggleLinePrefix('1. ')}
              suggested={contentAnalysis.hasLists}
            />

            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
            <ToolbarButton
              icon={<Link className="w-4 h-4" />}
              tooltip="Insert Link"
              onClick={insertLink}
              suggested={contentAnalysis.hasLinks}
            />

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
                      toggleLinePrefix('# ');
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Heading1 className="w-4 h-4" />
                    <span>Heading 1</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleLinePrefix('## ');
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Heading2 className="w-4 h-4" />
                    <span>Heading 2</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      insertLink();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Link className="w-4 h-4" />
                    <span>Insert Link</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleLinePrefix('> ');
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Quote className="w-4 h-4" />
                    <span>Quote</span>
                  </button>
                  <button
                    onClick={() => {
                      wrapCodeBlock();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Code className="w-4 h-4" />
                    <span>Code Block</span>
                  </button>
                  <div className="border-t border-gray-300 dark:border-gray-600 my-1"></div>
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
