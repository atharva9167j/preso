import React from 'react';
import { Search, Upload, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { InputMode } from '../../types';

interface StepInputProps {
  inputMode: InputMode;
  inputText: string;
  setInputText: (text: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  numSlides: number;
  setNumSlides: (num: number) => void;
  onBack: () => void;
  onGenerate: () => void;
}

export const StepInput: React.FC<StepInputProps> = ({
  inputMode,
  inputText,
  setInputText,
  uploadedFile,
  setUploadedFile,
  numSlides,
  setNumSlides,
  onBack,
  onGenerate,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right duration-300 max-w-3xl mx-auto w-full">
      <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600">
        ← Back
      </Button>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          {inputMode === "prompt"
            ? "What's the topic?"
            : inputMode === "text"
            ? "Paste your text"
            : "Upload Document"}
        </h2>

        {inputMode === "prompt" && (
          <div className="space-y-4">
            <textarea
              autoFocus
              className="w-full text-xl p-5 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 h-40 transition shadow-inner resize-none"
              placeholder="E.g. The future of AI Agents in Enterprise Software..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex gap-2 text-sm text-indigo-700 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <Search size={18} />
              <span>AI will automatically research facts and stats for this topic.</span>
            </div>
          </div>
        )}

        {inputMode === "text" && (
          <textarea
            autoFocus
            className="w-full text-sm p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-64 font-mono bg-slate-50"
            placeholder="Paste article content here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        )}

        {inputMode === "document" && (
          <div className="border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 transition-colors relative cursor-pointer">
            <input
              type="file"
              accept=".txt,.md,.csv,.pdf,.json"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
            />
            <Upload
              size={48}
              className={`mb-4 ${uploadedFile ? "text-indigo-600" : "text-slate-400"}`}
            />
            <p className="font-bold text-lg text-slate-700">
              {uploadedFile ? uploadedFile.name : "Drag & Drop File"}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg pr-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-2">
              Slides
            </span>
            <input
              type="number"
              min="3"
              max="20"
              value={numSlides}
              onChange={(e) => setNumSlides(parseInt(e.target.value, 10))}
              className="w-12 bg-white p-1 text-center border rounded-md font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button
            size="lg"
            onClick={onGenerate}
            disabled={!inputText && !uploadedFile}
            className="px-8 rounded-xl shadow-lg shadow-indigo-500/20"
          >
            Create Outline <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};