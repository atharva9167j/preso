import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { UpgradeModal } from "../../components/UpgradeModal";
import { THEMES } from "../../themes";
import { geminiService } from "../../services/gemini";
import { readFileContent } from "../../services/fileParser";
import { getApiKey, saveDeck } from "../../services/db";
import { Deck, OutlineItem, InputMode, Theme } from "../../types";
import { POLLINATIONS_PUBLIC_API_KEY } from "../../constants";
import { parseLiveStream, transformPollinationsURLs, convertQuickChartTags } from "../../services/streamparser";

import { StepSelection } from "./StepSelection";
import { StepInput } from "./StepInput";
import { StepProcessing } from "./StepProcessing";
import { StepOutline } from "./StepOutline";
import { StepTheme } from "./StepTheme";
import { StepGeneration } from "./StepGeneration";

interface GeneratorProps {
  onDeckCreated: (deckId: string) => void;
  onCancel: () => void;
  onUpgrade: () => void;
}

export const Generator: React.FC<GeneratorProps> = ({ onDeckCreated, onCancel, onUpgrade }) => {
  // Steps
  const [step, setStep] = useState<"type" | "input" | "processing_outline" | "edit_outline" | "theme_selection" | "generating_slides">("type");
  
  // Data State
  const [inputMode, setInputMode] = useState<InputMode>("prompt");
  const [inputText, setInputText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numSlides, setNumSlides] = useState(8);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  
  // Theme State
  const [displayThemes, setDisplayThemes] = useState<Theme[]>(THEMES);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [selectedMode, setSelectedMode] = useState<"concise" | "balanced" | "theory">("balanced");
  const [advancedInstructions, setAdvancedInstructions] = useState("");

  // Generation State
  const [generatedSlides, setGeneratedSlides] = useState<{ title: string; content: string }[]>([]);
  const [inProgressSlideHtml, setInProgressSlideHtml] = useState("");

  // Rate Limiting / UX
  const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleApiError = (error: any) => {
    console.error("Handle API Error:", error);
    if (error.message && error.message.includes("429")) {
      setIsRateLimitModalOpen(true);
      return true;
    }
    return false;
  };

  const handleGenerateOutline = async () => {
    setStep("processing_outline");
    let textData = inputText;
    if (inputMode === "document" && uploadedFile) {
      try {
        textData = await readFileContent(uploadedFile);
      } catch (e) {
        showToast("Error reading file.");
        setStep("input");
        return;
      }
    }
    if (!textData) return;
    try {
      const generatedOutline = await geminiService.createOutline(inputMode, textData);
      setOutline(generatedOutline.slice(0, numSlides));
      setStep("edit_outline");
    } catch (e: any) {
      if (!handleApiError(e)) showToast("Failed to generate outline.");
      setStep("input");
    }
  };

  const handleFinalGeneration = async () => {
    setStep("generating_slides");
    setGeneratedSlides([]);
    setInProgressSlideHtml("");
    let fullResponse = "";

    try {
      const title =  outline[0]?.title.split(/:\s*/).slice(-1)[0] || "Untitled Presentation";
      const stream = geminiService.generatePresentationStream(
        title, outline, selectedTheme, selectedMode, advancedInstructions
      );

      for await (const chunk of stream) {
        fullResponse += chunk;
        const { completeSlides, inProgressHtml } = parseLiveStream(fullResponse);
        setGeneratedSlides(completeSlides);
        setInProgressSlideHtml(inProgressHtml);
      }

      const clean = fullResponse.trim().replace(/^```json/, "").replace(/```$/, "").replace(/^```/, "");
      const transformedJSON = convertQuickChartTags(
        transformPollinationsURLs(clean, POLLINATIONS_PUBLIC_API_KEY || "")
      );

      const parsedJson = JSON.parse(transformedJSON);
      const finalGeneratedSlides = parsedJson.slides;

      const newDeck: Deck = {
        id: crypto.randomUUID(),
        title: title,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        slides: finalGeneratedSlides.map((s: any) => ({
          id: crypto.randomUUID(),
          title: s.title,
          content: s.content,
        })),
        theme: selectedTheme.id,
      };
      await saveDeck(newDeck);
      onDeckCreated(newDeck.id);
    } catch (e: any) {
      if (!handleApiError(e)) showToast("Error generating presentation.");
      setStep("theme_selection");
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-6 mt-10 font-sans min-h-[calc(100vh-100px)] flex flex-col">
      <UpgradeModal
        isOpen={isRateLimitModalOpen}
        onClose={() => setIsRateLimitModalOpen(false)}
        onUpgradeClick={() => { setIsRateLimitModalOpen(false); onUpgrade(); }}
      />

      {toast && (
        <div className="fixed top-24 right-6 z-[99999]">
          <div className="bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-top flex items-center gap-2">
            <CheckCircle className="text-green-400" size={16} /> {toast}
          </div>
        </div>
      )}

      {step === "type" && (
        <StepSelection 
          onCancel={onCancel} 
          onSelect={(mode) => { setInputMode(mode); setStep("input"); }} 
        />
      )}

      {step === "input" && (
        <StepInput 
          inputMode={inputMode}
          inputText={inputText}
          setInputText={setInputText}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          numSlides={numSlides}
          setNumSlides={setNumSlides}
          onBack={() => setStep("type")}
          onGenerate={handleGenerateOutline}
        />
      )}

      {step === "processing_outline" && <StepProcessing />}

      {step === "edit_outline" && (
        <StepOutline
          outline={outline}
          setOutline={setOutline}
          onNext={() => setStep("theme_selection")}
          handleApiError={handleApiError}
          showToast={showToast}
        />
      )}

      {step === "theme_selection" && (
        <StepTheme
          onBack={() => setStep("edit_outline")}
          onGenerate={handleFinalGeneration}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          displayThemes={displayThemes}
          setDisplayThemes={setDisplayThemes}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          advancedInstructions={advancedInstructions}
          setAdvancedInstructions={setAdvancedInstructions}
          handleApiError={handleApiError}
          showToast={showToast}
        />
      )}

      {step === "generating_slides" && (
        <StepGeneration
          outline={outline}
          generatedSlides={generatedSlides}
          inProgressSlideHtml={inProgressSlideHtml}
        />
      )}
    </div>
  );
};