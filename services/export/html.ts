// File: services/export/html.ts
import { Deck } from '../../types';
import { sanitizeFilename } from './helpers';

export const exportAsHTML = async (deck: Deck) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${deck.title}</title>
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Chart.js for charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    
    <!-- Mermaid for diagrams -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    
    <!-- Ionicons for icons -->
    <script type="module" src="https://cdn.jsdelivr.net/npm/ionicons@7/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/ionicons@7/dist/ionicons/ionicons.js"></script>
    
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: system-ui, -apple-system, sans-serif; 
            background: #1e293b; 
            overflow: hidden;
        }
        .presentation-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .slide-container {
            width: 1920px; 
            height: 1080px; 
            background: white;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3); 
            position: relative;
            page-break-after: always; 
            line-height: 1.2;
            transform-origin: top left;
        }
        .slide-navigation {
            position: fixed; 
            bottom: 20px; 
            left: 50%; 
            transform: translateX(-50%);
            background: white; 
            padding: 10px 20px; 
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2); 
            display: flex; 
            gap: 10px; 
            z-index: 1000;
        }
        .nav-btn {
            padding: 8px 16px; 
            border: none; 
            background: #6366f1; 
            color: white;
            border-radius: 25px; 
            cursor: pointer; 
            font-weight: 600; 
            font-size: 14px; 
            transition: all 0.2s;
        }
        .nav-btn:hover { 
            background: #4f46e5; 
            transform: translateY(-2px); 
        }
        .nav-btn:disabled { 
            background: #cbd5e1; 
            cursor: not-allowed; 
            transform: none; 
        }
        .slide-number {
            padding: 8px 16px; 
            background: #f1f5f9; 
            border-radius: 20px;
            font-weight: 600; 
            color: #475569; 
            display: flex; 
            align-items: center;
        }
        @media print {
            body { 
                background: white; 
                overflow: visible;
            }
            .presentation-container {
                position: static;
                transform: none !important;
                width: auto;
                height: auto;
            }
            .slide-container { 
                margin: 0; 
                box-shadow: none; 
                page-break-after: always;
                transform: none !important;
                width: 1920px !important;
                height: 1080px !important;
            }
            .slide-navigation { 
                display: none; 
            }
        }
        .moveable-control, .moveable-control-box { 
            display: none !important; 
        }
    </style>
</head>
<body>
    <div id="presentation" class="presentation-container">
        ${deck.slides.map((slide, idx) => `
            <div class="slide-container" data-slide="${idx}" style="display: ${idx === 0 ? 'block' : 'none'};">
                ${slide.content}
            </div>
        `).join('')}
    </div>
    
    <div class="slide-navigation">
        <button class="nav-btn" id="prevBtn" onclick="navigateSlide(-1)">← Previous</button>
        <div class="slide-number">
            <span id="currentSlide">1</span> / <span id="totalSlides">${deck.slides.length}</span>
        </div>
        <button class="nav-btn" id="nextBtn" onclick="navigateSlide(1)">Next →</button>
    </div>
    
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
        let currentSlideIndex = 0;
        const totalSlides = ${deck.slides.length};
        
        function navigateSlide(direction) {
            const newIndex = currentSlideIndex + direction;
            if (newIndex < 0 || newIndex >= totalSlides) return;
            document.querySelector(\`[data-slide="\${currentSlideIndex}"]\`).style.display = 'none';
            currentSlideIndex = newIndex;
            const nextSlide = document.querySelector(\`[data-slide="\${currentSlideIndex}"]\`);
            if (nextSlide) {
                nextSlide.style.display = 'block';
            }
            document.getElementById('currentSlide').textContent = currentSlideIndex + 1;
            document.getElementById('prevBtn').disabled = currentSlideIndex === 0;
            document.getElementById('nextBtn').disabled = currentSlideIndex === totalSlides - 1;
            reinitializeCharts();
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') { 
                e.preventDefault(); 
                navigateSlide(1); 
            } else if (e.key === 'ArrowLeft') { 
                e.preventDefault(); 
                navigateSlide(-1); 
            }
        });
        
        document.getElementById('prevBtn').disabled = true;
        if (totalSlides === 1) document.getElementById('nextBtn').disabled = true;
        
        function reinitializeCharts() {
            const currentSlide = document.querySelector(\`[data-slide="\${currentSlideIndex}"]\`);
            const canvases = currentSlide?.querySelectorAll('canvas[data-chart]');
            canvases?.forEach(canvas => {
                try {
                    const chartData = JSON.parse(canvas.getAttribute('data-chart') || '{}');
                    if (window.Chart && chartData.type) new Chart(canvas, chartData);
                } catch (e) { console.warn('Could not initialize chart:', e); }
            });
        }
        
        function adjustSlideSize() {
            const presentationContainer = document.getElementById('presentation');
            const slideWidth = 1920;
            const slideHeight = 1080;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            const scale = Math.min(windowWidth / slideWidth, windowHeight / slideHeight);
            
            presentationContainer.style.transform = \`scale(\${scale})\`;
        }
        
        window.addEventListener('resize', adjustSlideSize);
        
        setTimeout(() => {
            reinitializeCharts();
            adjustSlideSize();
        }, 100);
    </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(deck.title)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};