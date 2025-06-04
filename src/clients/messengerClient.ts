import axios from 'axios';
import { APP_CONFIG } from '../appConfig';

/**
 * Sends a message to a user via the Facebook Messenger API
 * @param recipientId - The ID of the message recipient
 * @param messageText - The text message to send
 */
export async function sendMessage(recipientId: string, messageText: string): Promise<void> {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: messageText }
      },
      {
        params: { access_token: APP_CONFIG.credentials.pageAccessToken }
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending message:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
} 