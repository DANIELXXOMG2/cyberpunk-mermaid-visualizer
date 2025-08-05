import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { Toaster, toast } from 'sonner';
import { useStore } from './store/useStore';
import { CodeEditor } from './components/CodeEditor';
import { DiagramViewer } from './components/DiagramViewer';
import { Toolbar } from './components/Toolbar';
import { useHistory, useHistoryKeyboard } from './hooks/useHistory';
import { AiService } from './services/aiService';

// Lazy load heavy components for better performance
const SettingsModal = lazy(() => import('./components/SettingsModal').then(module => ({ default: module.SettingsModal })));
const ExportModal = lazy(() => import('./components/ExportModal').then(module => ({ default: module.ExportModal })));

// Loading component for Suspense fallback
const ModalLoader = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 shadow-2xl">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
        <span className="text-cyan-400 font-medium">Loading...</span>
      </div>
    </div>
  </div>
);

function App() {
  const { 
    code, 
    setCode, 
    isSettingsOpen, 
    setIsSettingsOpen,
    isExportOpen,
    setIsExportOpen,
    geminiApiKey
  } = useStore();
  
  const diagramRef = useRef<HTMLDivElement>(null);
  const [isAiFixing, setIsAiFixing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // History management
  const {
    canUndo,
    canRedo,
    addEntry,
    undo,
    redo
  } = useHistory(code);

  // Handle code changes with history
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    // Debounce history entries
    const timer = setTimeout(() => {
      addEntry(newCode, 'Manual edit');
    }, 1000);
    return () => clearTimeout(timer);
  }, [setCode, addEntry]);

  // Handle undo/redo
  const handleUndo = useCallback(() => {
    const previousCode = undo();
    if (previousCode !== null) {
      setCode(previousCode);
      toast.info('Undo applied', { duration: 1000 });
    }
  }, [undo, setCode]);

  const handleRedo = useCallback(() => {
    const nextCode = redo();
    if (nextCode !== null) {
      setCode(nextCode);
      toast.info('Redo applied', { duration: 1000 });
    }
  }, [redo, setCode]);

  // Keyboard shortcuts
  const { handleKeyDown } = useHistoryKeyboard(handleUndo, handleRedo);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle AI fix
  const handleAiFix = useCallback(async () => {
    if (!geminiApiKey.trim()) {
      toast.error('API Key Required', {
        description: 'Please configure your Gemini API key in settings.',
        duration: 5000,
      });
      setIsSettingsOpen(true);
      return;
    }

    if (!code.trim()) {
      toast.error('No Code to Fix', {
        description: 'Please enter some Mermaid code first.',
        duration: 3000,
      });
      return;
    }

    setIsAiFixing(true);
    
    try {
      const result = await AiService.fixMermaidCode(code, geminiApiKey, errorMessage);
      
      if (result.success && result.fixedCode) {
        // Add current code to history before applying fix
        addEntry(code, 'Before AI fix');
        
        // Apply the fix
        setCode(result.fixedCode);
        addEntry(result.fixedCode, 'AI fix applied');
        
        AiService.showAiFixToast(result);
      } else {
        AiService.showAiFixToast(result);
      }
    } catch {
      toast.error('AI Fix Failed', {
        description: 'An unexpected error occurred.',
        duration: 5000,
      });
    } finally {
      setIsAiFixing(false);
    }
  }, [code, geminiApiKey, errorMessage, addEntry, setCode, setIsSettingsOpen]);

  // Handle diagram errors
  const handleDiagramError = useCallback((error: string) => {
    setHasError(true);
    setErrorMessage(error);
  }, []);

  const handleDiagramSuccess = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
  }, []);

  return (
    <div className="min-h-screen bg-cyberpunk-bg text-cyberpunk-text font-mono">
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyberpunk-primary/5 via-transparent to-cyberpunk-secondary/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyberpunk-primary to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyberpunk-secondary to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="scanline" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="cyberpunk-panel border-b border-cyberpunk-primary/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold glitch-text" data-text="MERMAID FLOW AI">
                MERMAID FLOW AI
              </h1>
              <p className="text-sm text-cyberpunk-primary/70 mt-1">
                FUTURISTIC LIVE EDITOR • AI-POWERED • REAL-TIME RENDERING
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-xs text-cyberpunk-primary/50">
                {geminiApiKey ? '🤖 AI READY' : '⚠️ NO API KEY'}
              </div>
              <div className="text-xs text-cyberpunk-primary/60">
                by{' '}
                <a 
                  href="https://github.com/danielxxomg2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyberpunk-primary hover:text-cyberpunk-secondary underline transition-colors"
                >
                  danielxxomg
                </a>
                {' '}(
                <a 
                  href="https://github.com/danielxxomg/cyberpunk-mermaid-visualizer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyberpunk-primary hover:text-cyberpunk-secondary underline transition-colors"
                >
                  code
                </a>
                )
              </div>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <Toolbar
          onUndo={handleUndo}
          onRedo={handleRedo}
          onAiFix={handleAiFix}
          onSettings={() => setIsSettingsOpen(true)}
          onExport={() => setIsExportOpen(true)}
          canUndo={canUndo}
          canRedo={canRedo}
          isAiFixing={isAiFixing}
          hasError={hasError}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor Panel */}
          <div className="w-1/2 cyberpunk-panel border-r border-cyberpunk-primary/30">
            <div className="h-full flex flex-col">
              <div className="cyberpunk-border p-2 border-b border-cyberpunk-primary/20">
                <h2 className="text-sm font-bold text-cyberpunk-primary uppercase tracking-wider">
                  CODE EDITOR
                </h2>
              </div>
              <div className="flex-1">
                <CodeEditor 
                  value={code}
                  onChange={handleCodeChange}
                />
              </div>
            </div>
          </div>

          {/* Diagram Viewer Panel */}
          <div className="w-1/2 cyberpunk-panel">
            <div className="h-full flex flex-col">
              <div className="cyberpunk-border p-2 border-b border-cyberpunk-primary/20">
                <h2 className="text-sm font-bold text-cyberpunk-primary uppercase tracking-wider">
                  LIVE PREVIEW
                </h2>
              </div>
              <div className="flex-1">
                <DiagramViewer 
                  ref={diagramRef}
                  code={code}
                  onError={handleDiagramError}
                  onSuccess={handleDiagramSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals with Lazy Loading */}
      <Suspense fallback={isSettingsOpen ? <ModalLoader /> : null}>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </Suspense>
      
      <Suspense fallback={isExportOpen ? <ModalLoader /> : null}>
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          diagramElement={diagramRef.current}
        />
      </Suspense>

      {/* Toaster for notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            border: '1px solid #00ff88',
            color: '#00ff88',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px'
          }
        }}
      />
    </div>
  );
}

export default App;
