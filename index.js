const express = require('express');
const axios = require('axios');

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
      for (const webhookEvent of entry.messaging) {
        const senderId = webhookEvent.sender.id;
        const message = webhookEvent.message?.text;

        // Skip non-text messages
        if (!message) continue;

        console.log(`Processing message from ${senderId}: ${message}`);

        try {
          // const chatGPTResponse = await getChatGPTResponse(senderId, message);
          // await sendMessage(senderId, chatGPTResponse);
          
          // Hard coded test response
          console.log('Test: Would have sent message to ChatGPT:', message);
          const testResponse = "This is a test response. Your message was: " + message;
          console.log('Test: Would have sent to user:', testResponse);
          
        } catch (error) {
          console.error('Error processing message:', error);
          // await sendMessage(senderId, 'I apologize, but I encountered an error processing your message. Please try again later.');
          console.log('Test: Would have sent error message to user');
        }
      }
    }

    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
