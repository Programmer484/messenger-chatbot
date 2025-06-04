"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiResponse = getAiResponse;
const openaiClient_1 = require("../clients/openaiClient");
const chatHistory_1 = require("./chatHistory");
const aiTools_1 = require("./aiTools");
const botConfig_1 = require("./config/botConfig");
const userModeration_1 = require("./qualification/userModeration");
async function getAiResponse(senderId, userMessage) {
    try {
        // Check if user is blocked before processing
        if ((0, userModeration_1.hasExceededStrikes)(senderId)) {
            return botConfig_1.BOT_CONFIG.responses.blockedUser;
        }
        const messages = (0, chatHistory_1.getChatHistory)(senderId, userMessage);
        const response = await (0, openaiClient_1.chatCompletion)(messages, aiTools_1.AI_TOOLS);
        messages.push(response);
        let finalContent = response.content;
        // Handle tool calls if present
        if (response.tool_calls && response.tool_calls.length > 0) {
            const toolCall = response.tool_calls[0];
            const params = JSON.parse(toolCall.function.arguments);
            params.userId = senderId; // Manually set userId for AI
            const toolResult = await (0, aiTools_1.executeTool)(toolCall.function.name, params);
            // Add tool result
            messages.push({
                role: 'tool',
                content: toolResult !== undefined ? JSON.stringify(toolResult) : "null",
                tool_call_id: toolCall.id
            });
            // Get final response
            const finalResponse = await (0, openaiClient_1.chatCompletion)(messages, aiTools_1.AI_TOOLS);
            messages.push(finalResponse);
            finalContent = finalResponse.content;
        }
        // Save conversation and return
        (0, chatHistory_1.saveContext)(senderId, messages);
        return finalContent || botConfig_1.BOT_CONFIG.responses.noResponse;
    }
    catch (error) {
        console.error('Error getting ChatGPT response:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}
