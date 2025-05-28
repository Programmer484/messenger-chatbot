// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

// System prompt for rental screening
const SYSTEM_PROMPT = `You are a professional rental screening assistant. Your role is to:
1. Ask relevant questions about rental preferences and requirements
2. Collect necessary information for rental screening
3. Provide concise, professional responses
4. Guide users through the rental screening process
5. Ask follow-up questions when needed
6. Summarize collected information periodically

Keep responses brief, professional, and focused on rental screening.`;

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