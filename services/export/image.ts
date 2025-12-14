// File: services/export/image.ts
import { sanitizeFilename } from './helpers';

export const exportSlideAsImage = async (slideContent: string, slideName: string = 'slide') => {
  // We use html2canvas dynamically to avoid heavy initial bundle if not needed
  // Note: In a real environment, you might import this at the top if tree-shaking works well
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.width = '1920px';
  container.style.height = '1080px';
  container.style.background = 'white';
  container.innerHTML = slideContent;
  document.body.appendChild(container);
  
  try {
    // Wait for assets
    await new Promise(resolve => setTimeout(resolve, 500));

    // @ts-ignore
    if (!window.html2canvas) {
        throw new Error("html2canvas library is missing");
    }

    // @ts-ignore
    const canvas = await window.html2canvas(container, {
      width: 1920,
      height: 1080,
      scale: 2, 
      logging: false,
      useCORS: true
    });
    
    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sanitizeFilename(slideName)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  } catch (error) {
    console.error('Image export error:', error);
    throw new Error('Could not export slide as image.');
  } finally {
    document.body.removeChild(container);
  }
};