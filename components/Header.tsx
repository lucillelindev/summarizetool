
import React from 'react';
import { SparklesIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary/50 border-b border-slate-700 p-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-brand-accent animate-pulse-fast"/>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Cogni<span className="text-brand-accent">Flow</span> AI
        </h1>
      </div>
    </header>
  );
};
