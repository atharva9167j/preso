import React from 'react';

export const StepProcessing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        Constructing Narrative...
      </h2>
      <p className="text-slate-400 mt-2 font-medium">
        Extracting key concepts and structuring flow.
      </p>
    </div>
  );
};