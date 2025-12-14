import React, { useEffect, useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Deck } from "../../types";

interface PresentationModeProps {
  deck: Deck;
  activeSlideIndex: number;
  setActiveSlideIndex: (index: number) => void;
  onExit: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  deck,
  activeSlideIndex,
  setActiveSlideIndex,
  onExit,
}) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSlide = deck.slides[activeSlideIndex];

  // 1. FULLSCREEN LOGIC
  useEffect(() => {
    const enterFullscreen = async () => {
      const elem = document.documentElement;
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen request denied:", err);
      }
    };

    // Attempt immediately on mount
    enterFullscreen();

    // Cleanup on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.warn(err));
      }
    };
  }, []);

  // 2. SCALING LOGIC (Fixes Cropping)
  // We calculate how much we need to shrink/grow the 1920x1080 slide to fit the current window
  useEffect(() => {
    const handleResize = () => {
      // 1920 x 1080 is our base "Canvas" size
      const baseWidth = 1920;
      const baseHeight = 1080;
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate the scale needed to fit width and height
      const scaleX = windowWidth / baseWidth;
      const scaleY = windowHeight / baseHeight;

      // Choose the smaller scale to ensure it fits entirely (contain)
      const newScale = Math.min(scaleX, scaleY);
      
      setScale(newScale);
    };

    handleResize(); // Initial calc
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onExit();
      } else if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setActiveSlideIndex(Math.min(activeSlideIndex + 1, deck.slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveSlideIndex(Math.max(activeSlideIndex - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlideIndex, deck.slides.length, onExit, setActiveSlideIndex]);

  return (
    <div 
      className="fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden z-[999999]"
      ref={containerRef}
    >
      {/* Global Style for Presentation - disables pointer events on images so they don't drag */}
      <style>{`
        #presentation-root img, #presentation-root svg {
          user-select: none;
          pointer-events: none;
        }
        /* Hide scrollbars in presentation */
        html, body {
           overflow: hidden;
        }
      `}</style>

      {/* 
         THE STAGE 
         We force the container to be exactly 1920x1080, 
         then use CSS Transform Scale to fit it to the screen.
      */}
      <div 
        style={{
          width: "1920px",
          height: "1080px",
          transform: `scale(${scale})`,
          transformOrigin: "center center", // Scale from center
          flexShrink: 0, // Prevent flexbox from squishing it
        }}
        className="bg-white shadow-2xl relative overflow-hidden"
      >
        <div
          id="presentation-root"
          className="w-full h-full relative"
          dangerouslySetInnerHTML={{ __html: activeSlide.content }}
        />
      </div>

      {/* --- HUD CONTROLS (Fade in on hover) --- */}
      
      {/* 1. Top Info */}
      <div className="absolute top-0 left-0 right-0 p-6 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
         <div className="flex justify-between items-start">
             <h2 className="text-white text-xl font-bold drop-shadow-md pointer-events-auto">
               {deck.title}
             </h2>
             <div className="bg-black/50 text-white text-xs px-3 py-2 rounded backdrop-blur-sm pointer-events-auto">
               <p>← → to navigate</p>
               <p>ESC to exit</p>
             </div>
         </div>
      </div>

      {/* 2. Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[99999]">
        <div className="flex items-center gap-6 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full pointer-events-auto shadow-2xl border border-white/10">
          
          <button
            onClick={() => setActiveSlideIndex(Math.max(activeSlideIndex - 1, 0))}
            disabled={activeSlideIndex === 0}
            className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30 transition"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-white font-mono font-medium text-lg min-w-[60px] text-center select-none">
            {activeSlideIndex + 1} / {deck.slides.length}
          </span>

          <button
            onClick={() => setActiveSlideIndex(Math.min(activeSlideIndex + 1, deck.slides.length - 1))}
            disabled={activeSlideIndex === deck.slides.length - 1}
            className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30 transition"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          <button
            onClick={onExit}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition"
            title="Exit Presentation (Esc)"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};