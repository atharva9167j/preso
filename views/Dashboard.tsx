// File: views/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { ScaledPreview } from '../components/ScaledPreview';
import { Deck } from '../types';
import { getDecks, deleteDeck } from '../services/db';
import Aurora from '@/components/Aurora';

interface DashboardProps {
  onCreateNew: () => void;
  onOpenDeck: (deckId: string) => void;
}

// Internal Sub-Component: Confirmation Modal
const DeleteDeckModal = ({ 
  isOpen, 
  onCancel, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onCancel: () => void; 
  onConfirm: () => void; 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4 animate-in fade-in"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-800">Delete Deck</h2>
        <p className="text-slate-500 mt-2 mb-6">
          Are you sure you want to delete this deck? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onOpenDeck }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadDecks = async () => {
    setLoading(true);
    try {
      const loadedDecks = await getDecks();
      setDecks(loadedDecks.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error("Failed to load decks", error);
      showToast("Could not load decks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeckToDelete(id);
  };

  const confirmDelete = async () => {
    if (!deckToDelete) return;
    try {
      await deleteDeck(deckToDelete);
      await loadDecks();
      showToast("Deck deleted successfully.");
    } catch (error) {
      console.error("Failed to delete deck", error);
      showToast("Error: Could not delete the deck.");
    } finally {
      setDeckToDelete(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Aurora
          colorStops={["#c0fab6", "#ddd4fd", "#d4c9ff"]}
          blend={0.5}
          amplitude={2}
          speed={2}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full mt-24 px-4 sm:px-6 lg:px-8 py-10 relative">
        
        <DeleteDeckModal 
          isOpen={!!deckToDelete}
          onCancel={() => setDeckToDelete(null)}
          onConfirm={confirmDelete}
        />

        {toast && (
          <div className="fixed top-6 right-6 z-[99999]">
            <div className="bg-black/90 text-white text-sm px-4 py-2 rounded shadow-lg animate-in fade-in slide-in-from-top">
              {toast}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-10 z-10 relative">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Decks</h1>
            <p className="text-slate-500 mt-1">Manage and present your AI-generated slides.</p>
          </div>
          <Button onClick={onCreateNew} size="lg">
            <span className="mr-2 text-lg">+</span> Create New
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : decks.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300 z-10 relative shadow-sm">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-medium text-slate-900">No decks yet</h3>
            <p className="text-slate-500 mb-6">Start by creating your first AI presentation.</p>
            <Button onClick={onCreateNew} variant="outline">Create New Deck</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 z-10 max-h-[72dvh] overflow-y-auto">
            {decks.map((deck) => (
              <div 
                key={deck.id} 
                onClick={() => onOpenDeck(deck.id)}
                className="group bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all cursor-pointer overflow-hidden flex flex-col h-72"
              >
                {/* Thumbnail Container */}
                <div className="flex-1 bg-slate-100 relative overflow-hidden">
                   <ScaledPreview html={deck.slides[0]?.content || ""} />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                </div>
                
                <div className="p-5 border-t border-slate-100 flex justify-between items-center bg-white relative z-10">
                  <div className="overflow-hidden min-w-0">
                    <h3 className="font-bold text-slate-800 truncate text-lg tracking-tight">{deck.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{new Date(deck.createdAt).toLocaleDateString()} • {deck.slides.length} slides</p>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, deck.id)}
                    className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors ml-2 flex-shrink-0"
                    title="Delete Deck"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};