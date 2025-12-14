// File: App.tsx
import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./views/Dashboard";
import { Generator } from "./views/Generator/Index";
import { DeckView } from "./views/DeckView";
import { Upgrade } from "./views/Upgrade";
import { Button } from "./components/Button";
import { ExportMenu } from "./components/ExportMenu";
import { Deck } from "./types";
import { saveDeck } from "./services/db";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "create" | "deck" | "upgrade"
  >("dashboard");
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const [isWorking, setIsWorking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Deck View State lifted to control header
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const handleCreateNew = () => setCurrentView("create");

  const handleDeckCreated = (deckId: string) => {
    setActiveDeckId(deckId);
    setCurrentView("deck");
  };

  const handleOpenDeck = (deckId: string) => {
    setActiveDeckId(deckId);
    setCurrentView("deck");
  };

  const handleUpgrade = () => {
    setCurrentView("upgrade");
    setActiveDeckId(null);
    setDeckTitle("");
  };

  const handleGoHome = () => {
    setCurrentView("dashboard");
    setActiveDeckId(null);
    setDeckTitle("");
  };

  const saveDeckTitle = (title: string) => {
    const newDeck: Deck = deck;
    deck.title = title;
    saveDeck(newDeck);
    setDeckTitle(title);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };
  const deckActions = (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600"
        onClick={() => {
          if (isWorking) {
            showToast("Please wait while AI is working");
            return;
          }
          setIsThemePickerOpen(true);
        }}
      >
        Theme
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600"
        onClick={() => {
          if (isWorking) {
            showToast("Please wait while AI is working");
            return;
          }
          setIsExportMenuOpen(true);
        }}
      >
        Export
      </Button>
      <Button
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
        onClick={() => {
          if (isWorking) {
            showToast("Please wait while AI is working");
            return;
          }
          setIsPresentationMode(true);
        }}
      >
        Present
      </Button>
    </>
  );

  return (
    <>
      {toast && (
        <div className="fixed top-26 right-6 z-[99999] bg-black/90 text-white text-sm px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
      {currentView !== "upgrade" ? (
        <Layout
          onGoHome={handleGoHome}
          currentView={currentView}
          title={currentView === "deck" ? deckTitle : undefined}
          saveDeckTitle={saveDeckTitle}
          headerActions={currentView === "deck" ? deckActions : undefined}
          onUpgradeClick={handleUpgrade}
          isWorking={isWorking}
          showToast={showToast}
        >
          {currentView === "dashboard" && (
            <Dashboard
              onCreateNew={handleCreateNew}
              onOpenDeck={handleOpenDeck}
            />
          )}

          {currentView === "create" && (
            <Generator
              onDeckCreated={handleDeckCreated}
              onCancel={handleGoHome}
              onUpgrade={handleUpgrade}
            />
          )}

          {currentView === "deck" && activeDeckId && (
            <DeckView
              deckId={activeDeckId}
              setDeckTitle={setDeckTitle}
              isThemePickerOpen={isThemePickerOpen}
              onCloseThemePicker={() => setIsThemePickerOpen(false)}
              activeSlideIndex={activeSlideIndex}
              setActiveSlideIndex={setActiveSlideIndex}
              deck={deck}
              setDeck={setDeck}
              isPresentationMode={isPresentationMode}
              setIsPresentationMode={setIsPresentationMode}
              onUpgrade={handleUpgrade}
              isWorking={isWorking}
              setIsWorking={setIsWorking}
              showToast={showToast}
            />
          )}
        </Layout>
      ) : (
        <Upgrade onGoBack={handleGoHome} />
      )}
      {isExportMenuOpen && deck && (
        <ExportMenu
          deck={deck}
          currentSlideIndex={activeSlideIndex}
          onClose={() => setIsExportMenuOpen(false)}
        />
      )}
    </>
  );
};

export default App;
