import React, { useState } from 'react';
import { ArrowRight, Settings, X, Sparkles, Palette, Check } from 'lucide-react';
import { ModeCard } from '../../components/Generator/ModeCard';
import { Button } from '../../components/Button';
import { Theme } from '../../types';
import { geminiService } from '../../services/gemini';

interface StepThemeProps {
  onBack: () => void;
  onGenerate: () => void;
  selectedMode: "concise" | "balanced" | "theory";
  setSelectedMode: (mode: "concise" | "balanced" | "theory") => void;
  displayThemes: Theme[];
  setDisplayThemes: (themes: Theme[]) => void;
  selectedTheme: Theme;
  setSelectedTheme: (theme: Theme) => void;
  advancedInstructions: string;
  setAdvancedInstructions: (text: string) => void;
  handleApiError: (error: any) => boolean;
  showToast: (msg: string) => void;
}

export const StepTheme: React.FC<StepThemeProps> = ({
  onBack,
  onGenerate,
  selectedMode,
  setSelectedMode,
  displayThemes,
  setDisplayThemes,
  selectedTheme,
  setSelectedTheme,
  advancedInstructions,
  setAdvancedInstructions,
  handleApiError,
  showToast
}) => {
  const [palettePrompt, setPalettePrompt] = useState("");
  const [isGeneratingPalette, setIsGeneratingPalette] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [suggestedPalettes, setSuggestedPalettes] = useState<string[][] | null>(null);

  const handleGenerateColorPalettes = async () => {
    if (!palettePrompt) return;
    setIsGeneratingPalette(true);
    setSuggestedPalettes(null);
    try {
      const palettes = await geminiService.generateColorPalettes(palettePrompt);
      if (palettes && palettes.length > 0) {
        setSuggestedPalettes(palettes);
      } else {
        showToast("AI could not find palettes for that prompt.");
      }
    } catch (error: any) {
      if (!handleApiError(error)) showToast("AI could not generate palette.");
    } finally {
      setIsGeneratingPalette(false);
    }
  };

  const handleApplyPalette = (themeId: string, newPalette: string[]) => {
    const updatedThemes = displayThemes.map((theme) =>
      theme.id === themeId ? { ...theme, colors: newPalette } : theme
    );
    setDisplayThemes(updatedThemes);
    if (selectedTheme.id === themeId) {
      setSelectedTheme({ ...selectedTheme, colors: newPalette });
    }
    setEditingThemeId(null);
    setSuggestedPalettes(null);
    setPalettePrompt("");
    showToast("Palette applied!");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full relative">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition">
          <ArrowRight className="rotate-180" size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900">Design Studio</h2>
          <p className="text-slate-500">Choose how your content is presented.</p>
        </div>
      </div>

      <div className="mb-8 overflow-y-auto">
        <h3 className="text-2xl font-black text-slate-900 mb-4">Text Mode</h3>
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          <ModeCard mode="concise" current={selectedMode} onClick={() => setSelectedMode("concise")} />
          <ModeCard mode="balanced" current={selectedMode} onClick={() => setSelectedMode("balanced")} />
          <ModeCard mode="theory" current={selectedMode} onClick={() => setSelectedMode("theory")} />
        </div>
        <hr className="my-6 mr-2"></hr>
        
        <h3 className="text-2xl font-black text-slate-900 mb-4 mt-6">Theme Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-24 p-2">
          {displayThemes.map((theme) => (
            <div
              key={theme.id}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all h-60 duration-300 bg-white cursor-pointer
                ${selectedTheme.id === theme.id ? "border-indigo-600 ring-4 ring-indigo-600/10 scale-[1.02] shadow-xl" : "border-slate-200 hover:border-indigo-300 hover:shadow-lg"}`}
              onClick={() => { setSelectedTheme(theme); setEditingThemeId(null); setSuggestedPalettes(null); }}
            >
              {/* Preview Area */}
              <div className="h-40 bg-slate-100 relative">
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: theme.html }}></div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  {selectedTheme.id === theme.id ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingThemeId(theme.id); setSuggestedPalettes(null); setPalettePrompt(""); }}
                      className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                    >
                      <Palette size={14} /> Customize Colors
                    </button>
                  ) : <span className="text-white font-bold border-2 border-white px-4 py-1 rounded-full">Select Theme</span>}
                </div>
              </div>
              
              {/* Footer Area */}
              <div className="p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{theme.name}</h3>
                  {selectedTheme.id === theme.id && <div className="bg-indigo-600 text-white p-1 rounded-full"><Check size={10} /></div>}
                </div>
                <div className="flex gap-1.5 h-3">
                  {theme.colors.map((c, i) => <div key={i} className="w-4 h-4 rounded-full ring-1 ring-black/5" style={{ backgroundColor: c }}></div>)}
                </div>
              </div>

              {/* Palette Generator Popover */}
              {editingThemeId === theme.id && (
                <div onClick={(e) => e.stopPropagation()} className="absolute inset-x-0 bottom-0 bg-white border-t border-indigo-100 p-4 shadow-2xl z-20 animate-in slide-in-from-bottom-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase">AI Palette Generator</span>
                    <button onClick={() => setEditingThemeId(null)}><X size={14} className="text-slate-400 hover:text-slate-600" /></button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500"
                      placeholder="e.g. 'Ocean blue', 'Sunset'"
                      value={palettePrompt}
                      onChange={(e) => setPalettePrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerateColorPalettes()}
                    />
                    <button disabled={isGeneratingPalette} onClick={handleGenerateColorPalettes} className="bg-indigo-600 text-white rounded-lg p-1.5 hover:bg-indigo-700 disabled:opacity-50">
                      {isGeneratingPalette ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={12} />}
                    </button>
                  </div>
                  <div className="mt-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                    {isGeneratingPalette && <p className="text-xs text-slate-400 text-center py-2">Generating suggestions...</p>}
                    {suggestedPalettes && (
                      <div className="space-y-1.5 pt-2">
                        {suggestedPalettes.map((palette, p_idx) => (
                          <button key={p_idx} onClick={() => handleApplyPalette(theme.id, palette)} className="flex gap-1 w-full p-1 rounded-md hover:bg-indigo-50">
                            {palette.map((color, c_idx) => <div key={c_idx} className="h-4 flex-1 rounded-sm" style={{ backgroundColor: color }}></div>)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex-1">
            {!showAdvancedSettings ? (
              <button onClick={() => setShowAdvancedSettings(true)} className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-2"><Settings size={16} /> Advanced Settings</button>
            ) : (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                <button onClick={() => setShowAdvancedSettings(false)} className="bg-slate-100 p-1.5 rounded-md text-slate-500 hover:bg-slate-200"><X size={14} /></button>
                <div className="flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase mb-1">Custom Instructions</span><input className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-96 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 'Focus heavily on financial data', 'Use humor'" value={advancedInstructions} onChange={(e) => setAdvancedInstructions(e.target.value)} /></div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg" onClick={onGenerate} className="px-8 py-6 text-lg rounded-xl shadow-xl shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">Generate Slides <Sparkles className="ml-2 w-5 h-5" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};