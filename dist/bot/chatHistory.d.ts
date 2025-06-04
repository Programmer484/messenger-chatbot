interface Message {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string | null;
    tool_calls?: {
        id: string;
        type: 'function';
        function: {
            name: string;
            arguments: string;
        };
    }[];
    tool_call_id?: string;
    name?: string;
}
export declare function saveContext(userId: string, messages: Message[]): void;
export declare function clearContext(userId: string): void;
/**
 * Gets the chat history for the AI, including:
 * 1. Loading conversation history
 * 2. Adding system context with property details and screening criteria
 * 3. Adding the user's message
 *
 * @param senderId - The ID of the user
 * @param userMessage - The message from the user
 * @returns The chat history messages for AI processing
 */
export declare function getChatHistory(senderId: string, userMessage: string): Message[];
export {};
