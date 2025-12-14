import React from 'react';
import { Sparkles, FileText, Upload } from 'lucide-react';
import { Button } from '../../components/Button';
import { InputOption } from '../../components/Generator/InputOption';
import { InputMode } from '../../types';

interface StepSelectionProps {
  onCancel: () => void;
  onSelect: (mode: InputMode) => void;
}

export const StepSelection: React.FC<StepSelectionProps> = ({ onCancel, onSelect }) => {
  return (
    <>
      <div className="flex justify-start mb-8">
        <Button variant="ghost" onClick={onCancel}>← Cancel</Button>
      </div>
      <div className="flex flex-col gap-6 py-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-4xl font-extrabold text-slate-900">Create a Deck</h2>
          <p className="text-slate-500 text-lg">Choose a starting point for your presentation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          <InputOption 
            icon={Sparkles} 
            title="Use a Prompt" 
            description="Enter a topic and let AI research and structure it." 
            onClick={() => onSelect("prompt")} 
          />
          <InputOption 
            icon={FileText} 
            title="Paste Text" 
            description="Turn notes, blogs, or articles into slides instantly." 
            onClick={() => onSelect("text")} 
          />
          <InputOption 
            icon={Upload} 
            title="Import File" 
            description="Upload a PDF or Doc to extract key points." 
            onClick={() => onSelect("document")} 
          />
        </div>
      </div>
    </>
  );
};