import { GitCommit, MessageSquare, Mail } from 'lucide-react';
import type { SearchResult } from '../types';

export const MOCK_RESULTS: SearchResult[] = [
  {
    id: 1,
    source: 'github',
    icon: <GitCommit size={18} color="var(--color-github)" />,
    title: 'Commit in AutoGPT project',
    date: '2 hours ago',
    text: "Refactored the agent planning logic to include a recursive search mechanism before falling back to default.",
    relevance: 98,
  },
  {
    id: 2,
    source: 'discord',
    icon: <MessageSquare size={18} color="var(--color-discord)" />,
    title: 'Message in #ai-dev',
    date: 'Yesterday',
    text: "I think we should use ChromaDB instead of Pinecone for the local embedding cache because it respects user privacy better.",
    relevance: 95,
  },
  {
    id: 3,
    source: 'gmail',
    icon: <Mail size={18} color="var(--color-gmail)" />,
    title: 'Email from boss@company.com',
    date: 'Oct 14',
    text: "Just checking in on the new contextual search idea. Try to get the embeddings pipeline ready by Friday's demo.",
    relevance: 82,
  }
];
