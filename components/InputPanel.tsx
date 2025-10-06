
import React, { useState } from 'react';
import type { InputType } from '../types';
import { LinkIcon, DocumentTextIcon, SparklesIcon } from './icons';

interface InputPanelProps {
  onSummarize: (inputType: InputType, content: string) => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onSummarize, isLoading }) => {
  const [inputType, setInputType] = useState<InputType>('url');
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSummarize(inputType, inputValue.trim());
    }
  };

  // FIX: Changed JSX.Element to React.ReactNode to resolve namespace error.
  const TabButton = ({ type, label, icon }: { type: InputType; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setInputType(type)}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-50 ${
        inputType === type ? 'bg-brand-secondary text-white' : 'bg-brand-primary text-gray-400 hover:bg-slate-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-600 h-full">
      <h2 className="text-lg font-bold text-white mb-3">Start Here</h2>
      <div className="flex mb-3">
        <TabButton type="url" label="URL" icon={<LinkIcon className="w-5 h-5" />} />
        <TabButton type="text" label="Text" icon={<DocumentTextIcon className="w-5 h-5" />} />
      </div>
      <form onSubmit={handleSubmit}>
        {inputType === 'url' ? (
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full bg-brand-primary border border-slate-600 rounded-md px-3 py-2 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            disabled={isLoading}
          />
        ) : (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-40 bg-brand-primary border border-slate-600 rounded-md px-3 py-2 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
            disabled={isLoading}
          />
        )}
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-sky-400 disabled:bg-slate-500 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
             <SparklesIcon className="w-5 h-5" />
             Summarize
            </>
          )}
        </button>
      </form>
    </div>
  );
};
