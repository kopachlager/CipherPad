import React, { useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { useStore } from '../../hooks/useStore';

interface MonacoEditorProps {
  note: any;
  onChange: (value: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ note, onChange }) => {
  const { settings } = useStore();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
    
    // Ensure editor is editable
    editor.updateOptions({
      readOnly: false,
    });

    // Define custom themes
    const monaco = editor.getModel()?.getLanguageService?.() || window.monaco;
    if (monaco?.editor) {
      // Light monochromatic theme
      monaco.editor.defineTheme('light-mono', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: '', foreground: '1f2937', background: 'ffffff' },
          { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
          { token: 'keyword', foreground: '374151', fontStyle: 'bold' },
          { token: 'string', foreground: '4b5563' },
          { token: 'number', foreground: '374151' },
        ],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#1f2937',
          'editor.lineHighlightBackground': '#f9fafb',
          'editor.selectionBackground': '#e5e7eb',
          'editor.inactiveSelectionBackground': '#f3f4f6',
          'editorCursor.foreground': '#1f2937',
          'editorLineNumber.foreground': '#9ca3af',
          'editorLineNumber.activeForeground': '#4b5563',
        }
      });

      // Dark monochromatic theme
      monaco.editor.defineTheme('dark-mono', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: 'f9fafb', background: '111827' },
          { token: 'comment', foreground: '9ca3af', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'e5e7eb', fontStyle: 'bold' },
          { token: 'string', foreground: 'd1d5db' },
          { token: 'number', foreground: 'e5e7eb' },
        ],
        colors: {
          'editor.background': '#111827',
          'editor.foreground': '#f9fafb',
          'editor.lineHighlightBackground': '#1f2937',
          'editor.selectionBackground': '#374151',
          'editor.inactiveSelectionBackground': '#1f2937',
          'editorCursor.foreground': '#f9fafb',
          'editorLineNumber.foreground': '#6b7280',
          'editorLineNumber.activeForeground': '#9ca3af',
        }
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const isDark = settings.theme === 'dark' || 
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = isDark ? 'dark-mono' : 'light-mono';
  
  const language = note.isCodeMode ? (note.language || 'plaintext') : 'plaintext';

  return (
    <div className="flex-1 relative overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={note.content}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: settings.fontSize,
          lineHeight: settings.lineHeight,
          fontFamily: note.isCodeMode ? settings.fontFamily : 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          wordWrap: 'on',
          wordWrapColumn: 80,
          wrappingIndent: 'indent',
          wrappingStrategy: 'advanced',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 20, bottom: 20 },
          lineNumbers: note.isCodeMode ? 'on' : 'off',
          lineNumbersMinChars: 3,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },
          contextmenu: true,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
          cursorBlinking: 'blink',
          renderLineHighlight: 'line',
          smoothScrolling: true,
          mouseWheelScrollSensitivity: 1,
          fastScrollSensitivity: 5,
        }}
      />
    </div>
  );
};

export default MonacoEditor;