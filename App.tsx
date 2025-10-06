
import React, { useState, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { InputPanel } from './components/InputPanel';
import { ContentPanel } from './components/ContentPanel';
import { KnowledgeBasePanel } from './components/KnowledgeBasePanel';
import { summarizeContent, generateFlashcardsFromSummary, startChatWithSummary } from './services/geminiService';
// FIX: Import FlashcardSet to be used in loadItemFromKB
import type { Summary, Flashcard, Note, ChatMessage, KnowledgeBase, ActiveView, InputType, FlashcardSet } from './types';
import { Header } from './components/Header';
import { LoadingSpinner, ErrorDisplay } from './components/common';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [activeSummary, setActiveSummary] = useState<Summary | null>(null);
  const [activeFlashcards, setActiveFlashcards] = useState<Flashcard[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>({ summaries: [], flashcards: [], notes: [] });
  const [activeView, setActiveView] = useState<ActiveView>('summary');

  const clearError = () => setError(null);

  const handleSummarize = async (inputType: InputType, content: string) => {
    clearError();
    setIsLoading(true);
    setLoadingMessage('Crafting a concise summary...');
    setActiveSummary(null);
    setActiveView('summary');
    setChatMessages([]);
    setChatInstance(null);
    setActiveFlashcards([]);
    
    try {
      const summaryText = await summarizeContent(inputType, content);
      const newSummary: Summary = {
        id: `sum_${Date.now()}`,
        title: inputType === 'url' ? content : `Text Summary ${knowledgeBase.summaries.length + 1}`,
        content: summaryText,
        source: content,
        type: inputType,
      };
      setActiveSummary(newSummary);
      setKnowledgeBase(prev => ({ ...prev, summaries: [newSummary, ...prev.summaries] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during summarization.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleGenerateFlashcards = async () => {
    if (!activeSummary) return;
    clearError();
    setIsLoading(true);
    setLoadingMessage('Generating flashcards from summary...');
    setActiveFlashcards([]);
    
    try {
      const flashcards = await generateFlashcardsFromSummary(activeSummary.content);
      const newFlashcardSet = { id: `fc_${Date.now()}`, summaryId: activeSummary.id, title: activeSummary.title, cards: flashcards };
      setActiveFlashcards(flashcards);
      setKnowledgeBase(prev => ({ ...prev, flashcards: [newFlashcardSet, ...prev.flashcards] }));
      setActiveView('flashcards');
    // FIX: Corrected syntax for catch block. `catch (err) => {` is invalid.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating flashcards.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!activeSummary) return;

    let currentChat = chatInstance;
    if (!currentChat) {
      currentChat = startChatWithSummary(activeSummary.content);
      setChatInstance(currentChat);
    }
    
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setLoadingMessage('Thinking...');
    
    try {
      const stream = await currentChat.sendMessageStream({ message });
      let fullResponse = '';
      setChatMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from chat.';
      setError(errorMessage);
      setChatMessages(prev => prev.slice(0, -1)); // Remove the empty model message placeholder
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // FIX: Use specific types for `item` instead of `any` to ensure type safety.
  const loadItemFromKB = (item: Summary | FlashcardSet | Note, type: 'summary' | 'flashcards' | 'note') => {
      setActiveSummary(null);
      setActiveFlashcards([]);
      setActiveNote(null);
      setChatMessages([]);
      setChatInstance(null);
      clearError();
      if(type === 'summary'){
          setActiveSummary(item as Summary);
          setActiveView('summary');
      } else if (type === 'flashcards'){
          const flashcardSet = item as FlashcardSet;
          const summary = knowledgeBase.summaries.find(s => s.id === flashcardSet.summaryId);
          setActiveSummary(summary || null);
          setActiveFlashcards(flashcardSet.cards);
          setActiveView('flashcards');
      } else if (type === 'note'){
          const note = item as Note;
          const summary = knowledgeBase.summaries.find(s => s.id === note.summaryId);
          setActiveSummary(summary || null);
          setActiveNote(note);
          setActiveView('notes');
      }
  };
  
  const handleSaveNote = (content: string) => {
    if(!activeSummary) return;
    const existingNoteIndex = knowledgeBase.notes.findIndex(n => n.summaryId === activeSummary.id);
    let updatedNote;

    if(existingNoteIndex > -1){
        updatedNote = {...knowledgeBase.notes[existingNoteIndex], content, updatedAt: new Date().toISOString()};
        // FIX: Corrected typo `knowledge-Base` to `knowledgeBase`.
        const newNotes = [...knowledgeBase.notes];
        newNotes[existingNoteIndex] = updatedNote;
        setKnowledgeBase(prev => ({...prev, notes: newNotes}));
    } else {
        updatedNote = {
            id: `note_${Date.now()}`,
            summaryId: activeSummary.id,
            title: `Notes for "${activeSummary.title}"`,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setKnowledgeBase(prev => ({...prev, notes: [updatedNote, ...prev.notes]}));
    }
    setActiveNote(updatedNote);
  };


  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3">
          <InputPanel onSummarize={handleSummarize} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-6 min-h-[75vh] relative">
          {isLoading && <LoadingSpinner message={loadingMessage}/>}
          {error && <ErrorDisplay message={error} onClose={clearError} />}
          {!isLoading && !error && <ContentPanel 
            activeView={activeView}
            setActiveView={setActiveView}
            summary={activeSummary}
            flashcards={activeFlashcards}
            note={activeNote}
            chatMessages={chatMessages}
            onGenerateFlashcards={handleGenerateFlashcards}
            onSendMessage={handleSendMessage}
            onSaveNote={handleSaveNote}
          />}
        </div>
        <div className="lg:col-span-3">
          <KnowledgeBasePanel knowledgeBase={knowledgeBase} onLoadItem={loadItemFromKB} />
        </div>
      </main>
    </div>
  );
}
