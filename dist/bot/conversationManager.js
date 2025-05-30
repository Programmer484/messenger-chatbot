"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConversation = prepareConversation;
const systemPrompt_1 = require("../appConfig/systemPrompt");
const conversationStore_1 = require("./conversationStore");
const userModeration_1 = require("./userModeration");
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
async function prepareConversation(senderId, userMessage) {
    // Check if user is blocked
    if ((0, userModeration_1.isStriked)(senderId)) {
        return [{
                role: 'system',
                content: 'This user has been blocked from using the service.'
            }];
    }
    // Get or initialize conversation context
    let messages = (0, conversationStore_1.getContext)(senderId);
    if (messages.length === 0) {
        messages = [{
                role: 'system',
                content: `${systemPrompt_1.systemPrompt}\n\nScreening Criteria:\n${JSON.stringify(systemPrompt_1.criteria, null, 2)}`
            }];
    }
    // Add user message to context
    messages.push({ role: 'user', content: userMessage });
    // Update context with trimming
    (0, conversationStore_1.updateContext)(senderId, messages);
    return messages;
}
