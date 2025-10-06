
import React, { useState } from 'react';
import type { KnowledgeBase, Summary, FlashcardSet, Note } from '../types';
import { BookOpenIcon, RectangleStackIcon, PencilSquareIcon, ChevronDownIcon } from './icons';

interface KnowledgeBasePanelProps {
  knowledgeBase: KnowledgeBase;
  // FIX: Use a specific union type for `item` to ensure type safety.
  onLoadItem: (item: Summary | FlashcardSet | Note, type: 'summary' | 'flashcards' | 'note') => void;
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-md font-bold text-white bg-slate-700/50 px-3 py-2 rounded-md hover:bg-slate-600 transition-colors"
      >
        <span>{title}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-2 pl-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

// FIX: Changed JSX.Element to React.ReactNode to resolve namespace error.
const KBItem = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-slate-700 transition-colors text-left">
    <span className="text-brand-accent">{icon}</span>
    <span className="truncate flex-1">{title}</span>
  </button>
);


export const KnowledgeBasePanel: React.FC<KnowledgeBasePanelProps> = ({ knowledgeBase, onLoadItem }) => {
  const { summaries, flashcards, notes } = knowledgeBase;

  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-600 h-full">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <BookOpenIcon className="w-6 h-6"/>
        Knowledge Base
      </h2>
      <div className="max-h-[68vh] overflow-y-auto pr-1">
        <Section title={`Summaries (${summaries.length})`}>
          {summaries.length > 0 ? (
            summaries.map(s => <KBItem key={s.id} icon={<DocumentMagnifyingGlassIcon className="w-5 h-5" />} title={s.title} onClick={() => onLoadItem(s, 'summary')} />)
          ) : <p className="text-xs text-slate-400 px-2">No summaries yet.</p>}
        </Section>
        
        <Section title={`Flashcard Sets (${flashcards.length})`}>
          {flashcards.length > 0 ? (
            flashcards.map(f => <KBItem key={f.id} icon={<RectangleStackIcon className="w-5 h-5" />} title={f.title} onClick={() => onLoadItem(f, 'flashcards')} />)
          ) : <p className="text-xs text-slate-400 px-2">No flashcards yet.</p>}
        </Section>
        
        <Section title={`Notes (${notes.length})`}>
          {notes.length > 0 ? (
            notes.map(n => <KBItem key={n.id} icon={<PencilSquareIcon className="w-5 h-5" />} title={n.title} onClick={() => onLoadItem(n, 'note')} />)
          ) : <p className="text-xs text-slate-400 px-2">No notes yet.</p>}
        </Section>
      </div>
    </div>
  );
};

// Re-using icon from another file to avoid circular dependency issues
const DocumentMagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);
