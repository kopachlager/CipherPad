import React, { useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { useStore } from '../../hooks/useStore';
import { detectLanguage } from '../../utils/helpers';

interface MonacoEditorProps {
  note: any;
  onChange: (value: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ note, onChange }) => {
  const { settings } = useStore();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Focus the editor
    editor.focus();
  };

  const theme = settings.theme === 'dark' || 
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) 
    ? 'vs-dark' : 'vs';
  const language = note.isCodeMode ? (note.language || 'plaintext') : 'plaintext';

  return (
    <div className="flex-1 relative">
      <Editor
        height="100%"
        language={language}
        value={note.content}
        theme={theme}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize: settings.fontSize,
          lineHeight: settings.lineHeight,
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 20, bottom: 20 },
          lineNumbers: note.isCodeMode ? 'on' : 'off',
          glyphMargin: false,
          folding: note.isCodeMode,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'line',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          suggest: {
            showKeywords: note.isCodeMode,
            showSnippets: note.isCodeMode,
          },
          contextmenu: true,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default MonacoEditor;