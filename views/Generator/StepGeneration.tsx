import React from 'react';
import { CheckCircle } from 'lucide-react';
import { ScaledPreview } from '../../components/ScaledPreview';
import { OutlineItem } from '../../types';

interface StepGenerationProps {
  outline: OutlineItem[];
  generatedSlides: { title: string; content: string }[];
  inProgressSlideHtml: string;
}

const GeneratingIcon = () => (
  <svg className="animate-spin text-indigo-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

export const StepGeneration: React.FC<StepGenerationProps> = ({
  outline,
  generatedSlides,
  inProgressSlideHtml
}) => {
  const currentSlideIndex = generatedSlides.length;

  return (
    <div className="flex-1 flex flex-col -m-6 animate-in fade-in duration-500 h-[calc(100vh-100px)]">
      <div className="flex-1 flex bg-slate-50 p-6 gap-6 h-full overflow-hidden">
        {/* Sidebar Progress */}
        <div className="w-80 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Generation
          </h3>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <ul className="space-y-3">
              {outline.map((s, index) => (
                <li
                  key={s.id}
                  className={`flex items-start gap-3 p-3 rounded-xl text-sm transition-all duration-300 ${
                    index < currentSlideIndex
                      ? "bg-green-50 text-green-900 border border-green-100"
                      : index === currentSlideIndex
                      ? "bg-indigo-50 text-indigo-900 border border-indigo-100 shadow-sm scale-105"
                      : "text-slate-400"
                  }`}
                >
                  <div className="mt-0.5">
                    {index < currentSlideIndex ? (
                      <CheckCircle className="text-green-600 w-5 h-5" />
                    ) : index === currentSlideIndex ? (
                      <GeneratingIcon />
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-100 rounded-full" />
                    )}
                  </div>
                  <span className={`font-medium ${index === currentSlideIndex ? "font-bold" : ""}`}>
                    {s.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preview Stage */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          <div className="w-full max-w-5xl aspect-video bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />
            <ScaledPreview html={inProgressSlideHtml} loading={!inProgressSlideHtml} />
          </div>
          <p className="mt-6 text-slate-400 font-mono text-sm animate-pulse">
            {generatedSlides.length < outline.length
              ? `Writing slide ${generatedSlides.length + 1}/${outline.length}...`
              : "Finalizing deck..."}
          </p>
        </div>
      </div>
    </div>
  );
};