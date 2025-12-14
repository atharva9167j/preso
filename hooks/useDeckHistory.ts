import { useState, useRef, useCallback } from 'react';
import { Deck } from '../types';
import { saveDeck } from '../services/db';

export const useDeckHistory = (
  initialDeck: Deck | null, 
  setDeckParent: (deck: Deck) => void,
  showToast: (msg: string) => void
) => {
  const [undoStack, setUndoStack] = useState<Deck[]>([]);
  const [redoStack, setRedoStack] = useState<Deck[]>([]);
  const deckRef = useRef<Deck | null>(initialDeck);

  // Sync ref when parent state changes
  const updateRef = (deck: Deck) => {
    deckRef.current = deck;
  };

  const pushToUndoStack = useCallback(() => {
    if (!deckRef.current) return;
    setUndoStack((prev) => {
      const newStack = [...prev, deckRef.current!];
      if (newStack.length > 20) newStack.shift();
      return newStack;
    });
    setRedoStack([]);
  }, []);

  const undo = useCallback(async () => {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];

    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [deckRef.current!, ...prev]);
    
    setDeckParent(lastState);
    deckRef.current = lastState;
    await saveDeck(lastState);
  }, [undoStack, setDeckParent]);

  const redo = useCallback(async () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[0];

    setUndoStack((prev) => [...prev, deckRef.current!]);
    setRedoStack((prev) => prev.slice(1));

    setDeckParent(nextState);
    deckRef.current = nextState;
    await saveDeck(nextState);
  }, [redoStack, setDeckParent]);

  const saveSlide = useCallback(async (slideIndex: number, newContent: string) => {
    const currentDeck = deckRef.current;
    if (!currentDeck) return;

    if (newContent === currentDeck.slides[slideIndex].content) return;

    pushToUndoStack();

    const updatedSlides = [...currentDeck.slides];
    updatedSlides[slideIndex] = {
      ...updatedSlides[slideIndex],
      content: newContent,
    };

    const updatedDeck = {
      ...currentDeck,
      slides: updatedSlides,
      updatedAt: Date.now(),
    };

    setDeckParent(updatedDeck);
    deckRef.current = updatedDeck;
    
    try {
      await saveDeck(updatedDeck);
    } catch (error) {
      console.error("Failed to save", error);
      showToast("Error saving changes.");
    }
  }, [pushToUndoStack, setDeckParent, showToast]);

  return {
    undo,
    redo,
    saveSlide,
    pushToUndoStack,
    updateRef,
    deckRef
  };
};