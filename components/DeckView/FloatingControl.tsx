import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Play, Sparkles, X } from 'lucide-react';
import { Button } from '../Button';

interface FloatingControlsProps {
  zoom: number;
  setZoom: (fn: (z: number) => number) => void;
  onPresent: () => void;
  onGlobalRemix: (instruction: string) => void;
  isWorking: boolean;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  zoom,
  setZoom,
  onPresent,
  onGlobalRemix,
  isWorking
}) => {
  const [isGlobalEditOpen, setIsGlobalEditOpen] = useState(false);
  const [instruction, setInstruction] = useState("");

  return (
    <>
      <div className="absolute bottom-6 ml-24 left-1/2 -translate-x-1/2 bg-white/90 p-1 rounded-full shadow-2xl border border-slate-200 flex items-center gap-1 z-[9999]">
        <button onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ZoomOut size={16} /></button>
        <span className="text-xs font-mono font-bold text-slate-400 w-8 text-center">{Math.round(zoom * 100)}</span>
        <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ZoomIn size={16} /></button>
        
        <div className="w-px bg-slate-200 h-6 mx-1" />
        
        <button onClick={onPresent} className="p-2 hover:bg-indigo-50 rounded-full text-indigo-600 transition" title="Start Presentation">
          <Play size={16} fill="currentColor" />
        </button>
        
        <div className="w-px bg-slate-200 h-6 mx-1" />
        
        <button
          onClick={() => setIsGlobalEditOpen(!isGlobalEditOpen)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
            isGlobalEditOpen ? "bg-indigo-600 text-white" : "text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          <Sparkles size={14} /> Edit Slide
        </button>
      </div>

      {isGlobalEditOpen && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl p-4 ui-layer animate-in slide-in-from-right fade-in border border-slate-100 z-[9999]">
          <div className="flex justify-between font-bold text-xs uppercase text-slate-400 mb-3 tracking-wider">
            Page Instructions <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setIsGlobalEditOpen(false)} />
          </div>
          <textarea
            className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="E.g. Move image to left, dark theme..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
          <Button
            onClick={() => {
              onGlobalRemix(instruction);
              setInstruction("");
              setIsGlobalEditOpen(false);
            }}
            disabled={!instruction || isWorking}
            className="w-full mt-3"
            isLoading={isWorking}
          >
            Generate Changes
          </Button>
        </div>
      )}
    </>
  );
};