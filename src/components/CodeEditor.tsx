import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onError?: (error: string | null) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onError,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Configure Mermaid language support
    monaco.languages.register({ id: 'mermaid' });
    
    // Define Mermaid syntax highlighting
    monaco.languages.setMonarchTokensProvider('mermaid', {
      tokenizer: {
        root: [
          [/\b(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gitgraph|pie|quadrantChart|requirement|mindmap|timeline|zenuml|sankey|block|packet)\b/, 'keyword'],
          [/\b(TD|TB|BT|RL|LR)\b/, 'type'],
          [/\b(participant|actor|note|loop|alt|opt|par|critical|break|rect|activate|deactivate)\b/, 'keyword'],
          [/\[(.*?)\]/, 'string'],
          [/\{(.*?)\}/, 'string'],
          [/\((.*?)\)/, 'string'],
          [/\"(.*?)\"|'(.*?)'/, 'string'],
          [/-->|->|==|=|\|\||\|/, 'operator'],
          [/%%.*$/, 'comment'],
          [/\d+/, 'number'],
        ],
      },
    });
    
    // Set theme
    monaco.editor.defineTheme('cyberpunk', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '00FFFF', fontStyle: 'bold' },
        { token: 'type', foreground: 'FF00FF' },
        { token: 'string', foreground: 'FFFF00' },
        { token: 'operator', foreground: '00FFFF' },
        { token: 'comment', foreground: '666666', fontStyle: 'italic' },
        { token: 'number', foreground: 'FF00FF' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#00FFFF',
        'editor.lineHighlightBackground': '#00FFFF08',
        'editor.selectionBackground': '#00FFFF20',
        'editor.inactiveSelectionBackground': '#00FFFF10',
        'editorLineNumber.foreground': '#00FFFF60',
        'editorLineNumber.activeForeground': '#00FFFF',
        'editorCursor.foreground': '#00FFFF',
        'editor.findMatchBackground': '#FF00FF40',
        'editor.findMatchHighlightBackground': '#FF00FF20',
        'editorWidget.background': '#0D1117',
        'editorWidget.border': '#00FFFF',
        'editorSuggestWidget.background': '#0D1117',
        'editorSuggestWidget.border': '#00FFFF',
        'editorSuggestWidget.foreground': '#00FFFF',
        'editorSuggestWidget.selectedBackground': '#00FFFF20',
      },
    });
    
    monaco.editor.setTheme('cyberpunk');
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <div className="h-full relative">
      <Editor
        height="100%"
        language="mermaid"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontFamily: 'Fira Code, Source Code Pro, monospace',
          fontSize: 14,
          lineHeight: 1.6,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          contextmenu: true,
          mouseWheelZoom: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
        }}
      />
      
      {/* Cyberpunk overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyberpunk-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyberpunk-primary/30 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyberpunk-primary/30 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyberpunk-primary/30 to-transparent" />
      </div>
    </div>
  );
};