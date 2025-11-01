import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useStore } from '../../hooks/useStore';

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
  const settings = useStore((state) => state.settings);

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
          className="flex-1 p-6 outline-none overflow-y-auto leading-relaxed editor-content min-h-full"
          style={{
            minHeight: '200px',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            WebkitOverflowScrolling: 'touch',
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
    </div>
  );
});

export default RichTextEditor;
