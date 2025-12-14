import React, { useState } from 'react';
import { Button } from './Button';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  isOpen: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, isOpen }) => {
  const [inputKey, setInputKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Preso</h2>
          <p className="text-slate-500">Enter your Gemini API Key to get started. The key is stored locally in your browser.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-1">
              Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="AIza..."
              required
            />
            <p className="mt-2 text-xs text-slate-400">
              Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            Start Creating
          </Button>
        </form>
      </div>
    </div>
  );
};