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
  Eraser,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { exportNote } from '../../utils/helpers';
import PopoverSelect from '../Common/PopoverSelect';
import Tooltip from '../Common/Tooltip';

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
  onApplyEdit?: (
    compute: (value: string, start: number, end: number) => {
      value: string;
      nextStart: number;
      nextEnd: number;
    }
  ) => void;
  onRichCommand?: (cmd: 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'insertUnorderedList' | 'insertOrderedList' | 'formatBlock' | 'createLink' | 'pre', value?: string) => void;
  onClearFormatting?: () => void;
  contentAnalysis: {
    hasLists: boolean;
    hasLinks: boolean;
    hasCode: boolean;
    hasSelection: boolean;
    selectedText: string;
    wordCount: number;
    boldActive?: boolean;
    italicActive?: boolean;
    underlineActive?: boolean;
    strikethroughActive?: boolean;
    bulletActive?: boolean;
    orderedActive?: boolean;
    quoteActive?: boolean;
    selectionVersion?: number;
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
  onApplyEdit,
  onRichCommand,
  onClearFormatting,
  contentAnalysis,
}) => {
  const { settings, updateSettings } = useStore();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  useEffect(() => {
    if (note?.projectId) {
      useStore.getState().loadLanes(note.projectId);
    }
  }, [note?.projectId]);

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
    <Tooltip content={tooltip}>
      <button
      type="button"
      onMouseDown={(e) => {
        try { console.log('[Toolbar MouseDown]', tooltip, e.button); } catch {}
        // Prevent focus from leaving the textarea, which can cancel click.
        e.preventDefault();
        e.stopPropagation();
        // Execute action on mousedown to avoid mouseup being intercepted.
        onClick();
      }}
      onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onClick={(e) => {
        try { console.log('[Toolbar Click]', tooltip, { isCodeMode: note?.isCodeMode }); } catch {}
        e.preventDefault();
        e.stopPropagation();
      }}
      disabled={disabled}
      aria-label={tooltip}
      className={`p-2 rounded-md transition-all duration-150 pointer-events-auto ${
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
    </Tooltip>
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
    const next = !settings.distractionFreeMode;
    try { console.log('[Toolbar] Toggle Focus Mode ->', next); } catch {}
    updateSettings({ distractionFreeMode: next });
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
    if (onApplyEdit) {
      onApplyEdit((value, start, end) => compute(value, start, end));
      return;
    }
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const { value, nextStart, nextEnd } = compute(textarea.value, start, end);
    textarea.value = value;
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    textarea.setSelectionRange(nextStart, nextEnd);
    textarea.focus();
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
    <div
      className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 flex-shrink-0 relative z-50 pointer-events-auto"
      onMouseDown={(e) => {
        try { console.log('[Toolbar] container mousedown', { x: e.clientX, y: e.clientY }); } catch {}
      }}
      aria-label="Editor toolbar"
    >
      <div className="flex items-center space-x-1">
        {/* Essential Tools Only */}
        <ToolbarButton
          icon={<Code className="w-4 h-4" />}
          tooltip={note.isCodeMode ? "Rich Text Mode" : "Code Mode"}
          active={note.isCodeMode}
          onClick={onToggleCodeMode}
        />
        {/* Project / Lane assignment */}
        <div className="ml-2 hidden md:flex items-center gap-2">
          <PopoverSelect
            value={note.projectId || ''}
            options={[...useStore.getState().projects.map(p => ({ label: p.name, value: p.id }))]}
            onChange={async (projectId) => {
              const { loadLanes, createLane, updateNote } = useStore.getState();
              if (!projectId) return;
              await loadLanes(projectId);
              let lanes = useStore.getState().lanes.filter(l => l.projectId === projectId);
              if (lanes.length === 0) {
                await createLane(projectId, 'Notes');
                await loadLanes(projectId);
                lanes = useStore.getState().lanes.filter(l => l.projectId === projectId);
              }
              const defaultLane = lanes.find(l => l.name.toLowerCase()==='notes') || lanes[0];
              await updateNote(note.id, { projectId, laneId: defaultLane?.id });
            }}
            buttonClassName="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            menuClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md"
            renderButtonLabel={(value) => {
              const proj = useStore.getState().projects.find(p => p.id === value);
              return <span className="flex items-center gap-2"><span className="w-2 h-2 rounded" style={{ backgroundColor: proj?.color || '#6b7280' }} />{proj?.name || 'Select project'}</span>;
            }}
          />
          <PopoverSelect
            value={note.laneId || ''}
            options={useStore.getState().lanes.filter(l => l.projectId === (note.projectId || '')).map(l => ({ label: l.name, value: l.id }))}
            onChange={async (laneId) => {
              if (!laneId) return;
              await useStore.getState().updateNote(note.id, { laneId });
            }}
            buttonClassName="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            menuClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md"
            renderButtonLabel={(value) => {
              const lane = useStore.getState().lanes.find(l => l.id === value);
              return <span>{lane?.name || 'Lane'}</span>;
            }}
          />
        </div>

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
          <div className="flex items-center space-x-1 ml-2 pointer-events-auto">
            <ToolbarButton
              icon={<Bold className="w-4 h-4" />}
              tooltip="Bold"
              onClick={() => (onRichCommand ? onRichCommand('bold') : formatText('bold'))}
              active={contentAnalysis.boldActive}
              suggested={contentAnalysis.hasSelection}
              disabled={note.isEncrypted}
            />
            <ToolbarButton
              icon={<Italic className="w-4 h-4" />}
              tooltip="Italic"
              onClick={() => (onRichCommand ? onRichCommand('italic') : formatText('italic'))}
              active={contentAnalysis.italicActive}
              suggested={contentAnalysis.hasSelection}
              disabled={note.isEncrypted}
            />
            <ToolbarButton
              icon={<Underline className="w-4 h-4" />}
              tooltip="Underline"
              onClick={() => (onRichCommand ? onRichCommand('underline') : formatText('underline'))}
              active={contentAnalysis.underlineActive}
              disabled={note.isEncrypted}
            />
            <ToolbarButton
              icon={<Strikethrough className="w-4 h-4" />}
              tooltip="Strikethrough"
              onClick={() => (onRichCommand ? onRichCommand('strikeThrough') : formatText('strikethrough'))}
              active={contentAnalysis.strikethroughActive}
              disabled={note.isEncrypted}
            />

            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
            <ToolbarButton
              icon={<List className="w-4 h-4" />}
              tooltip="Bullet List"
              onClick={() => (onRichCommand ? onRichCommand('insertUnorderedList') : toggleLinePrefix('- '))}
              active={contentAnalysis.bulletActive}
              suggested={true}
              disabled={note.isEncrypted}
            />
            <ToolbarButton
              icon={<ListOrdered className="w-4 h-4" />}
              tooltip="Numbered List"
              onClick={() => (onRichCommand ? onRichCommand('insertOrderedList') : toggleLinePrefix('1. '))}
              active={contentAnalysis.orderedActive}
              suggested={true}
              disabled={note.isEncrypted}
            />

            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
            <ToolbarButton
              icon={<Link className="w-4 h-4" />}
              tooltip="Insert Link"
              onClick={() => (onRichCommand ? onRichCommand('createLink') : insertLink())}
              suggested={contentAnalysis.hasLinks}
              disabled={note.isEncrypted}
            />

            {/* More tools in dropdown */}
            <div className="relative">
              <ToolbarButton
                icon={<MoreHorizontal className="w-4 h-4" />}
                tooltip="More Tools"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                disabled={note.isEncrypted}
              />
              
              {showMoreMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 min-w-48">
                  <button
                    onClick={() => {
                      if (onRichCommand) onRichCommand('formatBlock', 'h1');
                      else toggleLinePrefix('# ');
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Heading1 className="w-4 h-4" />
                    <span>Heading 1</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onRichCommand) onRichCommand('formatBlock', 'h2');
                      else toggleLinePrefix('## ');
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
                      if (onRichCommand) onRichCommand('createLink');
                      else insertLink();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Link className="w-4 h-4" />
                    <span>Insert Link</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onRichCommand) onRichCommand('formatBlock', 'blockquote');
                      else toggleLinePrefix('> ');
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Quote className="w-4 h-4" />
                    <span>Quote</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onRichCommand) onRichCommand('pre');
                      else wrapCodeBlock();
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
        <ToolbarButton
          icon={<Eraser className="w-4 h-4" />}
          tooltip="Clear Formatting"
          onClick={() => { if (!note.isCodeMode) onClearFormatting?.(); }}
          disabled={note.isCodeMode}
        />
        <span className="ml-2 text-[10px] text-gray-400 select-none" title="Build marker">v-2025-09-02-b</span>
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
