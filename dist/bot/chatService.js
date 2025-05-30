"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiResponse = getAiResponse;
const aiClient_1 = require("./aiClient");
const conversationManager_1 = require("./conversationManager");
const aiTools_1 = require("./aiTools");
async function getAiResponse(senderId, userMessage) {
    try {
        const messages = await (0, conversationManager_1.prepareConversation)(senderId, userMessage);
        const response = await (0, aiClient_1.chatCompletion)(messages, aiTools_1.AI_TOOLS);
        if (response.tool_calls && response.tool_calls.length > 0) {
            const toolCall = response.tool_calls[0];
            const toolResult = await (0, aiTools_1.executeTool)(toolCall.function.name, JSON.parse(toolCall.function.arguments));
            messages.push(response);
            messages.push({
                role: 'tool',
                content: JSON.stringify(toolResult),
                tool_call_id: toolCall.id
            });
            return response.content || 'I apologize, but I cannot continue this conversation.';
        }
        return response.content || 'I apologize, but I cannot continue this conversation.';
    }
    catch (error) {
        console.error('Error getting ChatGPT response:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}
