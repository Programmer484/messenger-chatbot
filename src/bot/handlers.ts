import { isValidTextMessage, formatResponse } from '../utils/helpers';
import type { Message, ResponseMessage } from '../utils/helpers';

/**
 * Handles incoming messages from users
 * @param message - The incoming message
 * @returns The response message
 */
export const handleMessage = (message: Message): ResponseMessage => {
  if (!isValidTextMessage(message)) {
    return formatResponse('Sorry, I can only process text messages.');
  }

  // Add your message handling logic here
  return formatResponse(`You said: ${message.text}`);
};

module.exports = {
  handleMessage,
}; 