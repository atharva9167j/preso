import React from "react";
import { LucideIcon } from "lucide-react";

interface InputOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export const InputOption: React.FC<InputOptionProps> = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center p-8 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all group duration-300"
  >
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
      <Icon size={32} className="text-slate-600 group-hover:text-white" />
    </div>
    <h3 className="font-bold text-xl text-slate-800 mb-2">{title}</h3>
    <p className="text-center text-slate-500 text-sm leading-relaxed">{description}</p>
  </button>
);