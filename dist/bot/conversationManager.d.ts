import { Message } from '../types';
/**
 * Prepares the conversation context for the AI, including:
 * 1. Checking if user is blocked
 * 2. Loading conversation history
 * 3. Adding system context (property details, criteria)
 * 4. Adding the user's message
 *
 * @param senderId - The ID of the user
 * @param userMessage - The message from the user
 * @returns The prepared conversation messages
 */
export declare function prepareConversation(senderId: string, userMessage: string): Promise<Message[]>;
