// File: components/ScaledPreview.tsx
import React, { useEffect, useRef, useState } from 'react';

interface ScaledPreviewProps {
  html: string;
  loading?: boolean;
}

export const ScaledPreview: React.FC<ScaledPreviewProps> = ({ html, loading = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Calculate scale to fit 1920px into the current width
        setScale(width / 1920);
      }
    };
    
    // Initial calc
    updateScale();

    // Observe resize
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-100">
      {loading ? (
        <div className="flex items-center justify-center h-full text-slate-300">
           <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : html ? (
        <div 
          className="absolute top-0 left-0 origin-top-left pointer-events-none select-none bg-white shadow-sm"
          style={{ width: 1920, height: 1080, transform: `scale(${scale})`, lineHeight: 1.2}}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-slate-300">
           <span className="text-4xl font-thin opacity-50">Aa</span>
        </div>
      )}
    </div>
  );
};