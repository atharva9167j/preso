import React, { useRef, useState, memo, useEffect, useCallback } from "react";
import Moveable from "react-moveable";
import { TextFormattingToolbar } from "../TextFormattingToolbar";
import { ContextMenu, ContextAction } from "../ContextMenu";
import { Button } from "../Button";
import {
  Sparkles,
  Copy,
  Trash2,
  Crop,
  RefreshCw,
  Sliders,
  X,
} from "lucide-react";

interface EditorCanvasProps {
  activeSlideContent: string;
  activeSlideIndex: number;
  zoom: number;
  isWorking: boolean;
  setIsWorking: (val: boolean) => void;
  onContentChange: (newContent: string) => void;
  onElementRemix: (element: HTMLElement, instruction: string) => void;
  onContextAction: (
    action: ContextAction,
    payload?: any,
    element?: HTMLElement
  ) => void;
  showToast: (msg: string) => void;
  handleApiError: (err: any) => boolean;
}

// 1. Global Styles
const GlobalStyles = () => (
  <style>{`
      #editor-canvas-root img, #editor-canvas-root svg {
        user-select: none;
        -webkit-user-drag: none;
        pointer-events: auto;
      }
      /* Standard Controls */
      .moveable-control-box {
        z-index: 50 !important;
      }
      /* Cropping Controls - Must be higher than the crop overlay (z-200) */
      .cropper-controls {
        z-index: 9999 !important;
      }
      .cropper-controls .moveable-line, 
      .cropper-controls .moveable-control {
        background: #3b82f6 !important; /* Blue for crop active */
      }
    `}</style>
);

// 2. Memoized Stage
const SlideStage = memo(
  ({ content, onContentDblClick }: any) => (
    <div
      id="editor-canvas-root"
      className="w-full h-full relative"
      dangerouslySetInnerHTML={{ __html: content }}
      onDoubleClick={onContentDblClick}
    />
  ),
  (prev, next) => prev.content === next.content
);

// Helper Components
const BtnSmall = ({ onClick, icon: Icon, color }: any) => (
  <button
    onMouseDown={(e) => e.stopPropagation()}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    className={`p-1.5 rounded hover:bg-slate-100 ${
      color || "text-slate-400 hover:text-slate-700"
    }`}
  >
    <Icon size={16} />
  </button>
);

const StyleButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-200 rounded-md transition-colors"
  >
    {children}
  </button>
);

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  activeSlideContent,
  activeSlideIndex,
  zoom,
  isWorking,
  setIsWorking,
  onContentChange,
  onElementRemix,
  onContextAction,
  showToast,
  handleApiError,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [selectedElements, setSelectedElements] = useState<HTMLElement[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<HTMLImageElement | null>(null);

  // UI States
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [selection, setSelection] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<any>(null);
  const [isElementEditOpen, setIsElementEditOpen] = useState(false);
  const [editInstruction, setEditInstruction] = useState("");
  const [isImageStyleOpen, setIsImageStyleOpen] = useState(false);

  // Drawing / Selection Box
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectionBox, setSelectionBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  // Cropping
  const [croppingElement, setCroppingElement] = useState<{
    element: HTMLElement;
    img: HTMLImageElement;
    imgRect: DOMRect;
  } | null>(null);
  const [cropBox, setCropBox] = useState<any>(null);

  const replaceImageInputRef = useRef<HTMLInputElement>(null);

  // --- CLEANUP ---
  useEffect(() => {
    setSelectedElements([]);
    setSelectedIds([]);
    setActiveImage(null);
    setSelectionBox({ x: 0, y: 0, width: 0, height: 0 });
    setIsDrawing(false);
    setContextMenu(null);
    setShowFormatToolbar(false);
    setIsElementEditOpen(false);
    setIsImageStyleOpen(false);
    setCroppingElement(null);
  }, [activeSlideIndex]);

  // --- RESTORE SELECTION ---
  useEffect(() => {
    if (selectedIds.length > 0) {
      const root = document.getElementById("editor-canvas-root");
      if (!root) return;

      const restoredElements: HTMLElement[] = [];
      selectedIds.forEach((id) => {
        const el = root.querySelector(`[id="${id}"]`) as HTMLElement;
        if (el) restoredElements.push(el);
      });

      if (restoredElements.length > 0) {
        const isDifferent = restoredElements.some(
          (el, i) => el !== selectedElements[i]
        );
        if (
          isDifferent ||
          restoredElements.length !== selectedElements.length
        ) {
          setSelectedElements(restoredElements);
          if (restoredElements.length === 1) {
            const el = restoredElements[0];
            const img =
              el.tagName === "IMG"
                ? (el as HTMLImageElement)
                : el.querySelector("img");
            if (img) setActiveImage(img);
          }
        }
      } else if (selectedElements.length > 0) {
        setSelectedElements([]);
      }
    }
  }, [activeSlideContent, selectedIds]);

  // --- PERSIST LOGIC ---
  const persistChanges = useCallback(() => {
    const rootEl = document.getElementById("editor-canvas-root");
    if (!rootEl) return;

    const clone = rootEl.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll("[contenteditable]")
      .forEach((el) => el.removeAttribute("contenteditable"));
    clone.querySelectorAll(".moveable-control").forEach((el) => el.remove());

    const newContent = clone.innerHTML;
    if (newContent !== activeSlideContent) {
      onContentChange(newContent);
    }
  }, [activeSlideContent, onContentChange]);

  // --- HELPER: Detect if element is purely an image container ---
  const isImageElement = (el: HTMLElement) => {
    if (!el) return false;
    if (el.tagName === "IMG") return true;
    
    // It's a container. Check if it has an image and NO visible text.
    const img = el.querySelector("img");
    if (img) {
      const textContent = el.innerText || "";
      // If it has an image but no significant text, treat as image container
      return textContent.trim().length === 0;
    }
    return false;
  };

  // --- Handlers ---
  const handleStageDblClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWorking) return;
    const target = e.target as HTMLElement;
    const editable = target.closest(
      "h1,h2,h3,h4,p,div,span,li,ul,a"
    ) as HTMLElement;

    if (editable && editable.id !== "editor-canvas-root") {
      if (
        editable.classList.contains("absolute") &&
        editable.children.length > 0 &&
        !editable.innerText.trim()
      )
        return;
      if (!editable.id)
        editable.id = `el-${Math.random().toString(36).substr(2, 9)}`;

      editable.contentEditable = "true";
      editable.focus();
      setSelectedElements([]);
      setSelectedIds([]);

      setSelection({
        text: "",
        range: document.createRange(),
        rect: editable.getBoundingClientRect(),
        node: editable,
      });
      setShowFormatToolbar(true);

      const onBlur = () => {
        setTimeout(() => {
          editable.contentEditable = "false";
          setShowFormatToolbar(false);
          persistChanges();
        }, 200);
      };
      editable.addEventListener("blur", onBlur, { once: true });
    }
  };

  const handleStageClick = (e: React.MouseEvent) => {
    if (isWorking) return;
    const target = e.target as HTMLElement;

    if (
      target.closest(".ui-layer") ||
      target.closest(".moveable-control") ||
      target.closest(".moveable-control-box")
    )
      return;

    setContextMenu(null);
    setIsElementEditOpen(false);
    setIsImageStyleOpen(false);

    const slideRoot = document.getElementById("editor-canvas-root");
    if (!slideRoot?.contains(target)) {
      // Clicked outside slide area - Start Selection Box logic
      setSelectedElements([]);
      setSelectedIds([]);
      // Do not return here, fall through to drawing logic
    } else {
      // Clicked inside slide area
      let container = target.closest(
        '.relative, .absolute, .flex, [class*="text-"]'
      ) as HTMLElement | null;

      let imgInContainer: HTMLImageElement | null = null;

      if (target.tagName === "IMG") {
        imgInContainer = target as HTMLImageElement;
        container = target as HTMLElement;
      }

      setActiveImage(imgInContainer || null);

      if (container && container.id !== "editor-canvas-root") {
        if (!container.id)
          container.id = `el-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const containerId = container.id;

        if (!e.shiftKey) {
          if (!selectedElements.includes(container)) {
            setSelectedElements([container]);
            setSelectedIds([containerId]);
          }
          return;
        }
        if (e.shiftKey) {
          const newSelection = selectedElements.includes(container)
            ? selectedElements.filter((x) => x !== container)
            : [...selectedElements, container];

          setSelectedElements(newSelection);
          setSelectedIds(newSelection.map((el) => el.id));
          return;
        }
      }
    }

    // Start Drawing Selection Box
    setSelectedElements([]);
    setSelectedIds([]);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelectionBox({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: 0,
      height: 0,
    });
    setIsDrawing(true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWorking) return;
    const slideRoot = document.getElementById("editor-canvas-root");
    const target = e.target as HTMLElement;

    if (!slideRoot?.contains(target)) {
      setContextMenu({ x: e.clientX, y: e.clientY, targetType: "canvas" });
      return;
    }

    let element = target;
    while (
      element &&
      element.parentElement?.id !== "editor-canvas-root" &&
      element.id !== "editor-canvas-root"
    ) {
      if (element.classList.contains("absolute")) break;
      element = element.parentElement!;
    }

    const targetEl = element.id === "editor-canvas-root" ? undefined : element;
    if (targetEl) {
      if (!targetEl.id) targetEl.id = `el-${Date.now()}`;
      if (!selectedElements.includes(targetEl)) {
        setSelectedElements([targetEl]);
        setSelectedIds([targetEl.id]);
      }
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      targetType: targetEl ? "element" : "canvas",
      element: targetEl,
    });
  };

  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedElements.length) return;

    let imgElement = activeImage;
    if (!imgElement) {
      const el = selectedElements[0];
      imgElement =
        el.tagName === "IMG"
          ? (el as HTMLImageElement)
          : el.querySelector("img");
    }

    if (!imgElement) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      imgElement!.src = event.target?.result as string;
      imgElement!.alt = "custom image";
      persistChanges();
      showToast("Image replaced successfully.");
    };
    reader.readAsDataURL(file);
  };

  const applyImageObjectFit = (fit: "contain" | "cover" | "fill") => {
    selectedElements.forEach((el) => {
      const img = el.tagName === "IMG" ? el : el.querySelector("img");
      if (img) {
        (img as HTMLElement).style.objectFit = fit;
        (img as HTMLElement).style.width = "100%";
        (img as HTMLElement).style.height = "100%";
      }
    });
    persistChanges();
    setIsImageStyleOpen(true);
  };

  const applyBorderRadius = (radius: string) => {
    selectedElements.forEach((el) => {
      el.style.borderRadius = radius;
      el.style.overflow = "hidden";
    });
    persistChanges();
    setIsImageStyleOpen(true);
  };

  // --- Cropping Logic ---
  useEffect(() => {
    if (croppingElement) {
      setCropBox(croppingElement.imgRect);
    } else {
      setCropBox(null);
    }
  }, [croppingElement]);

  const handleApplyCrop = async () => {
    if (!croppingElement || !cropBox) return;
    setIsWorking(true);
    const { element, img, imgRect } = croppingElement;

    try {
      const response = await fetch(img.src, { mode: "cors" });
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = objectURL;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / imgRect.width;
        const scaleY = image.naturalHeight / imgRect.height;
        const sX = (cropBox.left - imgRect.left) * scaleX;
        const sY = (cropBox.top - imgRect.top) * scaleY;
        const sWidth = cropBox.width * scaleX;
        const sHeight = cropBox.height * scaleY;

        if (sWidth < 1 || sHeight < 1) {
          setIsWorking(false);
          setCroppingElement(null);
          showToast("Crop area too small");
          return;
        }

        canvas.width = sWidth;
        canvas.height = sHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(image, sX, sY, sWidth, sHeight, 0, 0, sWidth, sHeight);
          const dataUrl = canvas.toDataURL();
          img.src = dataUrl;

          const containerRect = element.getBoundingClientRect();
          const newWidth = cropBox.width / zoom;
          const newHeight = cropBox.height / zoom;
          const newLeft =
            element.offsetLeft + (cropBox.left - containerRect.left) / zoom;
          const newTop =
            element.offsetTop + (cropBox.top - containerRect.top) / zoom;

          element.style.width = `${newWidth}px`;
          element.style.height = `${newHeight}px`;
          element.style.left = `${newLeft}px`;
          element.style.top = `${newTop}px`;
        }

        URL.revokeObjectURL(objectURL);
        setCroppingElement(null);
        persistChanges();
        setIsWorking(false);
      };
      image.onerror = () => {
        showToast("Could not load image. CORS restriction?");
        setIsWorking(false);
        setCroppingElement(null);
      };
    } catch (error) {
      showToast("Failed to process image.");
      setIsWorking(false);
      setCroppingElement(null);
    }
  };

  useEffect(() => {
    if (!isDrawing || !viewportRef.current) return;

    const handleMove = (e: MouseEvent) => {
      const rect = viewportRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSelectionBox({
        x: Math.min(x, startPoint.x),
        y: Math.min(y, startPoint.y),
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y),
      });
    };

    const handleUp = () => {
      setIsDrawing(false);
      if (!viewportRef.current) return;

      // UPDATED: Select ALL elements with IDs, not just absolute ones
      const elements = Array.from(
        document.querySelectorAll("#editor-canvas-root [id]")
      ).filter(el => el.id !== "editor-canvas-root") as HTMLElement[];

      const viewportRect = viewportRef.current.getBoundingClientRect();
      const selected: HTMLElement[] = [];
      const ids: string[] = [];

      elements.forEach((el) => {
        const elRect = el.getBoundingClientRect();
        const relativeElRect = {
          left: elRect.left - viewportRect.left,
          top: elRect.top - viewportRect.top,
          right: elRect.right - viewportRect.left,
          bottom: elRect.bottom - viewportRect.top,
        };

        // Check Intersection
        if (
          relativeElRect.left < selectionBox.x + selectionBox.width &&
          relativeElRect.right > selectionBox.x &&
          relativeElRect.top < selectionBox.y + selectionBox.height &&
          relativeElRect.bottom > selectionBox.y
        ) {
          if (!el.id) el.id = `el-${Date.now()}-${Math.random()}`;
          // Only add top-level selectable elements (avoid selecting children of selected)
          const parent = el.parentElement;
          const isParentRoot = parent?.id === "editor-canvas-root";
          if (isParentRoot || parent?.classList.contains('absolute')) {
             selected.push(el);
             ids.push(el.id);
          }
        }
      });
      setSelectedElements(selected);
      setSelectedIds(ids);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp, { once: true });
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [isDrawing, startPoint, selectionBox]);

  return (
    <div
      className="flex-1 flex flex-col relative justify-center bg-transparent items-center ml-56 mt-14"
      onContextMenu={(e) => e.preventDefault()}
    >
      <GlobalStyles />
      <div
        ref={viewportRef}
        className="overflow-auto relative outline-none max-w-[90dvw] max-h-full border border-slate-200 shadow-lg bg-transparent viewport-container"
        onMouseDown={handleStageClick}
        onContextMenu={handleContextMenu}
      >
        {isDrawing && (
          <div
            className="absolute border-2 border-dashed border-indigo-500 bg-indigo-500/10 pointer-events-none z-[9999]"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: selectionBox.width,
              height: selectionBox.height,
            }}
          />
        )}

        <div style={{ width: 1920 * zoom, height: 1080 * zoom, flexShrink: 0 }}>
          <div
            className="overflow-hidden relative bg-white shadow-2xl origin-top-left outline outline-1 outline-black/5"
            style={{
              width: "1920px",
              height: "1080px",
              transform: `scale(${zoom})`,
              lineHeight: 1.2,
            }}
          >
            <SlideStage
              content={activeSlideContent}
              onContentDblClick={handleStageDblClick}
            />

            <Moveable
              key={selectedElements.map((e) => e.id).join(",")}
              target={selectedElements}
              snappable={true}
              resizable={true}
              draggable={selectedElements.every(
                (el) => getComputedStyle(el).position === "absolute"
              )}
              rotatable={selectedElements.every(
                (el) => getComputedStyle(el).position === "absolute"
              )}
              zoom={zoom}
              className="opacity-70 moveable-control"
              renderDirections={["nw", "ne", "se", "sw"]}
              onDrag={(e) => {
                e.target.style.left = `${e.left}px`;
                e.target.style.top = `${e.top}px`;
                e.target.style.transform = `translate(0px, 0px)`;
              }}
              onResize={(e) => {
                e.target.style.width = `${e.width}px`;
                e.target.style.height = `${e.height}px`;
              }}
              onRotate={(e) => {
                e.target.style.transform = e.transform;
              }}
              onDragGroup={({ events }) =>
                events.forEach((ev) => {
                  ev.target.style.left = `${ev.left}px`;
                  ev.target.style.top = `${ev.top}px`;
                })
              }
              onResizeGroup={({ events }) =>
                events.forEach((ev) => {
                  ev.target.style.width = `${ev.width}px`;
                  ev.target.style.height = `${ev.height}px`;
                  ev.target.style.left = `${ev.drag.left}px`;
                  ev.target.style.top = `${ev.drag.top}px`;
                })
              }
              onRotateGroup={({ events }) =>
                events.forEach((ev) => {
                  ev.target.style.left = `${ev.drag.left}px`;
                  ev.target.style.top = `${ev.drag.top}px`;
                  ev.target.style.transform = ev.transform;
                })
              }
              onDragEnd={persistChanges}
              onResizeEnd={persistChanges}
              onRotateEnd={persistChanges}
              onDragGroupEnd={persistChanges}
              onResizeGroupEnd={persistChanges}
              onRotateGroupEnd={persistChanges}
            />
          </div>
        </div>

        {/* Floating Toolbars */}
        {showFormatToolbar && selection && (
          <div
            className="ui-layer"
            style={{ pointerEvents: "auto" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <TextFormattingToolbar
              isWorking={isWorking}
              setIsWorking={setIsWorking}
              position={{
                top: selection.rect.top,
                left: selection.rect.left + selection.rect.width / 2,
              }}
              showToast={showToast}
              handleApiError={handleApiError}
              onClose={() => {
                if (selection.node) selection.node.contentEditable = "false";
                setShowFormatToolbar(false);
                persistChanges();
              }}
              targetNode={selection.node}
            />
          </div>
        )}

        {selectedElements.length > 0 &&
          !isElementEditOpen &&
          !showFormatToolbar &&
          !isImageStyleOpen && (
            <div
              className="fixed z-[100] ui-layer bg-white shadow-lg rounded-full border border-indigo-100 p-1 flex gap-1 animate-in zoom-in-95 select-none"
              style={{
                top:
                  selectedElements[
                    selectedElements.length - 1
                  ].getBoundingClientRect().top - 50,
                left: selectedElements[
                  selectedElements.length - 1
                ].getBoundingClientRect().left,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <input
                type="file"
                ref={replaceImageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleReplaceImage}
              />
              <button
                onClick={() => {
                  setIsElementEditOpen(true);
                  setIsImageStyleOpen(false);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold transition hover:shadow-lg"
              >
                <Sparkles size={13} /> AI Edit
              </button>

              {/* UPDATED CONDITION: Only show image tools if strictly an image or image container */}
              {selectedElements.length === 1 && isImageElement(selectedElements[0]) && (
                <>
                  <div className="w-px bg-slate-200 mx-1 self-center h-4" />
                  <BtnSmall
                    icon={RefreshCw}
                    onClick={() => replaceImageInputRef.current?.click()}
                  />
                  <BtnSmall
                    icon={Crop}
                    onClick={() => {
                      setIsImageStyleOpen(true);
                      setIsElementEditOpen(false);
                    }}
                  />
                </>
              )}

              <div className="w-px bg-slate-200 mx-1 self-center h-4" />
              <BtnSmall
                icon={Copy}
                onClick={() =>
                  onContextAction("duplicate", null, selectedElements[0])
                }
              />
              <BtnSmall
                icon={Trash2}
                color="text-red-500 hover:bg-red-50"
                onClick={() =>
                  onContextAction("delete", null, selectedElements[0])
                }
              />
            </div>
          )}

        {isImageStyleOpen && selectedElements.length > 0 && (
          <div
            className="fixed z-[110] ui-layer bg-white p-2 rounded-xl shadow-2xl border border-indigo-200 flex flex-col gap-2 w-auto animate-in slide-in-from-bottom-2"
            style={{
              top: selectedElements[0].getBoundingClientRect().top - 100,
              left: selectedElements[0].getBoundingClientRect().left,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Image Style
              </span>
              <button
                onClick={() => setIsImageStyleOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-1">
              <div className="text-xs text-slate-400 mb-1 font-semibold">
                Fit
              </div>
              <div className="flex gap-1">
                <StyleButton
                  onClick={() => {
                    applyImageObjectFit("contain");
                  }}
                >
                  Contain
                </StyleButton>
                <StyleButton
                  onClick={() => {
                    applyImageObjectFit("fill");
                  }}
                >
                  Stretch
                </StyleButton>
                <StyleButton
                  onClick={() => {
                    applyImageObjectFit("cover");
                  }}
                >
                  Cover
                </StyleButton>
              </div>
            </div>

            <div className="px-1">
              <div className="text-xs text-slate-400 mb-1 font-semibold">
                Corners
              </div>
              <div className="flex items-center gap-2">
                <Sliders size={14} className="text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="50"
                  defaultValue={0}
                  onChange={(e) => applyBorderRadius(`${e.target.value}%`)}
                  className="w-24"
                />
              </div>
            </div>

            <div className="w-full h-px bg-slate-200 my-1" />
            <StyleButton
              onClick={() => {
                const el = selectedElements[0];
                const img =
                  el.tagName === "IMG"
                    ? (el as HTMLImageElement)
                    : el.querySelector("img");
                if (img) {
                  setCroppingElement({
                    element: el,
                    img,
                    imgRect: img.getBoundingClientRect(),
                  });
                  setIsImageStyleOpen(false);
                }
              }}
            >
              Crop Image
            </StyleButton>
          </div>
        )}

        {croppingElement && cropBox && (
          <>
            <div className="fixed inset-0 bg-black/50 z-[100]" />
            <div
              className="cropper-box fixed z-[200] border-2 border-dashed border-white cursor-move"
              style={{
                top: cropBox.top,
                left: cropBox.left,
                width: cropBox.width,
                height: cropBox.height,
                backgroundImage: `url(${croppingElement.img.src})`,
                backgroundSize: `${croppingElement.imgRect.width}px ${croppingElement.imgRect.height}px`,
                backgroundPosition: `-${
                  cropBox.left - croppingElement.imgRect.left
                }px -${cropBox.top - croppingElement.imgRect.top}px`,
              }}
            />
            <Moveable
              target={".cropper-box"}
              className="cropper-controls" // Applies the high Z-index class
              draggable={true}
              resizable={true}
              snappable={true}
              renderDirections={["nw", "ne", "sw", "se"]} // Handles for resize
              edge={true}
              bounds={{
                left: croppingElement.imgRect.left,
                top: croppingElement.imgRect.top,
                right: croppingElement.imgRect.right,
                bottom: croppingElement.imgRect.bottom,
              }}
              onDrag={(e) => {
                e.target.style.left = `${e.left}px`;
                e.target.style.top = `${e.top}px`;
                e.target.style.backgroundPosition = `-${
                  e.left - croppingElement.imgRect.left
                }px -${e.top - croppingElement.imgRect.top}px`;
                setCropBox({ ...cropBox, left: e.left, top: e.top });
              }}
              onResize={(e) => {
                e.target.style.left = `${e.drag.left}px`;
                e.target.style.top = `${e.drag.top}px`;
                e.target.style.width = `${e.width}px`;
                e.target.style.height = `${e.height}px`;
                e.target.style.backgroundPosition = `-${
                  e.drag.left - croppingElement.imgRect.left
                }px -${e.drag.top - croppingElement.imgRect.top}px`;
                setCropBox({
                  left: e.drag.left,
                  top: e.drag.top,
                  width: e.width,
                  height: e.height,
                });
              }}
            />
            <div
              className="fixed z-[200] bg-white shadow-lg rounded-lg p-2 flex gap-2"
              style={{
                top: cropBox.top + cropBox.height + 10,
                left: cropBox.left,
              }}
            >
              <Button
                onClick={() => setCroppingElement(null)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button onClick={handleApplyCrop} size="sm">
                Apply Crop
              </Button>
            </div>
          </>
        )}

        {isElementEditOpen && selectedElements.length > 0 && (
          <div
            className="fixed z-[110] ui-layer bg-white p-2 rounded-xl shadow-2xl border border-indigo-200 flex gap-2 w-96 animate-in slide-in-from-bottom-2"
            style={{
              top: selectedElements[0].getBoundingClientRect().top - 60,
              left: selectedElements[0].getBoundingClientRect().left,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              className="flex-1 text-sm outline-none px-2 font-medium"
              placeholder="E.g. Convert to bullet list..."
              value={editInstruction}
              onChange={(e) => setEditInstruction(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onElementRemix(selectedElements[0], editInstruction);
                  setEditInstruction("");
                  setIsElementEditOpen(false);
                }
              }}
            />
            <button
              onClick={() => {
                onElementRemix(selectedElements[0], editInstruction);
                setEditInstruction("");
                setIsElementEditOpen(false);
              }}
              className="bg-indigo-600 text-white rounded-lg p-1.5"
            >
              <Sparkles size={16} />
            </button>
          </div>
        )}

        {contextMenu && (
          <div className="ui-layer">
            <ContextMenu
              position={contextMenu}
              targetType={contextMenu.targetType}
              onAction={(action, payload) => {
                onContextAction(action, payload, contextMenu.element);
                setContextMenu(null);
              }}
              onClose={() => setContextMenu(null)}
            />
          </div>
        )}

        {/* AI Processing Overlay */}
        {isWorking && (
          <div className="absolute inset-0 z-[400] bg-white/20 backdrop-blur-[2px] flex items-center justify-center font-bold text-indigo-900 pointer-events-none">
            <div className="bg-white p-3 px-6 rounded-full shadow-2xl flex gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>{" "}
              AI is Working...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};