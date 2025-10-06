
import type { Chat } from '@google/genai';

export type InputType = 'url' | 'text';
export type ActiveView = 'summary' | 'chat' | 'flashcards' | 'notes';

export interface Summary {
  id: string;
  title: string;
  content: string;
  source: string;
  type: InputType;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface FlashcardSet {
    id: string;
    summaryId: string;
    title: string;
    cards: Flashcard[];
}

export interface Note {
  id: string;
  summaryId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface KnowledgeBase {
  summaries: Summary[];
  flashcards: FlashcardSet[];
  notes: Note[];
}
