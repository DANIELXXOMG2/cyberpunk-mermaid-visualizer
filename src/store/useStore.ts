import { create } from 'zustand';

interface AppState {
  // Code and history
  code: string;
  history: string[];
  historyIndex: number;
  
  // UI state
  isSettingsOpen: boolean;
  isExportOpen: boolean;
  
  // API configuration
  geminiApiKey: string;
  
  // Actions
  setCode: (code: string) => void;
  addToHistory: (code: string) => void;
  undo: () => void;
  redo: () => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setIsExportOpen: (isOpen: boolean) => void;
  setGeminiApiKey: (key: string) => void;
}

const DEFAULT_CODE = `graph TD
    A[Inicio] --> B[Proceso]
    B --> C{Decisión}
    C -->|Sí| D[Acción 1]
    C -->|No| E[Acción 2]
    D --> F[Fin]
    E --> F`;

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  code: DEFAULT_CODE,
  history: [DEFAULT_CODE],
  historyIndex: 0,
  isSettingsOpen: false,
  isExportOpen: false,
  geminiApiKey: '',
  
  // Actions
  setCode: (code: string) => {
    set({ code });
  },
  
  addToHistory: (code: string) => {
    const { history, historyIndex } = get();
    
    // Don't add if it's the same as current
    if (history[historyIndex] === code) return;
    
    // Remove any history after current index
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(code);
    
    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        historyIndex: newIndex,
        code: history[newIndex],
      });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        historyIndex: newIndex,
        code: history[newIndex],
      });
    }
  },
  
  setIsSettingsOpen: (isOpen: boolean) => {
    set({ isSettingsOpen: isOpen });
  },
  
  setIsExportOpen: (isOpen: boolean) => {
    set({ isExportOpen: isOpen });
  },
  
  setGeminiApiKey: (key: string) => {
    set({ geminiApiKey: key });
  },
}));