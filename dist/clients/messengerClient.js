"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const axios_1 = __importDefault(require("axios"));
const appConfig_1 = require("../appConfig");
/**
 * Sends a message to a user via the Facebook Messenger API
 * @param recipientId - The ID of the message recipient
 * @param messageText - The text message to send
 */
async function sendMessage(recipientId, messageText) {
    try {
        const response = await axios_1.default.post(`https://graph.facebook.com/v18.0/me/messages`, {
            recipient: { id: recipientId },
            message: { text: messageText }
        }, {
            params: { access_token: appConfig_1.APP_CONFIG.credentials.pageAccessToken }
        });
        if (response.status !== 200) {
            throw new Error(`Failed to send message: ${response.statusText}`);
        }
    }
    catch (error) {
        console.error('Error sending message:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}
