import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, AlertTriangle, Key, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { geminiApiKey, setGeminiApiKey } = useStore();
  const [localApiKey, setLocalApiKey] = useState(geminiApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalApiKey(geminiApiKey);
      setValidationResult(null);
    }
  }, [isOpen, geminiApiKey]);

  const validateApiKey = async (key: string) => {
    if (!key.trim()) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    try {
      // Basic validation - check if it looks like a valid API key
      const isValidFormat = /^[A-Za-z0-9_-]{20,}$/.test(key.trim());
      
      // Simulate API validation (in real implementation, you'd test with Gemini API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setValidationResult(isValidFormat ? 'valid' : 'invalid');
    } catch (error) {
      setValidationResult('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setLocalApiKey(value);
    setValidationResult(null);
    
    // Debounce validation
    const timer = setTimeout(() => validateApiKey(value), 500);
    return () => clearTimeout(timer);
  };

  const handleSave = () => {
    setGeminiApiKey(localApiKey.trim());
    onClose();
  };

  const handleClear = () => {
    setLocalApiKey('');
    setGeminiApiKey('');
    setValidationResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative cyberpunk-panel w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold glitch-text" data-text="SYSTEM CONFIG">
            SYSTEM CONFIG
          </h2>
          <button
            onClick={onClose}
            className="cyberpunk-button p-2"
          >
            <X size={16} />
          </button>
        </div>

        {/* API Key Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-cyberpunk-primary">
            <Key size={16} />
            <span className="text-sm uppercase tracking-wider">GEMINI API KEY</span>
          </div>
          
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={localApiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className={`cyberpunk-input w-full pr-20 ${
                validationResult === 'valid' 
                  ? 'border-cyberpunk-success' 
                  : validationResult === 'invalid' 
                  ? 'border-cyberpunk-error' 
                  : ''
              }`}
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isValidating && (
                <div className="w-4 h-4 border-2 border-cyberpunk-primary border-t-transparent rounded-full animate-spin" />
              )}
              
              {validationResult === 'valid' && (
                <div className="w-4 h-4 text-cyberpunk-success">✓</div>
              )}
              
              {validationResult === 'invalid' && (
                <div className="w-4 h-4 text-cyberpunk-error">✗</div>
              )}
              
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-cyberpunk-primary/70 hover:text-cyberpunk-primary"
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          {/* Security Warning */}
          <div className="cyberpunk-panel bg-cyberpunk-accent/10 border-cyberpunk-accent/30 p-3">
            <div className="flex items-start gap-2">
              <Shield size={16} className="text-cyberpunk-accent mt-0.5 flex-shrink-0" />
              <div className="text-xs text-cyberpunk-accent">
                <div className="font-bold mb-1">SECURITY PROTOCOL</div>
                <div className="space-y-1 text-cyberpunk-accent/80">
                  <div>• API key is stored locally in your browser</div>
                  <div>• Never shared with our servers</div>
                  <div>• Recommended to delete after use</div>
                  <div>• Use a restricted API key when possible</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* How to get API key */}
          <div className="text-xs text-cyberpunk-primary/70">
            <div className="mb-2">HOW TO GET GEMINI API KEY:</div>
            <div className="space-y-1">
              <div>1. <a href="https://aistudio.google.com/app/welcome" target="_blank" rel="noopener noreferrer" className="text-cyberpunk-primary hover:text-cyberpunk-secondary underline transition-colors">Visit Google AI Studio</a></div>
              <div>2. Create a new API key</div>
              <div>3. Copy and paste it here</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyberpunk-primary/20">
          <button
            onClick={handleClear}
            className="cyberpunk-button text-cyberpunk-error border-cyberpunk-error hover:bg-cyberpunk-error hover:text-cyberpunk-bg"
            disabled={!localApiKey.trim()}
          >
            CLEAR
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="cyberpunk-button"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="cyberpunk-button border-cyberpunk-success text-cyberpunk-success hover:bg-cyberpunk-success hover:text-cyberpunk-bg"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
      
      {/* Cyberpunk effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyberpunk-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyberpunk-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};