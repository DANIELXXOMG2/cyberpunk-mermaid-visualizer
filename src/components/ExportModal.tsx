import React, { useState } from 'react';
import { X, Download, FileImage, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagramElement: HTMLElement | null;
}

type ExportFormat = 'svg' | 'png' | 'pdf';
type ExportStatus = 'idle' | 'exporting' | 'success' | 'error';

export const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  diagramElement 
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('svg');
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportError, setExportError] = useState<string>('');
  const [fileName, setFileName] = useState('mermaid-diagram');

  const exportFormats = [
    {
      id: 'svg' as ExportFormat,
      name: 'SVG',
      description: 'Vector format, scalable',
      icon: FileText,
      extension: '.svg'
    },
    {
      id: 'png' as ExportFormat,
      name: 'PNG',
      description: 'Raster format, high quality',
      icon: FileImage,
      extension: '.png'
    },
    {
      id: 'pdf' as ExportFormat,
      name: 'PDF',
      description: 'Document format, printable',
      icon: FileText,
      extension: '.pdf'
    }
  ];

  const exportAsSVG = async (): Promise<void> => {
    if (!diagramElement) throw new Error('No diagram element found');
    
    const svgElement = diagramElement.querySelector('svg');
    if (!svgElement) throw new Error('No SVG element found in diagram');
    
    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    
    // Add cyberpunk styling to the exported SVG
    clonedSvg.style.background = '#0a0a0a';
    clonedSvg.style.fontFamily = 'JetBrains Mono, monospace';
    
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.svg`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const exportAsPNG = async (): Promise<void> => {
    if (!diagramElement) throw new Error('No diagram element found');
    
    const canvas = await html2canvas(diagramElement, {
      backgroundColor: '#0a0a0a',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true
    });
    
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Failed to create PNG blob');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.png`;
      link.click();
      
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const exportAsPDF = async (): Promise<void> => {
    if (!diagramElement) throw new Error('No diagram element found');
    
    const canvas = await html2canvas(diagramElement, {
      backgroundColor: '#0a0a0a',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}.pdf`);
  };

  const handleExport = async () => {
    if (!diagramElement) {
      setExportError('No diagram to export');
      setExportStatus('error');
      return;
    }

    setExportStatus('exporting');
    setExportError('');

    try {
      switch (selectedFormat) {
        case 'svg':
          await exportAsSVG();
          break;
        case 'png':
          await exportAsPNG();
          break;
        case 'pdf':
          await exportAsPDF();
          break;
      }
      
      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
        onClose();
      }, 2000);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
      setExportStatus('error');
    }
  };

  const resetModal = () => {
    setExportStatus('idle');
    setExportError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative cyberpunk-panel w-full max-w-lg mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold glitch-text" data-text="EXPORT DIAGRAM">
            EXPORT DIAGRAM
          </h2>
          <button
            onClick={handleClose}
            className="cyberpunk-button p-2"
          >
            <X size={16} />
          </button>
        </div>

        {/* File Name */}
        <div className="mb-6">
          <label className="block text-sm text-cyberpunk-primary mb-2 uppercase tracking-wider">
            FILE NAME
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
            className="cyberpunk-input w-full"
            placeholder="Enter file name..."
          />
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm text-cyberpunk-primary mb-3 uppercase tracking-wider">
            EXPORT FORMAT
          </label>
          <div className="grid grid-cols-1 gap-3">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`cyberpunk-panel p-4 text-left transition-all ${
                    selectedFormat === format.id
                      ? 'border-cyberpunk-primary bg-cyberpunk-primary/10'
                      : 'border-cyberpunk-primary/30 hover:border-cyberpunk-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-cyberpunk-primary" />
                    <div>
                      <div className="font-bold text-cyberpunk-primary">
                        {format.name}
                      </div>
                      <div className="text-xs text-cyberpunk-primary/70">
                        {format.description}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedFormat === format.id
                          ? 'border-cyberpunk-primary bg-cyberpunk-primary'
                          : 'border-cyberpunk-primary/30'
                      }`} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Export Status */}
        {exportStatus !== 'idle' && (
          <div className="mb-6">
            {exportStatus === 'exporting' && (
              <div className="flex items-center gap-2 text-cyberpunk-accent">
                <Loader2 size={16} className="animate-spin" />
                <span>EXPORTING...</span>
              </div>
            )}
            
            {exportStatus === 'success' && (
              <div className="flex items-center gap-2 text-cyberpunk-success">
                <CheckCircle size={16} />
                <span>EXPORT SUCCESSFUL</span>
              </div>
            )}
            
            {exportStatus === 'error' && (
              <div className="cyberpunk-panel bg-cyberpunk-error/10 border-cyberpunk-error/30 p-3">
                <div className="flex items-center gap-2 text-cyberpunk-error">
                  <AlertCircle size={16} />
                  <span>EXPORT FAILED</span>
                </div>
                {exportError && (
                  <div className="text-xs text-cyberpunk-error/80 mt-1">
                    {exportError}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-cyberpunk-primary/20">
          <div className="text-xs text-cyberpunk-primary/70">
            {fileName}{exportFormats.find(f => f.id === selectedFormat)?.extension}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="cyberpunk-button"
              disabled={exportStatus === 'exporting'}
            >
              CANCEL
            </button>
            <button
              onClick={handleExport}
              className="cyberpunk-button border-cyberpunk-success text-cyberpunk-success hover:bg-cyberpunk-success hover:text-cyberpunk-bg flex items-center gap-2"
              disabled={exportStatus === 'exporting' || !fileName.trim()}
            >
              {exportStatus === 'exporting' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              EXPORT
            </button>
          </div>
        </div>
      </div>
      
      {/* Cyberpunk effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-cyberpunk-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-cyberpunk-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
};