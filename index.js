const express = require('express');
const axios = require('axios');
require('dotenv').config();

// Environment variable sanity checks
['VERIFY_TOKEN', 'PAGE_ACCESS_TOKEN', 'OPENAI_API_KEY'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is missing. Please set it in your .env file.`);
  }
});

const app = express();
app.use(express.json());

// Environment variables
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    console.error('Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook message handling endpoint
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object !== 'page') {
      return res.sendStatus(404);
    }

    // Iterate through all entries and messaging events
    for (const entry of body.entry) {
      for (const evt of entry.messaging) {
        console.log('Event:', JSON.stringify(evt)); // Log all events
    
        const senderId = evt.sender.id;
    
        if (evt.message && evt.message.text) {
          // Handle user text messages
          const chatGPTResponse = await getChatGPTResponse(senderId, evt.message.text);
          await sendMessage(senderId, chatGPTResponse);
        } else if (evt.postback) {
          // Handle button postbacks
          await sendMessage(senderId, `Received your selection: ${evt.postback.payload}`);
        } else {
          console.log('Unhandled event type:', evt);
        }
      }
    }
    

    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

// System prompt for rental screening
const SYSTEM_PROMPT = `You are a professional rental screening assistant for this suite:

Bright & private 1-bedroom raised basement suite in Forest Height (16 Ave & 50 St. SE). Big windows, remodeled bathroom, private entrance, fenced yard. 10 min to downtown. $896/month + 25% utilities. Available July 1. Suitable for 1 person or a couple only (only 1 bed). No smokers, no drugs, no pets.

Your tasks:

Gather these details: 1) Desired possession date & current renting status; 2) Total number of people and relationship; 3) Employment info for each adult.

If you already know an answer, do not ask for it again.

Screen for: Only 1 person or a couple (max 2, must be couple), no pets, non-smokers, no drugs.

If user doesn’t fit, politely explain the suite is only suitable for a single person or a couple sharing a bed.

Guide user through the screening, keep responses concise and professional.`;

// Store conversation context (in production, use a proper database)
const conversationContext = new Map();

// Helper function to send messages via Messenger API
async function sendMessage(senderId, message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/me/messages`,
      {
        recipient: { id: senderId },
        message: { text: message }
      },
      {
        params: { access_token: PAGE_ACCESS_TOKEN },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to get ChatGPT response
async function getChatGPTResponse(senderId, userMessage) {
  try {
    // Get or initialize conversation context
    let messages = conversationContext.get(senderId) || [{ role: 'system', content: SYSTEM_PROMPT }];

    // Add user message to context
    messages.push({ role: 'user', content: userMessage });

    // Trim context to last 20 messages to avoid token bloat
    if (messages.length > 20) {
      messages = [messages[0], ...messages.slice(-19)];
    }

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const assistantMessage = response.data.choices[0].message.content;

    // Update conversation context
    messages.push({ role: 'assistant', content: assistantMessage });
    conversationContext.set(senderId, messages);

    return assistantMessage;
  } catch (error) {
    console.error('Error getting ChatGPT response:', error.response?.data || error.message);
    throw error;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
