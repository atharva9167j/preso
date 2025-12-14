import React, { useState } from 'react';
import { Download, FileText, File, Image, X } from 'lucide-react';
import { Deck } from '../types';
import { exportPresentation } from '../services/export';

interface ExportMenuProps {
  deck: Deck;
  currentSlideIndex: number;
  onClose: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ deck, currentSlideIndex, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'pdf' | 'pptx' | 'image' | null>(null);

  const handleExport = async (format: 'html' | 'pdf' | 'pptx' | 'image') => {
    setIsExporting(true);
    setExportFormat(format);
    
    try {
      await exportPresentation(deck, format, format === 'image' ? currentSlideIndex : undefined);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
      // Don't close immediately so user can see success
      setTimeout(() => onClose(), 500);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in z-[999999]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Download className="text-indigo-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Export Presentation</h2>
              <p className="text-sm text-slate-500">{deck.slides.length} slides</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            disabled={isExporting}
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <ExportOption
            icon={FileText}
            title="HTML Document"
            description="Interactive presentation with navigation"
            format="html"
            onExport={handleExport}
            isExporting={isExporting && exportFormat === 'html'}
            disabled={isExporting}
          />
          
          <ExportOption
            icon={File}
            title="PDF Document"
            description="Print-ready format, one page per slide"
            format="pdf"
            onExport={handleExport}
            isExporting={isExporting && exportFormat === 'pdf'}
            disabled={isExporting}
          />
          
          <ExportOption
            icon={File}
            title="PowerPoint (PPTX)"
            description="Editable presentation format"
            format="pptx"
            onExport={handleExport}
            isExporting={isExporting && exportFormat === 'pptx'}
            disabled={isExporting}
            badge="Beta"
          />
          
          <ExportOption
            icon={Image}
            title="Current Slide as Image"
            description={`Export slide #${currentSlideIndex + 1} as PNG`}
            format="image"
            onExport={handleExport}
            isExporting={isExporting && exportFormat === 'image'}
            disabled={isExporting}
          />
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> For best results with PDF, use Chrome or Edge browser.
            Charts and images will be preserved in all formats.
          </p>
        </div>
      </div>
    </div>
  );
};

interface ExportOptionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  format: 'html' | 'pdf' | 'pptx' | 'image';
  onExport: (format: 'html' | 'pdf' | 'pptx' | 'image') => void;
  isExporting: boolean;
  disabled: boolean;
  badge?: string;
}

const ExportOption: React.FC<ExportOptionProps> = ({
  icon: Icon,
  title,
  description,
  format,
  onExport,
  isExporting,
  disabled,
  badge
}) => {
  return (
    <button
      onClick={() => onExport(format)}
      disabled={disabled}
      className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all group ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-slate-200'
          : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
      }`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        disabled
          ? 'bg-slate-100'
          : 'bg-slate-100 group-hover:bg-indigo-100'
      }`}>
        {isExporting ? (
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Icon size={24} className={disabled ? 'text-slate-400' : 'text-slate-600 group-hover:text-indigo-600'} />
        )}
      </div>
      
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      
      {!disabled && !isExporting && (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 group-hover:bg-indigo-600 transition-colors flex-shrink-0 mt-2">
          <Download size={14} className="text-slate-600 group-hover:text-white" />
        </div>
      )}
      
      {isExporting && (
        <div className="text-xs font-semibold text-indigo-600 mt-2">Exporting...</div>
      )}
    </button>
  );
};