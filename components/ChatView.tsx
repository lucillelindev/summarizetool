
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { UserCircleIcon, SparklesIcon, PaperAirplaneIcon } from './icons';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

// FIX: Refactored ChatBubble to use React.FC and an interface for props.
// This resolves the error about the `key` prop not being assignable.
interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex items-start gap-3 ${isModel ? '' : 'justify-end'}`}>
      {isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white" /></div>}
      <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${isModel ? 'bg-slate-700 text-brand-text' : 'bg-brand-accent text-white'}`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
      {!isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center"><UserCircleIcon className="w-6 h-6 text-white" /></div>}
    </div>
  );
};


export const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[65vh]">
      <p className="text-sm text-slate-400 mb-4 text-center bg-slate-700/50 p-2 rounded-md">You are now chatting with an AI grounded in the context of the summary.</p>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the summary..."
          className="flex-grow bg-brand-primary border border-slate-600 rounded-md px-3 py-2 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
        <button type="submit" className="bg-brand-accent text-white p-2 rounded-md hover:bg-sky-400 transition-colors disabled:bg-slate-500" disabled={!input.trim()}>
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
