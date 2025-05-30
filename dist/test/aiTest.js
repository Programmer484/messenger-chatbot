"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const chatService_1 = require("../bot/chatService");
const axios_1 = require("axios");
const readline = __importStar(require("readline"));
const conversationStore_1 = require("../bot/conversationStore");
const systemPrompt_1 = require("../appConfig/systemPrompt");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const userModeration_1 = require("../bot/userModeration");
// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function improvePrompt(currentPrompt, currentCriteria, conversationHistory, improvementRequest) {
    const improvementPrompt = `You are an AI prompt engineer. Analyze the current system prompt, criteria, and conversation history, then suggest improvements based on the user's request.

Current System Prompt:
${currentPrompt.replace(/`/g, '\\`')}

Current Criteria:
${JSON.stringify(currentCriteria, null, 2)}

Recent Conversation History:
${conversationHistory.join('\n')}

User's Improvement Request:
${improvementRequest}

Please provide an improved version of both the system prompt and criteria that addresses the user's request while maintaining the core functionality. Format your response as a JSON object with two fields:
{
  "prompt": "the improved system prompt",
  "criteria": { the improved criteria object }
}

Only include the JSON object in your response, no explanations.`;
    try {
        const response = await (0, chatService_1.getAiResponse)('prompt_engineer', improvementPrompt);
        try {
            const improvements = JSON.parse(response);
            if (!improvements.prompt || !improvements.criteria) {
                throw new Error('Invalid response format');
            }
            return {
                prompt: improvements.prompt,
                criteria: improvements.criteria
            };
        }
        catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            console.log('Raw response:', response);
            return {
                prompt: currentPrompt,
                criteria: currentCriteria
            };
        }
    }
    catch (error) {
        console.error('Error improving prompt:', error instanceof Error ? error.message : 'Unknown error');
        return {
            prompt: currentPrompt,
            criteria: currentCriteria
        };
    }
}
function updateSystemPromptFile(newPrompt, newCriteria) {
    const filePath = path.join(__dirname, '../appConfig/systemPrompt.ts');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    // Replace the systemPrompt content
    let updatedContent = fileContent.replace(/const systemPrompt = `[\s\S]*?`;/, `const systemPrompt = \`${newPrompt}\`;`);
    // Replace the criteria object
    updatedContent = updatedContent.replace(/const criteria = \{[\s\S]*?\};/, `const criteria = ${JSON.stringify(newCriteria, null, 2)};`);
    fs.writeFileSync(filePath, updatedContent);
    console.log('Updated systemPrompt.ts file');
}
async function chatLoop() {
    try {
        // Check if API key is set
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in environment variables');
        }
        // Set the model
        process.env.OPENAI_MODEL = 'gpt-4o-mini';
        const userId = 'test_user_123';
        let systemPrompt = process.env.SYSTEM_PROMPT || systemPrompt_1.systemPrompt;
        let criteria = systemPrompt_1.criteria;
        const conversationHistory = [];
        console.log('Chat started! Commands:');
        console.log('- "exit" to quit');
        console.log('- "restart" to clear context');
        console.log('- "update: [what to improve]" to improve the prompt and criteria');
        console.log('----------------------------------------');
        console.log('Current system prompt:', systemPrompt);
        console.log('Current criteria:', criteria);
        console.log('----------------------------------------');
        while (true) {
            const userInput = await new Promise(resolve => {
                rl.question('You: ', resolve);
            });
            if (userInput.toLowerCase() === 'exit') {
                break;
            }
            if (userInput.toLowerCase() === 'restart') {
                (0, conversationStore_1.clearContext)(userId);
                (0, userModeration_1.resetStrikes)(userId);
                conversationHistory.length = 0;
                console.log('Conversation context and strikes cleared!');
                continue;
            }
            if (userInput.toLowerCase().startsWith('update:')) {
                const improvementRequest = userInput.slice('update:'.length).trim();
                console.log('Analyzing conversation and improving prompt and criteria...');
                const improvements = await improvePrompt(systemPrompt, criteria, conversationHistory, improvementRequest);
                systemPrompt = improvements.prompt;
                criteria = improvements.criteria;
                process.env.SYSTEM_PROMPT = systemPrompt;
                updateSystemPromptFile(systemPrompt, criteria);
                console.log('System prompt and criteria improved and file updated:');
                console.log('New prompt:', systemPrompt);
                console.log('New criteria:', criteria);
                continue;
            }
            try {
                // Show current strikes before getting response
                const currentStrikes = (0, userModeration_1.getStrikes)(userId);
                if (currentStrikes > 0) {
                    console.log('\n[DEBUG] Current strikes:', currentStrikes);
                }
                const response = await (0, chatService_1.getAiResponse)(userId, userInput);
                // Show updated strikes after response
                const newStrikes = (0, userModeration_1.getStrikes)(userId);
                if (newStrikes > currentStrikes) {
                    console.log('\n[DEBUG] Strike added! Total strikes:', newStrikes);
                }
                console.log('\nAI:', response);
                console.log('----------------------------------------');
                // Add to conversation history
                conversationHistory.push(`User: ${userInput}`);
                conversationHistory.push(`AI: ${response}`);
                // Keep only last 10 exchanges
                if (conversationHistory.length > 20) {
                    conversationHistory.splice(0, 2);
                }
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError && error.response?.status === 401) {
                    console.error('Authentication failed. Please check your OPENAI_API_KEY');
                }
                else {
                    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
                }
            }
        }
        rl.close();
    }
    catch (error) {
        console.error('Test failed:', error instanceof Error ? error.message : 'Unknown error');
        rl.close();
    }
}
// Start the chat
chatLoop();
