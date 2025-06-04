"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveContext = saveContext;
exports.clearContext = clearContext;
exports.getChatHistory = getChatHistory;
const systemPrompt_1 = require("./config/systemPrompt");
const MAX_MESSAGES = 20;
const conversationContext = new Map();
function getContext(userId) {
    return conversationContext.get(userId) || [];
}
function saveContext(userId, messages) {
    // Always keep the system message and trim to last N-1 messages
    const trimmedMessages = messages.length > MAX_MESSAGES
        ? [messages[0], ...messages.slice(-(MAX_MESSAGES - 1))]
        : messages;
    conversationContext.set(userId, trimmedMessages);
}
function clearContext(userId) {
    conversationContext.delete(userId);
}
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
function getChatHistory(senderId, userMessage) {
    // Get or initialize conversation context
    let messages = getContext(senderId);
    if (messages.length === 0) {
        messages = [{
                role: 'system',
                content: systemPrompt_1.systemPrompt
            }];
    }
    // Add user message to context (but don't save yet)
    messages.push({ role: 'user', content: userMessage });
    return messages;
}
