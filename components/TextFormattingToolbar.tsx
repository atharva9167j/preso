import React, { useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Flame,
  X,
  Plus,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { geminiService } from "../services/gemini";
import { FONTS } from "../constants";
import { THEMES } from "../themes";

interface TextToolbarProps {
  position: { top: number; left: number };
  onClose: () => void;
  targetNode?: HTMLElement; // The editable element being focused
  isWorking: boolean;
  setIsWorking: (isWorking: boolean) => void;
}

const COLORS = [
  "#1e293b",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#d946ef",
];
const GLOWS = [
  { name: "None", val: "none" },
  { name: "Subtle", val: "0 2px 5px rgba(0,0,0,0.2)" },
  { name: "Hard", val: "2px 2px 0px rgba(0,0,0,1)" },
  { name: "Neon Blue", val: "0 0 10px #3b82f6, 0 0 20px #3b82f6" },
  { name: "Neon Pink", val: "0 0 5px #ec4899, 0 0 15px #ec4899" },
  { name: "Gold Halo", val: "0 0 15px #fbbf24" },
];

const FONT_SIZES = [
  ...Array.from({ length: 6 }, (_, i) => 3 + i),        // 3–14
  ...Array.from({ length: 8 }, (_, i) => 16 + i * 2),   // 16–30
  ...Array.from({ length: 8 }, (_, i) => 32 + i * 2),   // 32–46
  ...Array.from({ length: 6 }, (_, i) => 48 + i * 4),   // 48–68
  ...Array.from({ length: 20 }, (_, i) => 70 + i * 2),  // 70–102
  ...Array.from({ length: 20 }, (_, i) => 104 + i * 4), // 104–176
];

export const TextFormattingToolbar: React.FC<TextToolbarProps> = ({
  position,
  onClose,
  targetNode,
  isWorking,
  setIsWorking,
  showToast,
  handleApiError,
}) => {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu] = useState<
    "font" | "size" | "color" | "effects" | "ai" | null
  >(null);
  const [fontName, setFontName] = useState("Arial");
  const [fontSize, setFontSize] = useState("16px");
  const [inputFontSize, setInputFontSize] = useState(() =>
    Math.round(parseFloat(fontSize)).toString()
  );
  const [activeGlow, setActiveGlow] = useState("none");
  const fontSizeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fontSizeInputRef.current === document.activeElement) return;

    const size = Math.round(parseFloat(fontSize));
    setInputFontSize(isNaN(size) ? "" : size.toString());
  }, [fontSize]);

  const [pickerColor, setPickerColor] = useState<string>("#000000");
  const [showFloatingColorPicker, setShowFloatingColorPicker] =
    useState<boolean>(false);
  const [customColors, setCustomColors] = useState<string[]>(() => {
    const storedColors = localStorage.getItem("customColors");
    return storedColors ? JSON.parse(storedColors) : [];
  });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCustomColor = (color: string) => {
    const newCustomColors = [...new Set([...customColors, color])];
    setCustomColors(newCustomColors);
    localStorage.setItem("customColors", JSON.stringify(newCustomColors));
  };

  const checkFormats = () => {
    if (!targetNode) return;
    const newFormats = new Set<string>();
    ["bold", "italic", "underline"].forEach((cmd) => {
      if (document.queryCommandState(cmd)) newFormats.add(cmd);
    });

    if (targetNode.classList.contains("text-center")) newFormats.add("center");
    else if (targetNode.classList.contains("text-right"))
      newFormats.add("right");
    else newFormats.add("left");
    setActiveFormats(newFormats);

    const name = document.queryCommandValue("fontName").replace(/['"]/g, "");
    const matchingFont = FONTS.find((f) =>
      f.value.toLowerCase().includes(name.toLowerCase())
    );
    setFontName(matchingFont ? matchingFont.name : name);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      let element = range.commonAncestorContainer;
      if (element.nodeType !== Node.ELEMENT_NODE) {
        element = element.parentElement;
      }
      if (element && element instanceof HTMLElement) {
        const style = window.getComputedStyle(element);
        setFontSize(style.fontSize);
        setActiveGlow(style.textShadow);
      }
    }
  };

  useEffect(() => {
    checkFormats();
    const handler = () => checkFormats();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [targetNode]);

  const handleMenuToggle = (
    menu: "font" | "size" | "color" | "effects" | "ai"
  ) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const applyCommand = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    checkFormats();
    if (cmd === "fontName") {
      setOpenMenu(null);
    }
  };

  const applyClassAlign = (align: "left" | "center" | "right") => {
    if (!targetNode) return;
    targetNode.classList.remove(
      "text-left",
      "text-center",
      "text-right",
      "text-justify"
    );
    if (align === "center") targetNode.classList.add("text-center");
    else if (align === "right") targetNode.classList.add("text-right");
    else targetNode.classList.add("text-left");
    checkFormats();
  };

  const applyStyle = (
    prop: "color" | "textShadow" | "fontSize",
    val: string
  ) => {
    if (!targetNode) return;

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && prop !== "fontSize") {
      if (prop === "color") {
        document.execCommand("foreColor", false, val);
      } else {
        targetNode.style.textShadow = val;
      }
    } else {
      targetNode.style[prop] = val;
    }
    setOpenMenu(null);
  };

  const Btn = ({ icon: Icon, active, onClick, color, size = 16 }: any) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-2 rounded transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-slate-600 hover:bg-slate-100"
      } ${color || ""}`}
    >
      <Icon size={size} />
    </button>
  );

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[300] bg-white border border-slate-200 shadow-xl rounded-lg flex items-center gap-1 p-1 animate-in zoom-in-95 pointer-events-auto"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -120%)",
      }}
    >
      {/* Font Family */}
      <div className="relative">
        <button
          onClick={() => handleMenuToggle("font")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-slate-100 w-36 text-left"
        >
          <span className="flex-1 truncate">{fontName}</span>
          <ChevronDown size={14} />
        </button>
        {openMenu === "font" && (
          <div className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md border p-1 z-10 h-64 overflow-y-auto">
            {FONTS.map((font) => (
              <button
                key={font.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyCommand("fontName", font.value);
                }}
                className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-slate-100"
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Size */}
<div className="relative">
  <div className="flex items-center w-20 rounded hover:bg-slate-100 focus-within:bg-slate-100">
    <input
      ref={fontSizeInputRef}
      className="w-12 bg-transparent text-sm text-center focus:outline-none px-2 py-1.5"
      // type="number"
      value={inputFontSize}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setInputFontSize(e.target.value)
      }
      onBlur={(e) => {
        // Don't process blur if clicking the dropdown button or menu
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget?.closest('.font-size-menu-container')) {
          return;
        }
        
        const newSize = parseInt(inputFontSize, 10);
        if (newSize > 0 && !isNaN(newSize)) {
          const newSizePx = `${newSize}px`;
          setFontSize(newSizePx);
          applyStyle("fontSize", newSizePx);
        } else {
          // Reset to current font size if invalid
          const currentSize = Math.round(parseFloat(fontSize));
          setInputFontSize(
            isNaN(currentSize) ? "16" : currentSize.toString()
          );
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const newSize = parseInt(inputFontSize, 10);
          if (newSize > 0 && !isNaN(newSize)) {
            const newSizePx = `${newSize}px`;
            setFontSize(newSizePx);
            applyStyle("fontSize", newSizePx);
          }
          (e.target as HTMLInputElement).blur();
        } else if (e.key === "Escape") {
          e.preventDefault();
          const currentSize = Math.round(parseFloat(fontSize));
          setInputFontSize(
            isNaN(currentSize) ? "16" : currentSize.toString()
          );
          (e.target as HTMLInputElement).blur();
        }
      }}
      aria-label="Font size"
    />
    <button
      onClick={() => handleMenuToggle("size")}
      className="p-1 rounded font-size-menu-container"
      aria-label="Select font size"
      onMouseDown={(e) => e.preventDefault()} // Prevent input blur
    >
      <ChevronDown size={14} />
    </button>
  </div>
  {openMenu === "size" && (
    <div className="absolute top-full mt-2 w-16 bg-white shadow-lg rounded-md border p-1 z-10 font-size-menu-container max-h-60 overflow-y-auto">
      {FONT_SIZES.map((s) => (
        <button
          key={s}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const newSizePx = `${s}px`;
            setFontSize(newSizePx);
            setInputFontSize(s.toString());
            applyStyle("fontSize", newSizePx);
            handleMenuToggle("size"); // Close the menu after selection
          }}
          className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-slate-100 ${
            parseInt(inputFontSize) === s ? 'bg-slate-100 font-semibold' : ''
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )}
</div>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      {/* B, I, U */}
      <Btn
        icon={Bold}
        active={activeFormats.has("bold")}
        onClick={() => applyCommand("bold")}
      />
      <Btn
        icon={Italic}
        active={activeFormats.has("italic")}
        onClick={() => applyCommand("italic")}
      />
      <Btn
        icon={Underline}
        active={activeFormats.has("underline")}
        onClick={() => applyCommand("underline")}
      />

      <div className="w-px h-5 bg-slate-200 mx-1" />

      {/* Align */}
      <Btn
        icon={AlignLeft}
        active={activeFormats.has("left")}
        onClick={() => applyClassAlign("left")}
      />
      <Btn
        icon={AlignCenter}
        active={activeFormats.has("center")}
        onClick={() => applyClassAlign("center")}
      />
      <Btn
        icon={AlignRight}
        active={activeFormats.has("right")}
        onClick={() => applyClassAlign("right")}
      />

      <div className="w-px h-5 bg-slate-200 mx-1" />

      {/* AI Actions */}
      <div className="relative">
        <button
          onClick={() => handleMenuToggle("ai")}
          onMouseDown={(e) => e.preventDefault()}
          className="p-2 rounded hover:bg-slate-100"
        >
          <Sparkles size={16} />
        </button>
        {openMenu === "ai" && (
          <div className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md border p-1 z-10 right-0">
            {isWorking ? (
              <div className="flex items-center justify-center p-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyAIAction("expand");
                  }}
                  className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-slate-100"
                >
                  Expand
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyAIAction("condense");
                  }}
                  className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-slate-100"
                >
                  Condense
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyAIAction("rewrite");
                  }}
                  className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-slate-100"
                >
                  Rewrite
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-slate-200 mx-1" />


      {/* Color */}
      <div className="relative">
        <button
          onClick={() => handleMenuToggle("color")}
          onMouseDown={(e) => e.preventDefault()}
          className="p-2 rounded hover:bg-slate-100"
        >
          <Palette size={16} />
        </button>
        {openMenu === "color" && (
          <div className="absolute top-full mt-2 w-52 bg-white shadow-lg rounded-md border p-2 z-10">
            <div className="grid grid-cols-6 gap-1">
              {[
                ...COLORS,
                ...THEMES.flatMap((t) => t.colors),
                ...customColors,
              ].map((c, idx) => (
                <button
                  key={c + idx}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyStyle("color", c);
                  }}
                  className="w-7 h-7 rounded-full border border-slate-100 shadow-sm hover:scale-110 transition"
                  style={{ backgroundColor: c }}
                />
              ))}
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowFloatingColorPicker((prev) => !prev);
                }}
                className="w-7 h-7 rounded-full border border-slate-200 shadow-sm hover:scale-110 transition flex items-center justify-center text-slate-400"
              >
                <Plus size={14} />
              </button>
            </div>
            {showFloatingColorPicker && (
              <div className="flex items-center gap-2 w-full mt-2">
                <input
                  type="color"
                  className="w-8 h-8 rounded-md"
                  onMouseDown={(e) => e.preventDefault()}
                  value={pickerColor}
                  onChange={(e) => setPickerColor(e.target.value)}
                />
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAddCustomColor(pickerColor);
                    setShowFloatingColorPicker(false);
                  }}
                  className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Effects */}
      <div className="relative">
        <button
          onClick={() => handleMenuToggle("effects")}
          onMouseDown={(e) => e.preventDefault()}
          className="p-2 rounded hover:bg-slate-100"
        >
          <Flame size={16} />
        </button>
        {openMenu === "effects" && (
          <div className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md border p-1 z-10 right-0">
            <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase">
              Text Glow
            </div>
            {GLOWS.map((g) => (
              <button
                key={g.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyStyle("textShadow", g.val);
                }}
                className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-slate-100 ${
                  activeGlow === g.val ? "bg-slate-100" : ""
                }`}
                style={{ textShadow: g.val }}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="ml-1 text-slate-400 hover:text-red-500 p-2"
      >
        <X size={16} />
      </button>
    </div>
  );

  async function applyAIAction(
    action: "expand" | "condense" | "rewrite" | "tone"
  ) {
    if (!targetNode || !targetNode.textContent) return;
    const originalText = targetNode.textContent;
    setIsWorking(true);
    try {
      const refinedText = await geminiService.refineText(originalText, action);
      targetNode.textContent = refinedText;
    } catch (error) {
      console.error("AI action failed:", error);
      if (!handleApiError(error)) {
        showToast("AI could not refine text. Please try again.");
      }
    } finally {
      setIsWorking(false);
      setOpenMenu(null);
    }
  }
};