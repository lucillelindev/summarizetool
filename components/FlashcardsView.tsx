
import React, { useState } from 'react';
import type { Flashcard } from '../types';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

const Flashcard: React.FC<{ card: Flashcard }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full h-64 perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-slate-700 rounded-lg flex items-center justify-center p-6 text-center shadow-lg border border-slate-600">
          <p className="text-lg font-semibold text-white">{card.front}</p>
        </div>
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-brand-accent rounded-lg flex items-center justify-center p-6 text-center shadow-lg rotate-y-180">
          <p className="text-md font-medium text-white">{card.back}</p>
        </div>
      </div>
       <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};


export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (flashcards.length === 0) {
    return <div className="text-center text-slate-400">No flashcards generated yet. Click "Create Flashcards" in the Summary tab.</div>;
  }
  
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === flashcards.length - 1 ? 0 : prev + 1));
  };


  return (
    <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-lg font-bold mb-4 text-white">Flashcards Review</h3>
        <div className="w-full max-w-md">
            <Flashcard card={flashcards[currentIndex]} />
        </div>
        <div className="flex items-center justify-between w-full max-w-md mt-4">
            <button onClick={goToPrevious} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
                <ArrowLeftIcon className="w-6 h-6 text-white"/>
            </button>
            <p className="text-sm font-medium text-slate-300">{currentIndex + 1} / {flashcards.length}</p>
            <button onClick={goToNext} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
                <ArrowRightIcon className="w-6 h-6 text-white"/>
            </button>
        </div>
    </div>
  );
};
