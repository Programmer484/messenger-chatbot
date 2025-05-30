"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = exports.isValidTextMessage = void 0;
/**
 * Validates if a message is a valid text message
 * @param message - The message object to validate
 * @returns Whether the message is valid
 */
const isValidTextMessage = (message) => {
    return Boolean(message && message.text && typeof message.text === 'string');
};
exports.isValidTextMessage = isValidTextMessage;
/**
 * Formats a response message
 * @param text - The text to send
 * @returns Formatted message object
 */
const formatResponse = (text) => {
    return {
        text,
    };
};
exports.formatResponse = formatResponse;
module.exports = {
    isValidTextMessage: exports.isValidTextMessage,
    formatResponse: exports.formatResponse,
};
