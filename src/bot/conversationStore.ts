import { Message } from '../types';

const MAX_MESSAGES = 20;
const conversationContext = new Map<string, Message[]>();

export function getContext(userId: string): Message[] {
  return conversationContext.get(userId) || [];
}

export function updateContext(userId: string, messages: Message[]): void {
  // Always keep the system message and trim to last N-1 messages
  const trimmedMessages = messages.length > MAX_MESSAGES 
    ? [messages[0], ...messages.slice(-(MAX_MESSAGES - 1))]
    : messages;
  
  conversationContext.set(userId, trimmedMessages);
}

export function clearContext(userId: string): void {
  conversationContext.delete(userId);
} 