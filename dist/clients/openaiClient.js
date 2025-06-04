"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatCompletion = chatCompletion;
const axios_1 = __importDefault(require("axios"));
const appConfig_1 = require("../appConfig");
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
async function chatCompletion(messages, tools) {
    try {
        const response = await axios_1.default.post(OPENAI_API_URL, {
            model: 'gpt-4o',
            messages,
            tools: tools?.map(tool => ({
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.parameters
                }
            })),
            temperature: 0.7,
            max_tokens: 150
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${appConfig_1.APP_CONFIG.credentials.openaiApiKey}`,
            }
        });
        return response.data.choices[0].message;
    }
    catch (error) {
        console.error('Error calling OpenAI:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}
