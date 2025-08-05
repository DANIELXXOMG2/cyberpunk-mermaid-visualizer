import { useState, useCallback, useRef } from 'react';

export interface HistoryEntry {
  id: string;
  code: string;
  timestamp: number;
  description?: string;
}

export interface UseHistoryReturn {
  history: HistoryEntry[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  addEntry: (code: string, description?: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  clear: () => void;
  getCurrentEntry: () => HistoryEntry | null;
}

const MAX_HISTORY_SIZE = 50;

export const useHistory = (initialCode: string = ''): UseHistoryReturn => {
  const [history, setHistory] = useState<HistoryEntry[]>(() => [
    {
      id: 'initial',
      code: initialCode,
      timestamp: Date.now(),
      description: 'Initial state'
    }
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastAddedCode = useRef(initialCode);

  const addEntry = useCallback((code: string, description?: string) => {
    // Don't add if code hasn't changed
    if (code === lastAddedCode.current) {
      return;
    }

    lastAddedCode.current = code;

    setHistory(prev => {
      // Remove any entries after current index (when adding after undo)
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new entry
      const newEntry: HistoryEntry = {
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        code,
        timestamp: Date.now(),
        description
      };
      
      newHistory.push(newEntry);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(-MAX_HISTORY_SIZE);
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => {
      const newIndex = Math.min(prev + 1, MAX_HISTORY_SIZE - 1);
      return newIndex;
    });
  }, [currentIndex]);

  const undo = useCallback((): string | null => {
    if (currentIndex <= 0) return null;
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    
    const entry = history[newIndex];
    if (entry) {
      lastAddedCode.current = entry.code;
      return entry.code;
    }
    
    return null;
  }, [currentIndex, history]);

  const redo = useCallback((): string | null => {
    if (currentIndex >= history.length - 1) return null;
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    
    const entry = history[newIndex];
    if (entry) {
      lastAddedCode.current = entry.code;
      return entry.code;
    }
    
    return null;
  }, [currentIndex, history]);

  const clear = useCallback(() => {
    const currentEntry = history[currentIndex];
    const newHistory = currentEntry ? [currentEntry] : [
      {
        id: 'cleared',
        code: '',
        timestamp: Date.now(),
        description: 'Cleared'
      }
    ];
    
    setHistory(newHistory);
    setCurrentIndex(0);
    lastAddedCode.current = newHistory[0].code;
  }, [history, currentIndex]);

  const getCurrentEntry = useCallback((): HistoryEntry | null => {
    return history[currentIndex] || null;
  }, [history, currentIndex]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    history,
    currentIndex,
    canUndo,
    canRedo,
    addEntry,
    undo,
    redo,
    clear,
    getCurrentEntry
  };
};

// Hook for keyboard shortcuts
export const useHistoryKeyboard = (onUndo: () => void, onRedo: () => void) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        onUndo();
      } else if ((event.key === 'y') || (event.key === 'z' && event.shiftKey)) {
        event.preventDefault();
        onRedo();
      }
    }
  }, [onUndo, onRedo]);

  return { handleKeyDown };
};