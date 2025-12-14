export interface OutlineItem {
  id: string;
  title: string;
  points: string[]; // Key bullets/content ideas for this slide
}

export type InputMode = 'prompt' | 'text' | 'document';

export interface GenerationState {
  mode: InputMode;
  input: string; // The prompt, raw text, or filename
  step: 'input' | 'researching' | 'outline' | 'generating';
}

export interface Slide {
  id?: string;
  title: string;
  content: string; 
  notes?: string; 
}

export interface Deck {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  slides: Slide[];
  theme: string;
}

export interface AppSettings {
  apiKey: string;
}

export enum GenerationStatus {
  IDLE = 'idle',
  GENERATING_OUTLINE = 'generating_outline',
  REVIEW_OUTLINE = 'review_outline',
  GENERATING_SLIDES = 'generating_slides',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: string[];
  html: string;
  prompt: string;
  example?: {
    slides: Slide[];
  };
}