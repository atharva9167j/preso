// File: services/export/helpers.ts
import { THEMES } from '../../themes';

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
    .substring(0, 50);
};

export const getThemeStyles = (themeId: string) => {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  return theme;
};

// Helper: Converts ion-icon to SVG and hardcodes the colors for export consistency
export const flattenIcons = async (container: HTMLElement) => {
  const icons = Array.from(container.querySelectorAll('ion-icon'));
  
  await Promise.all(icons.map(async (icon) => {
    const name = icon.getAttribute('name');
    if (!name) return;

    try {
      // 1. Capture the exact computed styles from the browser
      const style = window.getComputedStyle(icon);
      const color = style.color; 
      const fontSize = style.fontSize;
      
      // 2. Fetch the raw SVG
      const res = await fetch(`https://cdn.jsdelivr.net/npm/ionicons@7/dist/svg/${name}.svg`);
      if (!res.ok) return;
      
      let svgText = await res.text();

      // 3. Replace 'currentColor' with the actual hex/rgb value
      svgText = svgText.replace(/currentColor/g, color);

      // 4. Parse the modified string
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = doc.documentElement;

      // 5. Force explicit dimensions and styles
      svgElement.setAttribute('width', fontSize);
      svgElement.setAttribute('height', fontSize);
      svgElement.style.width = fontSize;
      svgElement.style.height = fontSize;
      svgElement.style.display = 'inline-block';
      svgElement.style.verticalAlign = 'middle';
      
      // 6. Explicitly set fill/stroke
      if (name.includes('-outline')) {
          svgElement.style.fill = 'none';
          svgElement.style.stroke = color;
      } else {
          svgElement.style.fill = color;
          svgElement.style.stroke = 'none';
      }

      // 7. Replace the web component
      icon.replaceWith(svgElement);
      
    } catch (error) {
      console.error(`Failed to process icon ${name}`, error);
    }
  }));
};