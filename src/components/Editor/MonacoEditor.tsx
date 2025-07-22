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
  const [isReady, setIsReady] = React.useState(false);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setIsReady(true);
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (isReady && value !== undefined) {
      onChange(value);
    }
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
        onChange={handleEditorChange}
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
          readOnly: false,
          domReadOnly: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
};

export default MonacoEditor;