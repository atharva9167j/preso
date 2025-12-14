import React, { useEffect, useState, useRef, useCallback } from "react";
import { Deck } from "../types";
import { geminiService } from "../services/gemini";
import { THEMES } from "../themes";
import { useDeckHistory } from "../hooks/useDeckHistory";
import { saveDeck, getApiKey, getDeckById } from "../services/db";
import { UpgradeModal } from "../components/UpgradeModal";

// Components
import { PresentationMode } from "../components/DeckView/PresentationMode";
import { SlideNavigation } from "../components/DeckView/SlideNavigation";
import { FloatingControls } from "../components/DeckView/FloatingControl";
import { EditorCanvas } from "../components/DeckView/EditorCanvas";

interface DeckViewProps {
  deckId: string;
  setDeckTitle: (title: string) => void;
  isThemePickerOpen: boolean;
  onCloseThemePicker: () => void;
  isPresentationMode: boolean;
  setIsPresentationMode: (value: boolean) => void;
  activeSlideIndex: number;
  setActiveSlideIndex: (index: number) => void;
  deck: Deck | null;
  setDeck: (deck: Deck) => void;
  onUpgrade: () => void;
  isWorking: boolean;
  setIsWorking: () => void;
  showToast: () => void;
}

export const DeckView: React.FC<DeckViewProps> = ({
  deckId,
  setDeckTitle,
  isThemePickerOpen,
  onCloseThemePicker,
  isPresentationMode,
  setIsPresentationMode,
  activeSlideIndex,
  setActiveSlideIndex,
  deck,
  setDeck,
  onUpgrade,
  isWorking,
  setIsWorking,
  showToast,
}) => {
  const [zoom, setZoom] = useState(0.65);
  
  // Rate Limit / Upgrade State
  const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState(false);


  const handleApiError = (error: any) => {
    if (error.message && error.message.includes("429")) {
      setIsRateLimitModalOpen(true);
      return true;
    }
    return false;
  };

  // Undo/Redo Hook
  const { undo, redo, saveSlide, pushToUndoStack, updateRef, deckRef } = useDeckHistory(
    deck, setDeck, showToast
  );

  // Sync ref when deck changes from outside (e.g. initial load)
  useEffect(() => {
    if (deck) {
      updateRef(deck);
      setDeckTitle(deck.title);
    }
  }, [deck, setDeckTitle]);

  useEffect(() => {
    const loadDeck = async () => {
      if (!deckId) return;
      try {
        const d = await getDeckById(deckId);
        if (d) {
          setDeck(d);
          setDeckTitle(d.title);
        } else {
          showToast("Deck not found.");
        }
      } catch (e) {
        console.error("Failed to load deck", e);
        showToast("Error: Could not load your presentation.");
      }
    };

    // Only load if deck is null or IDs don't match
    if (!deck || deck.id !== deckId) {
      loadDeck();
    }
  }, [deckId, setDeck, setDeckTitle]); 

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isWorking) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, isWorking]);

  // --- Theme Handler ---
  const handleApplyTheme = async (theme: any) => {
    if (isWorking || !deck) return;
    pushToUndoStack();
    setIsWorking(true);
    showToast("Applying theme...");
    try {
      const restyledSlides = await geminiService.restyleDeck(deck.slides, deck.theme as any, theme);
      const newDeck = { ...deck, slides: restyledSlides, theme: theme.id, updatedAt: Date.now() };
      setDeck(newDeck);
      updateRef(newDeck);
      await saveDeck(newDeck);
      showToast("Theme applied!");
    } catch (error: any) {
      if (!handleApiError(error)) showToast("Theme failed.");
    } finally {
      setIsWorking(false);
      onCloseThemePicker();
    }
  };

  // --- Element Remix Handler ---
  const handleElementRemix = async (element: HTMLElement, instruction: string) => {
    setIsWorking(true);
    try {
      const html = await geminiService.editContent(element.outerHTML, instruction, "element");
      const box = document.createElement("div");
      box.innerHTML = html.trim();
      const newEl = box.firstElementChild as HTMLElement;
      if (newEl) {
        element.replaceWith(newEl);
        // Save using the current full HTML of the active slide
        const root = document.getElementById("editor-canvas-root");
        if(root) saveSlide(activeSlideIndex, root.innerHTML);
      }
    } catch (error: any) {
      if (!handleApiError(error)) showToast("Edit failed");
    } finally {
      setIsWorking(false);
    }
  };

  // --- Global Remix Handler ---
  const handleGlobalRemix = async (instruction: string) => {
    const root = document.getElementById("editor-canvas-root");
    if (!root) return;
    setIsWorking(true);
    try {
      const html = await geminiService.editContent(root.innerHTML, instruction, "slide");
      saveSlide(activeSlideIndex, html);
    } catch (error: any) {
      if (!handleApiError(error)) showToast("Remix failed");
    } finally {
      setIsWorking(false);
    }
  };

  // --- Context Actions (Duplicate/Delete/Insert) ---
  const handleContextAction = (action: string, payload?: any, element?: HTMLElement) => {
    if(action === 'delete' && element) {
        element.remove();
    } else if (action === 'duplicate' && element) {
        const clone = element.cloneNode(true) as HTMLElement;
        const rect = element.getBoundingClientRect();
        if(element.style.position === 'absolute' || element.classList.contains('absolute')) {
             clone.style.left = (parseFloat(element.style.left) || 0) + 20 + 'px';
             clone.style.top = (parseFloat(element.style.top) || 0) + 20 + 'px';
        }
        element.parentElement?.appendChild(clone);
    }
    // Save state after DOM manipulation
    const root = document.getElementById("editor-canvas-root");
    if(root) saveSlide(activeSlideIndex, root.innerHTML);
  };

  // --- Render ---

  if (!deck) return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  if (isPresentationMode) {
    return <PresentationMode deck={deck} activeSlideIndex={activeSlideIndex} setActiveSlideIndex={setActiveSlideIndex} onExit={() => setIsPresentationMode(false)} />;
  }

  return (
    <div className="flex h-full bg-transparent overflow-hidden select-none font-sans">
      <div className="ui-layer">
        <UpgradeModal isOpen={isRateLimitModalOpen} onClose={() => setIsRateLimitModalOpen(false)} onUpgradeClick={() => { setIsRateLimitModalOpen(false); onUpgrade(); }} />
      </div>

      <SlideNavigation 
        deck={deck} 
        activeSlideIndex={activeSlideIndex} 
        onSlideClick={(i) => {
            setActiveSlideIndex(i); 
        }} 
        onAddSlide={() => {
            const newSlide = { id: crypto.randomUUID(), title: "New", content: '<div class="absolute inset-0 bg-white flex items-center justify-center"><h1 class="text-7xl">TITLE</h1></div>' };
            const newDeck = { ...deck, slides: [...deck.slides, newSlide], updatedAt: Date.now() };
            setDeck(newDeck);
            saveDeck(newDeck);
            setActiveSlideIndex(newDeck.slides.length - 1);
        }}
        onDeleteSlide={async (i) => {
            if(deck.slides.length <= 1) { showToast("Cannot delete last slide"); return; }
            const newSlides = deck.slides.filter((_, idx) => idx !== i);
            const newDeck = { ...deck, slides: newSlides, updatedAt: Date.now() };
            setDeck(newDeck);
            await saveDeck(newDeck);
            setActiveSlideIndex(Math.max(0, i - 1));
        }}
      />

      <EditorCanvas 
        activeSlideContent={deck.slides[activeSlideIndex].content}
        zoom={zoom}
        isWorking={isWorking}
        setIsWorking={setIsWorking}
        onContentChange={(html) => saveSlide(activeSlideIndex, html)}
        onElementRemix={handleElementRemix}
        onContextAction={handleContextAction}
        showToast={showToast}
        handleApiError={handleApiError}
      />

      <FloatingControls 
        zoom={zoom} setZoom={setZoom} 
        onPresent={() => setIsPresentationMode(true)}
        onGlobalRemix={handleGlobalRemix}
        isWorking={isWorking}
      />

      {isThemePickerOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" onClick={onCloseThemePicker} />
          <div className="bg-white w-96 h-full p-5 overflow-y-auto animate-in slide-in-from-right relative z-10 shadow-2xl border-l">
             {THEMES.map(theme => (
                 <div key={theme.id} onClick={() => handleApplyTheme(theme)} className="mb-4 cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg h-40 relative">
                     <div dangerouslySetInnerHTML={{ __html: theme.html }} className="w-full h-full" />
                     <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white p-2 font-bold">{theme.name}</div>
                 </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};