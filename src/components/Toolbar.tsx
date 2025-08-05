import React from 'react';
import { 
  Undo2, 
  Redo2, 
  Bot, 
  Settings, 
  Download, 
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onAiFix: () => void;
  onSettings: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isAiFixing: boolean;
  hasError: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onUndo,
  onRedo,
  onAiFix,
  onSettings,
  onExport,
  canUndo,
  canRedo,
  isAiFixing,
  hasError,
}) => {
  return (
    <div className="cyberpunk-panel border-b border-cyberpunk-primary/30 p-2">
      <div className="flex items-center justify-between">
        {/* Left side - History controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`cyberpunk-button p-2 text-xs ${
              !canUndo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
            <span className="ml-1 hidden sm:inline">UNDO</span>
          </button>
          
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`cyberpunk-button p-2 text-xs ${
              !canRedo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
            <span className="ml-1 hidden sm:inline">REDO</span>
          </button>
        </div>

        {/* Center - AI Fix button */}
        <div className="flex items-center gap-2">
          {hasError && (
            <div className="flex items-center gap-2 text-cyberpunk-error text-xs">
              <AlertTriangle size={16} className="animate-pulse" />
              <span className="hidden sm:inline">SYNTAX ERROR DETECTED</span>
            </div>
          )}
          
          <button
            onClick={onAiFix}
            disabled={isAiFixing}
            className={`cyberpunk-button p-2 text-xs relative ${
              hasError 
                ? 'border-cyberpunk-error text-cyberpunk-error hover:bg-cyberpunk-error hover:text-cyberpunk-bg animate-pulse' 
                : ''
            }`}
            title="Fix with AI (Gemini)"
          >
            {isAiFixing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Bot size={16} />
            )}
            <span className="ml-1 hidden sm:inline">
              {isAiFixing ? 'FIXING...' : 'FIX WITH AI'}
            </span>
            
            {hasError && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyberpunk-error rounded-full animate-ping" />
            )}
          </button>
        </div>

        {/* Right side - Settings and Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="cyberpunk-button p-2 text-xs"
            title="Export Diagram"
          >
            <Download size={16} />
            <span className="ml-1 hidden sm:inline">EXPORT</span>
          </button>
          
          <button
            onClick={onSettings}
            className="cyberpunk-button p-2 text-xs"
            title="Settings"
          >
            <Settings size={16} />
            <span className="ml-1 hidden sm:inline">CONFIG</span>
          </button>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="mt-2 pt-2 border-t border-cyberpunk-primary/20">
        <div className="flex items-center justify-between text-xs text-cyberpunk-primary/70">
          <div className="flex items-center gap-4">
            <span>STATUS: {hasError ? 'ERROR' : 'READY'}</span>
            <span>MODE: LIVE_EDIT</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span>ENGINE: MERMAID.JS</span>
            <span>AI: {isAiFixing ? 'ACTIVE' : 'STANDBY'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};