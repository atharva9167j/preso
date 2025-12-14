// File: constants.ts
export const FONTS = [
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Oswald', value: 'Oswald, sans-serif' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
  { name: 'Raleway', value: 'Raleway, sans-serif' },
  { name: 'PT Sans', value: 'PT Sans, sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Noto Sans', value: 'Noto Sans, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Ubuntu', value: 'Ubuntu, sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Lora', value: 'Lora, serif' },
  { name: 'Inconsolata', value: 'Inconsolata, monospace' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif' },
  { name: 'Quicksand', value: 'Quicksand, sans-serif' },
  { name: 'Bebas Neue', value: 'Bebas Neue, cursive' },
  { name: 'Josefin Sans', value: 'Josefin Sans, sans-serif' },
  { name: 'Fjalla One', value: 'Fjalla One, sans-serif' },
  { name: 'Indie Flower', value: 'Indie Flower, cursive' },
  { name: 'Pacifico', value: 'Pacifico, cursive' },
  { name: 'Shadows Into Light', value: 'Shadows Into Light, cursive' },
  { name: 'Anton', value: 'Anton, sans-serif' },
  { name: 'Dancing Script', value: 'Dancing Script, cursive' },
];

export const DB_NAME = 'PresoDB';
export const DB_VERSION = 1;
export const STORE_DECKS = 'decks';
export const STORE_SETTINGS = 'settings';
export const STORE_ASSETS = 'assets';

export const STANDARD_MODEL = 'gemini-3-pro-preview';
export const FLASH_PREVIEW_MODEL = 'gemini-flash-latest';
export const FLASH_LITE_MODEL = 'gemini-flash-lite-latest';
export const FLASH_OLD_MODEL = 'gemini-flash-lite-latest';

export const POLLINATIONS_PUBLIC_API_KEY = process.env.POLLINATIONS_PUBLIC_API_KEY;

export const EXAMPLE = `
<div class='relative w-[1920px] h-[1080px] bg-white overflow-hidden'>
  <!-- Example content structure preserved for reference -->
  <div class='w-1/3 bg-slate-900 relative overflow-hidden flex flex-col p-10 justify-between'>
    <div class='relative z-10'>
      <h2 class='text-4xl font-bold text-white leading-tight mb-4'>
        Example Slide <br />
      </h2>
      <p class='text-slate-400 leading-relaxed'>
        This is a reference structure for the AI.
      </p>
    </div>
  </div>
</div>
`;