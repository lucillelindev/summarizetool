
import React, { useState, useEffect } from 'react';
import type { Note } from '../types';

interface NotesViewProps {
    note: Note | null;
    summaryId: string;
    onSaveNote: (content: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ note, summaryId, onSaveNote }) => {
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setContent(note?.content || '');
  }, [note, summaryId]);

  const handleSave = () => {
    onSaveNote(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold mb-4 text-white">My Notes</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Jot down your key takeaways, questions, and ideas here..."
        className="flex-grow w-full bg-brand-primary border border-slate-600 rounded-md px-3 py-2 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
      />
      <div className="mt-4 flex justify-end items-center gap-4">
        {isSaved && <p className="text-sm text-green-400">Note saved!</p>}
        <button
            onClick={handleSave}
            className="bg-brand-accent text-white font-bold py-2 px-4 rounded-md transition-colors hover:bg-sky-400 disabled:bg-slate-500"
            disabled={!content.trim()}
        >
            Save Note
        </button>
      </div>
    </div>
  );
};
