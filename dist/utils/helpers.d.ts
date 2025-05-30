export interface Message {
    text?: string;
    [key: string]: any;
}
export interface ResponseMessage {
    text: string;
}
/**
 * Validates if a message is a valid text message
 * @param message - The message object to validate
 * @returns Whether the message is valid
 */
export declare const isValidTextMessage: (message: Message) => boolean;
/**
 * Formats a response message
 * @param text - The text to send
 * @returns Formatted message object
 */
export declare const formatResponse: (text: string) => ResponseMessage;
