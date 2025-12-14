import React from "react";
import { Check } from "lucide-react";

interface ModeCardProps {
  mode: "concise" | "balanced" | "theory";
  current: string;
  onClick: () => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({ mode, current, onClick }) => {
  const isSelected = mode === current;

  const Visual = () => {
    if (mode === "concise")
      return (
        <div className="space-y-2 w-full opacity-60">
          <div className="h-2 w-1/3 bg-current rounded-full mb-4" />
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-current" />
            <div className="h-2 w-3/4 bg-current rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-current" />
            <div className="h-2 w-2/3 bg-current rounded-full" />
          </div>
        </div>
      );
    if (mode === "balanced")
      return (
        <div className="flex gap-2 w-full opacity-60">
          <div className="flex-1 space-y-2">
            <div className="h-2 w-full bg-current rounded-full" />
            <div className="h-2 w-5/6 bg-current rounded-full" />
            <div className="h-2 w-full bg-current rounded-full" />
          </div>
          <div className="w-20 h-16 bg-current rounded-md opacity-40" />
        </div>
      );
    return (
      <div className="space-y-1.5 w-full opacity-60 text-[6px]">
        <div className="h-2 w-1/2 bg-current rounded-full mb-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-1.5 w-full bg-current rounded-full" />
        ))}
      </div>
    );
  };

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col p-4 border rounded-2xl transition-all duration-200 text-left justify-between
                ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-slate-50"
                }`}
    >
      <div className="mb-2">
        <Visual />
      </div>
      <div>
        <span className="font-bold block capitalize">{mode}</span>
        <span className="text-xs opacity-75">
          {mode === "concise"
            ? "Less text, big impact"
            : mode === "balanced"
            ? "Text & visuals mixed"
            : "Detailed info heavy"}
        </span>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3 bg-indigo-600 rounded-full p-0.5">
          <Check size={12} className="text-white" />
        </div>
      )}
    </button>
  );
};