
import React from 'react';
import type { Summary } from '../types';
import { RectangleStackIcon, LinkIcon, DocumentTextIcon } from './icons';

interface SummaryViewProps {
  summary: Summary;
  onGenerateFlashcards: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary, onGenerateFlashcards }) => {
  return (
    <div className="prose prose-invert prose-slate max-w-none">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">{summary.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    {summary.type === 'url' ? <LinkIcon className="w-4 h-4" /> : <DocumentTextIcon className="w-4 h-4" />}
                    <span className="truncate max-w-xs">{summary.source}</span>
                </div>
            </div>
             <button
                onClick={onGenerateFlashcards}
                className="flex items-center gap-2 bg-brand-accent/20 text-brand-accent font-semibold py-2 px-4 rounded-md transition-colors hover:bg-brand-accent/30 text-sm whitespace-nowrap"
            >
                <RectangleStackIcon className="w-5 h-5" />
                Create Flashcards
            </button>
        </div>
        <div className="text-brand-text whitespace-pre-wrap">{summary.content}</div>
    </div>
  );
};
