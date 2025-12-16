import React, { useState } from "react";
import {
  Copy,
  Trash2,
  Type,
  Image,
  Upload,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export type ContextAction =
  | "duplicate"
  | "delete"
  | "insert-text"
  | "insert-image-upload"
  | "open-image-library";

interface ContextMenuProps {
  position: { x: number; y: number };
  onAction: (action: ContextAction, detail?: any) => void;
  onClose: () => void;
  targetType: "element" | "canvas";
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onAction,
  targetType,
}) => {
  const [view, setView] = useState<"main" | "add-image">("main");

  return (
    <div
      className="fixed z-[99999] w-56 bg-white border border-slate-200 shadow-2xl rounded-xl py-1 animate-in zoom-in-95 origin-top-left overflow-hidden text-sm select-none font-medium"
      style={{ top: position.y, left: position.x }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ELEMENT MENU */}
      {view === "main" && targetType === "element" && (
        <>
          <div className="py-1">
            <Btn
              icon={Copy}
              label="Duplicate"
              onClick={() => onAction("duplicate")}
            />
            <Btn
              icon={Trash2}
              label="Delete"
              color="text-red-600 hover:bg-red-50"
              onClick={() => onAction("delete")}
            />
          </div>
          <hr className="ml-2 mr-2" />
          <div className="py-1">
            <Btn
              icon={Type}
              label="Add Text"
              onClick={() => onAction("insert-text")}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setView("add-image");
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-indigo-50 transition-colors text-slate-700"
            >
              <div className="flex items-center gap-3">
                <Image size={14} className="opacity-70" />{" "}
                <span>Add Image</span>
              </div>
              <ChevronRight size={14} className="opacity-40" />
            </button>
          </div>
        </>
      )}

      {/* ADD IMAGE SUB-MENU */}
      {view === "add-image" && (
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setView("main");
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 border-b mb-1"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <Btn
            icon={Upload}
            label="Upload Photo"
            onClick={() => onAction("insert-image-upload")}
          />
          <Btn
            icon={Image}
            label="Stock Photos"
            onClick={() => onAction("open-image-library")}
          />
        </div>
      )}
    </div>
  );
};

const Btn = ({ icon: Icon, label, onClick, color = "text-slate-700" }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-indigo-50 transition-colors ${color}`}
  >
    <Icon size={14} className="opacity-70" /> <span>{label}</span>
  </button>
);
