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
const chatHistory_1 = require("../bot/chatHistory");
const userModeration_1 = require("../bot/qualification/userModeration");
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function manualTest() {
    try {
        const userId = 'test_user_123';
        console.log('🤖 Manual AI Test Chat');
        console.log('Type messages to test AI responses. Type "exit" to quit, "reset" to clear context and strikes.\n');
        const askQuestion = () => {
            return new Promise((resolve) => {
                rl.question('You: ', (answer) => {
                    resolve(answer);
                });
            });
        };
        while (true) {
            try {
                const userInput = await askQuestion();
                if (userInput.toLowerCase() === 'exit') {
                    console.log('Goodbye! 👋');
                    break;
                }
                if (userInput.toLowerCase() === 'reset') {
                    (0, chatHistory_1.clearContext)(userId);
                    (0, userModeration_1.resetStrikes)(userId);
                    console.log('✅ Context and strikes reset\n');
                    continue;
                }
                const currentStrikes = (0, userModeration_1.getStrikes)(userId);
                const response = await (0, chatService_1.getAiResponse)(userId, userInput);
                const newStrikes = (0, userModeration_1.getStrikes)(userId);
                console.log(`AI: ${response}`);
                console.log(`Strikes: ${currentStrikes} → ${newStrikes}\n`);
            }
            catch (error) {
                console.error(`❌ Error:`, error instanceof Error ? error.message : 'Unknown error');
                if (error instanceof axios_1.AxiosError) {
                    console.error(`Status: ${error.response?.status}, Data:`, error.response?.data);
                }
                console.log();
            }
        }
        rl.close();
    }
    catch (error) {
        console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
        rl.close();
        process.exit(1);
    }
}
manualTest();
