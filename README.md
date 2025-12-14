<div>
<img src="./assets/logo.png" style="border-radius: 3px;">
</div>

### **The Future of AI-Powered Presentation Design**

Preso is a high-fidelity, AI-driven presentation platform that allows users to transform simple prompts, raw text, or complex documents into stunning, production-ready slide decks in seconds. Built with a focus on "Apple-level" aesthetics and a pixel-perfect editing experience.

### Try Live: [Preso | Build Beautiful Presentations using AI for free](https://preso-ai.vercel.app/)
<br>

![Version](https://img.shields.io/badge/version-1.0.0-indigo)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google&logoColor=white)

---

## ✨ Key Features

- **🚀 AI Generation Engines**: 
    - **Prompt-to-Deck**: Research and structure topics from a single sentence.
    - **Text-to-Deck**: Transform messy notes or articles into structured narratives.
    - **Doc-to-Deck**: Extract insights from PDFs, MD, or Text files.
- **🎨 Design Studio**: 
    - **Curated Themes**: Switch between Modern Professional, Luxury Noir, Cyberpunk, and more.
    - **AI Color Palettes**: Generate harmonious color schemes based on mood or brand.
    - **Adaptive Layouts**: Intelligent absolute positioning that rivals high-end design software.
- **🛠️ Professional Editor**:
    - **Pixel-Perfect Canvas**: 1920x1080 fixed canvas with drag, resize, and rotate capabilities.
    - **AI Remix**: Edit specific elements or entire slides using natural language instructions.
    - **Rich Formatting**: Floating text toolbars, image cropping, and style managers.
- **📤 Universal Export**:
    - **Interactive HTML**: Standalone presentations with built-in navigation.
    - **PDF & PPTX**: Clean, print-ready, and editable formats.
    - **PNG**: High-resolution slide snapshots.

---

## 🛠️ Tech Stack

- **Core**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **AI**: Google Gemini Pro & Flash (via `@google/generai`)
- **Visuals**: 
    - `OGL` for GPU-accelerated backgrounds.
    - `Lucide React` & `Ionicons` for iconography.
    - `QuickChart.io` for dynamic data visualization.
    - `Pollinations AI` for generative imagery.
- **Canvas Engine**: `react-moveable` for advanced DOM manipulation.
- **Storage**: Browser-native `IndexedDB` for offline-first persistence.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Google AI Studio API Key -> [Get it here](https://aistudio.google.com/app/apikey)
- A Pollinations AI API Key (for images) -> [Get it here](https://enter.pollinations.ai/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/atharva9167j/preso.git
   cd preso
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_POLLINATIONS_PUBLIC_API_KEY=your_pollinations_api_key_here
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

---

## 🔒 Security & Privacy

Preso is built with a **Privacy-First** approach:
- **Local Storage**: All your decks and settings are stored in your browser's IndexedDB. Your data never touches our servers.
- **API Keys**: Your personal API keys are stored locally and are only used to communicate directly with Google's Gemini API.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ by Atharva Jagtap
</p>