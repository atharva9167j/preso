// File: services/export/index.ts
import { Deck } from '../../types';
import { exportAsHTML } from './html';
import { exportAsPDF } from './pdf';
import { exportAsPPTX } from './pptx';
import { exportSlideAsImage } from './image';

export const exportPresentation = async (
  deck: Deck, 
  format: 'html' | 'pdf' | 'pptx' | 'image',
  slideIndex?: number
) => {
  switch (format) {
    case 'html':
      await exportAsHTML(deck);
      break;
    case 'pdf':
      await exportAsPDF(deck);
      break;
    case 'pptx':
      await exportAsPPTX(deck);
      break;
    case 'image':
      if (slideIndex !== undefined && deck.slides[slideIndex]) {
        await exportSlideAsImage(
          deck.slides[slideIndex].content,
          `${deck.title}_slide_${slideIndex + 1}`
        );
      } else {
        throw new Error('Please select a slide to export as image');
      }
      break;
    default:
      throw new Error('Unsupported export format');
  }
};

export * from './html';
export * from './pdf';
export * from './pptx';
export * from './image';
export * from './helpers';