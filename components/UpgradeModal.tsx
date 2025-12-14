// src/components/UpgradeModal.tsx

import React from "react";
import { X, Zap, AlertTriangle } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void; // ++ ADDED: New prop for navigation callback
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeClick,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full m-4 text-center animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
        >
          <X size={20} />
        </button>
        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Rate Limit Reached
        </h2>
        <p className="text-slate-500 mb-6">
          You have exceeded the request limit for your personal API key. Please
          wait a few moments before trying again.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-200 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
