// File: services/export/pptx.ts
import { Deck } from '../../types';
import { exportToPptx } from 'dom-to-pptx';
import { sanitizeFilename } from './helpers';

export const exportAsPPTX = async (deck: Deck) => {
  const root = document.createElement('div');
  root.id = 'pptx-export-root';
  root.style.position = 'fixed';
  root.style.left = '0'; 
  root.style.top = '0';
  root.style.zIndex = '-9999';
  root.style.opacity = '0';
  root.style.width = '1920px';
  root.style.height = '1080px';
  root.style.background = 'white';

  try {
    document.body.appendChild(root); 

    deck.slides.forEach((slide) => {
      const slideEl = document.createElement('div');
      slideEl.className = 'slide-container';
      slideEl.style.width = '1920px';
      slideEl.style.height = '1080px';
      slideEl.style.position = 'relative';
      slideEl.style.overflow = 'hidden'; 
      slideEl.innerHTML = slide.content;
      
      // Cleanup for export
      slideEl.querySelectorAll('.moveable-control, .moveable-control-box').forEach(n => (n as HTMLElement).style.display = 'none');
      
      root.appendChild(slideEl);
    });

    const slideElements = root.querySelectorAll('.slide-container');
    const elementsArray = Array.from(slideElements);

    if (elementsArray.length === 0) {
      throw new Error("No slides found to export.");
    }

    await exportToPptx(elementsArray, { 
      fileName: `${sanitizeFilename(deck.title)}.pptx`
    });

  } catch (error) {
    console.error('PPTX export error:', error);
    throw new Error('PPTX export encountered an error. Check console for details.');
  } finally {
    if (document.body.contains(root)) {
      document.body.removeChild(root);
    }
  }
};