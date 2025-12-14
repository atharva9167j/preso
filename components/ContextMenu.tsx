import React, { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';

export type ContextAction = 'duplicate' | 'delete' | 'front' | 'back' | 'insert';

interface ContextMenuProps {
  position: { x: number; y: number };
  onAction: (action: ContextAction, detail?: any) => void;
  onClose: () => void;
  targetType: 'element' | 'canvas';
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onAction, targetType }) => {
  // Simple internal state machine: 'main' | 'choose-type'
  const [view, setView] = useState<'main' | 'choose-type'>('main');

  return (
    <div 
        className="fixed z-[99999] w-52 bg-white border border-slate-200 shadow-2xl rounded-xl py-1 animate-in zoom-in-95 origin-top-left overflow-hidden text-sm select-none font-medium"
        style={{ top: position.y, left: position.x }}
        onContextMenu={(e) => e.preventDefault()}
    >
       {/* MAIN VIEW */}
       {view === 'main' && targetType === 'element' && (
           <>
               <div className="py-1">
                  <Btn icon={Copy} label="Duplicate" onClick={() => onAction('duplicate')} />
                  <Btn icon={Trash2} label="Delete" color="text-red-600 hover:bg-red-50" onClick={() => onAction('delete')} />
               </div>
           </>
       )}
    </div>
  );
};

const Btn = ({ icon: Icon, label, onClick, color = "text-slate-700" }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-indigo-50 transition-colors ${color}`}>
     <Icon size={14} className="opacity-70"/> <span>{label}</span>
  </button>
);