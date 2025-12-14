import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../Button';
import { Deck } from '../../types';

interface SlideNavigationProps {
  deck: Deck;
  activeSlideIndex: number;
  onSlideClick: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  deck,
  activeSlideIndex,
  onSlideClick,
  onAddSlide,
  onDeleteSlide
}) => {
  // State to track which slide is pending deletion
  const [deleteCandidate, setDeleteCandidate] = useState<number | null>(null);

  const confirmDelete = () => {
    if (deleteCandidate !== null) {
      onDeleteSlide(deleteCandidate);
      setDeleteCandidate(null);
    }
  };

  const cancelDelete = () => {
    setDeleteCandidate(null);
  };

  return (
    <>
      <div className="w-56 bg-white border-r border-slate-200 h-full flex flex-col z-20 shadow-sm shrink-0 fixed mt-14">
        <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[89dvh]">
          {deck.slides.map((slide, idx) => (
            <div key={slide.id} className="group relative">
              <div
                onClick={() => onSlideClick(idx)}
                className={`cursor-pointer transition duration-200`}
              >
                <div
                  className={`aspect-video bg-white rounded overflow-hidden relative border transition-all ${
                    activeSlideIndex === idx
                      ? "border-indigo-600 ring-2 ring-indigo-50 shadow-md"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-white"
                    style={{
                      transform: "scale(0.103)",
                      transformOrigin: "top left",
                      width: "1920px", height: "1080px", lineHeight: 1.2,
                    }}
                    dangerouslySetInnerHTML={{ __html: slide.content }}
                  />
                </div>
                <div className="px-1 pt-1 flex justify-between">
                  <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
                </div>
              </div>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setDeleteCandidate(idx); // Trigger confirmation instead of immediate delete
                }}
                className="absolute top-1 right-1 z-10 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-opacity"
                title="Delete slide"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <Button onClick={onAddSlide} size="sm" variant="outline" className="w-full border-dashed text-slate-400">
            Add Slide
          </Button>
        </div>
      </div>

      {/* Clean Elegant Delete Confirmation Modal */}
      {deleteCandidate !== null && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-xl shadow-2xl w-80 p-6 transform transition-all animate-in zoom-in-95 duration-200 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete Slide {deleteCandidate + 1}?
              </h3>
              
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Are you sure you want to delete this slide? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm shadow-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};