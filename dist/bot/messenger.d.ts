/**
 * Sends a message to a user via the Facebook Messenger API
 * @param recipientId - The ID of the message recipient
 * @param messageText - The text message to send
 */
export declare function sendMessage(recipientId: string, messageText: string): Promise<void>;
