// File: services/export/pdf.ts
import { Deck } from '../../types';

export const exportAsPDF = async (deck: Deck) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error("Popup blocked. Please allow popups to export as PDF.");
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${deck.title}</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/ionicons@7/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/ionicons@7/dist/ionicons/ionicons.js"></script>
    
    <style>
        @page { size: 1920px 1080px; margin: 0; }
        body { margin: 0; padding: 0; background: white; }
        .slide-container {
            width: 1920px; height: 1080px; background: white; position: relative;
            page-break-after: always; page-break-inside: avoid; line-height: 1.2;
        }
        .slide-container:last-child { page-break-after: auto; }
        .moveable-control, .moveable-control-box, [contenteditable="true"] { outline: none !important; border: none !important; }
        img { max-width: 100%; height: auto; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    </style>
</head>
<body>
    ${deck.slides.map((slide) => `
        <div class="slide-container">
            ${slide.content}
        </div>
    `).join('')}
    
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
        window.addEventListener('load', () => {
            const canvases = document.querySelectorAll('canvas[data-chart]');
            canvases.forEach(canvas => {
                try {
                    const chartData = JSON.parse(canvas.getAttribute('data-chart') || '{}');
                    if (window.Chart && chartData.type) new Chart(canvas, chartData);
                } catch (e) { console.warn('Could not initialize chart:', e); }
            });
            setTimeout(() => { window.print(); }, 1000);
        });
    </script>
</body>
</html>`;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};