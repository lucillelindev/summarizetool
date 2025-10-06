
import React from 'react';
import type { Summary, Flashcard, Note, ChatMessage, ActiveView } from '../types';
import { SummaryView } from './SummaryView';
import { ChatView } from './ChatView';
import { FlashcardsView } from './FlashcardsView';
import { NotesView } from './NotesView';
import { DocumentMagnifyingGlassIcon, ChatBubbleLeftRightIcon, RectangleStackIcon, PencilSquareIcon } from './icons';

interface ContentPanelProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  summary: Summary | null;
  flashcards: Flashcard[];
  note: Note | null;
  chatMessages: ChatMessage[];
  onGenerateFlashcards: () => void;
  onSendMessage: (message: string) => void;
  onSaveNote: (content: string) => void;
}

// FIX: Changed JSX.Element to React.ReactNode to resolve namespace error.
const TabButton = ({ view, label, icon, activeView, setActiveView }: { view: ActiveView; label: string; icon: React.ReactNode; activeView: ActiveView; setActiveView: (view: ActiveView) => void; }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
        activeView === view
          ? 'border-brand-accent text-brand-accent'
          : 'border-transparent text-gray-400 hover:text-white hover:border-slate-500'
      }`}
    >
      {icon}
      {label}
    </button>
  );

export const ContentPanel: React.FC<ContentPanelProps> = ({
  activeView,
  setActiveView,
  summary,
  flashcards,
  note,
  chatMessages,
  onGenerateFlashcards,
  onSendMessage,
  onSaveNote
}) => {
  if (!summary) {
    return (
      <div className="bg-brand-secondary rounded-lg shadow-lg border border-slate-600 h-full flex flex-col items-center justify-center text-center p-8">
        <DocumentMagnifyingGlassIcon className="w-16 h-16 text-slate-500 mb-4" />
        <h3 className="text-xl font-bold text-white">Your Content Hub</h3>
        <p className="text-slate-400 mt-2">
          Start by providing a URL or pasting text in the panel on the left. Your generated summary and other tools will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-secondary rounded-lg shadow-lg border border-slate-600 h-full flex flex-col">
      <div className="flex border-b border-slate-600">
        <TabButton view="summary" label="Summary" icon={<DocumentMagnifyingGlassIcon className="w-5 h-5" />} activeView={activeView} setActiveView={setActiveView} />
        <TabButton view="chat" label="Chat" icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} activeView={activeView} setActiveView={setActiveView} />
        <TabButton view="flashcards" label="Flashcards" icon={<RectangleStackIcon className="w-5 h-5" />} activeView={activeView} setActiveView={setActiveView} />
        <TabButton view="notes" label="Notes" icon={<PencilSquareIcon className="w-5 h-5" />} activeView={activeView} setActiveView={setActiveView} />
      </div>
      <div className="flex-grow p-6 overflow-y-auto">
        {activeView === 'summary' && <SummaryView summary={summary} onGenerateFlashcards={onGenerateFlashcards} />}
        {activeView === 'chat' && <ChatView messages={chatMessages} onSendMessage={onSendMessage} />}
        {activeView === 'flashcards' && <FlashcardsView flashcards={flashcards} />}
        {activeView === 'notes' && <NotesView note={note} summaryId={summary.id} onSaveNote={onSaveNote} />}
      </div>
    </div>
  );
};
