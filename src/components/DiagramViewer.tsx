import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

interface DiagramViewerProps {
  code: string;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export const DiagramViewer = React.forwardRef<HTMLDivElement, DiagramViewerProps>(({ 
  code, 
  onError, 
  onSuccess 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const combinedRef = useRef<HTMLDivElement>(null);

  // Combine external ref with internal ref
  React.useImperativeHandle(ref, () => combinedRef.current!, []);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Configure Mermaid with cyberpunk theme
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#00FFFF',
        primaryTextColor: '#00FFFF',
        primaryBorderColor: '#00FFFF',
        lineColor: '#00FFFF',
        secondaryColor: '#FF00FF',
        tertiaryColor: '#FFFF00',
        background: '#0D1117',
        mainBkg: '#0D1117',
        secondBkg: '#1a1a1a',
        tertiaryBkg: '#2a2a2a',
        darkMode: true,
        fontFamily: 'Fira Code, Source Code Pro, monospace',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
      },
      sequence: {
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
      },
      gantt: {
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        sectionFontSize: 11,
        numberSectionStyles: 4,
      },
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code.trim() || !containerRef.current) return;

      setIsLoading(true);
      onError?.(null);

      try {
        // Clear previous diagram
        containerRef.current.innerHTML = '';
        
        // Generate unique ID for this diagram
        const diagramId = `diagram-${Date.now()}`;
        
        // Validate and render the diagram
        const { svg } = await mermaid.render(diagramId, code);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Apply cyberpunk styling to the SVG
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.transform = `scale(${zoom})`;
            svgElement.style.transformOrigin = 'center';
            
            // Add glow effects to paths and text
            const paths = svgElement.querySelectorAll('path, line, rect, circle, ellipse');
            paths.forEach((path) => {
              (path as SVGElement).style.filter = 'drop-shadow(0 0 3px currentColor)';
            });
            
            const texts = svgElement.querySelectorAll('text');
            texts.forEach((text) => {
              (text as SVGElement).style.filter = 'drop-shadow(0 0 2px currentColor)';
            });
          }
        }
        onSuccess?.();
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error rendering diagram';
        onError?.(errorMessage);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full text-cyberpunk-error">
              <div class="text-center">
                <div class="text-6xl mb-4">⚠️</div>
                <div class="text-lg font-bold mb-2">SYNTAX ERROR DETECTED</div>
                <div class="text-sm opacity-70">${error instanceof Error ? error.message : 'Invalid Mermaid syntax'}</div>
                <div class="mt-4 text-xs text-cyberpunk-accent">
                  Click the 🤖 button to fix with AI
                </div>
              </div>
            </div>
          `;
        }
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(renderDiagram, 300);
    return () => clearTimeout(debounceTimer);
  }, [code, zoom, onError, onSuccess]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      ref={combinedRef}
      className={`h-full relative bg-cyberpunk-bg/50 ${isFullscreen ? 'fixed inset-0 z-50 bg-cyberpunk-bg' : ''}`}
    >
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <button
          onClick={handleZoomOut}
          className="cyberpunk-button p-2 text-xs"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleResetZoom}
          className="cyberpunk-button p-2 text-xs"
          title="Reset Zoom"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={handleZoomIn}
          className="cyberpunk-button p-2 text-xs"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="cyberpunk-button p-2 text-xs"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-2 left-2 z-10 text-xs text-cyberpunk-primary/70 font-mono">
        ZOOM: {Math.round(zoom * 100)}%
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyberpunk-bg/80 z-20">
          <div className="text-cyberpunk-primary animate-pulse">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm uppercase tracking-wider">RENDERING...</div>
          </div>
        </div>
      )}

      {/* Diagram container */}
      <div 
        ref={containerRef}
        className="h-full w-full flex items-center justify-center overflow-auto p-4"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* Cyberpunk grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyberpunk-primary/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyberpunk-primary/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyberpunk-primary/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyberpunk-primary/50" />
    </div>
  );
});

DiagramViewer.displayName = 'DiagramViewer';