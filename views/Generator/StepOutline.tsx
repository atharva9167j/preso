import React, { useState, useEffect } from 'react';
import { Palette, GripVertical, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../../components/Button';
import { OutlineItem } from '../../types';
import { geminiService } from '../../services/gemini';

interface StepOutlineProps {
  outline: OutlineItem[];
  setOutline: (outline: OutlineItem[]) => void;
  onNext: () => void;
  handleApiError: (error: any) => boolean;
  showToast: (msg: string) => void;
}

export const StepOutline: React.FC<StepOutlineProps> = ({ 
  outline, 
  setOutline, 
  onNext, 
  handleApiError, 
  showToast 
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [outlinePrompt, setOutlinePrompt] = useState("");
  const [isRemixingOutline, setIsRemixingOutline] = useState(false);
  const [focusTarget, setFocusTarget] = useState<{slideIdx: number, pointIdx: number} | null>(null);

  useEffect(() => {
    if (focusTarget) {
      const targetElement = document.querySelector(`[data-slide-idx='${focusTarget.slideIdx}'][data-point-idx='${focusTarget.pointIdx}']`) as HTMLTextAreaElement;
      if (targetElement) {
        targetElement.focus();
      }
      setFocusTarget(null);
    }
  }, [focusTarget]);

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== index) setDragOverIndex(index);
  };
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newOutline = [...outline];
    const [draggedItem] = newOutline.splice(draggedIndex, 1);
    newOutline.splice(dropIndex, 0, draggedItem);
    setOutline(newOutline);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleRemix = async () => {
    if (!outlinePrompt) return;
    setIsRemixingOutline(true);
    try {
      const n = await geminiService.refineOutline(outline, outlinePrompt);
      setOutline(n);
      setOutlinePrompt("");
    } catch (e: any) {
      if (!handleApiError(e)) {
        showToast("Remix failed");
      }
    }
    setIsRemixingOutline(false);
  };
  
  const handlePointChange = (e: React.ChangeEvent<HTMLTextAreaElement>, slideIdx: number, pointIdx: number) => {
    const newOutline = [...outline];
    newOutline[slideIdx].points[pointIdx] = e.target.value;
    setOutline(newOutline);
  };

  const handlePointKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, slideIdx: number, pointIdx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newOutline = [...outline];
      newOutline[slideIdx].points.splice(pointIdx + 1, 0, '');
      setOutline(newOutline);
      setFocusTarget({ slideIdx, pointIdx: pointIdx + 1 });
    }

    if (e.key === 'Backspace' && (e.target as HTMLTextAreaElement).value === '') {
      e.preventDefault();
      if (outline[slideIdx].points.length > 1) {
        const newOutline = [...outline];
        newOutline[slideIdx].points.splice(pointIdx, 1);
        setOutline(newOutline);
        if (pointIdx > 0) {
          setFocusTarget({ slideIdx, pointIdx: pointIdx - 1 });
        }
      }
    }
  };

  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Outline</h2>
          <p className="text-slate-500 mt-1 font-medium">Drag to reorder. AI fills in the content later.</p>
        </div>
        <Button
          size="lg"
          onClick={onNext}
          className="rounded-full px-8 shadow-xl shadow-indigo-500/20 bg-slate-900 text-white hover:bg-slate-800"
        >
          Design & Style <Palette className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-1 min-h-0">
        {/* Left: Draggable List */}
        <div className="lg:col-span-2 pr-2 pb-10 overflow-y-auto max-h-[80dvh] custom-scrollbar">
          <div className="space-y-3">
            {outline.map((item, idx) => {
              const isDragging = draggedIndex === idx;
              const isDragOver = dragOverIndex === idx;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`relative transition-all duration-200 ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}
                >
                  {isDragOver && draggedIndex !== null && draggedIndex > idx && (
                    <div className="h-1 w-full bg-indigo-500 rounded-full mb-2" />
                  )}
                  <div className="bg-white border border-slate-200 rounded-xl p-2 pr-4 shadow-sm hover:shadow-md flex items-stretch gap-0 overflow-hidden group">
                    <div className="w-10 flex items-center justify-center cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-400 bg-slate-50/50 rounded-lg mr-2">
                      <GripVertical size={16} />
                    </div>
                    <div className="flex-1 py-2 space-y-1">
                      <input
                        className="w-full font-bold text-lg text-slate-800 bg-transparent outline-none"
                        value={item.title}
                        onChange={(e) => {
                          const n = [...outline];
                          n[idx].title = e.target.value;
                          setOutline(n);
                        }}
                        placeholder="Slide Title"
                      />
                      <div className="space-y-1 text-sm">
                        {item.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex gap-2 items-start">
                             <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center mt-1.5">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                            </div>
                            <textarea
                              value={pt}
                              onChange={(e) => handlePointChange(e, idx, pIdx)}
                              onKeyDown={(e) => handlePointKeyDown(e, idx, pIdx)}
                              placeholder="Point"
                              className="w-full bg-transparent outline-none resize-none text-slate-600 leading-tight"
                              onInput={(e) => autoResizeTextarea(e.currentTarget)}
                              data-slide-idx={idx}
                              data-point-idx={pIdx}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setOutline(outline.filter((_, i) => i !== idx))}
                      className="self-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {isDragOver && draggedIndex !== null && draggedIndex < idx && (
                    <div className="h-1 w-full bg-indigo-500 rounded-full mt-2" />
                  )}
                </div>
              );
            })}
            <Button
              variant="outline"
              onClick={() => setOutline([...outline, { id: "slide-" + Date.now(), title: "New Slide", points: ["Point 1"] }])}
              className="w-full border-dashed py-4 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 bg-slate-50/50"
            >
              + Add Slide
            </Button>
          </div>
        </div>

        {/* Right: AI Assistant */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 sticky top-6 shadow-sm">
          <h3 className="font-extrabold text-slate-800 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
            <Sparkles size={16} className="text-indigo-600" /> AI Co-Pilot
          </h3>
          <textarea
            placeholder="e.g. 'Add a slide about pricing', 'Make it more persuasive'"
            className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none mb-3"
            value={outlinePrompt}
            onChange={(e) => setOutlinePrompt(e.target.value)}
          />
          <Button
            onClick={handleRemix}
            disabled={!outlinePrompt || isRemixingOutline}
            className="w-full"
            isLoading={isRemixingOutline}
          >
            Refine Outline
          </Button>
        </div>
      </div>
    </div>
  );
};