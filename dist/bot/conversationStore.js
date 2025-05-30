"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = getContext;
exports.updateContext = updateContext;
exports.clearContext = clearContext;
const MAX_MESSAGES = 20;
const conversationContext = new Map();
function getContext(userId) {
    return conversationContext.get(userId) || [];
}
function updateContext(userId, messages) {
    // Always keep the system message and trim to last N-1 messages
    const trimmedMessages = messages.length > MAX_MESSAGES
        ? [messages[0], ...messages.slice(-(MAX_MESSAGES - 1))]
        : messages;
    conversationContext.set(userId, trimmedMessages);
}
function clearContext(userId) {
    conversationContext.delete(userId);
}
