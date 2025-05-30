import { getAiResponse } from '../bot/chatService';
import { AxiosError } from 'axios';
import * as readline from 'readline';
import { clearContext } from '../bot/conversationStore';
import { systemPrompt as defaultSystemPrompt, criteria as defaultCriteria } from '../appConfig/systemPrompt';
import * as fs from 'fs';
import * as path from 'path';
import { getStrikes, resetStrikes } from '../bot/userModeration';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function improvePrompt(currentPrompt: string, currentCriteria: any, conversationHistory: string[], improvementRequest: string): Promise<{ prompt: string, criteria: any }> {
  const improvementPrompt = `You are an AI prompt engineer. Analyze the current system prompt, criteria, and conversation history, then suggest improvements based on the user's request.

Current System Prompt:
${currentPrompt.replace(/`/g, '\\`')}

Current Criteria:
${JSON.stringify(currentCriteria, null, 2)}

Recent Conversation History:
${conversationHistory.join('\n')}

User's Improvement Request:
${improvementRequest}

Please provide an improved version of both the system prompt and criteria that addresses the user's request while maintaining the core functionality. Format your response as a JSON object with two fields:
{
  "prompt": "the improved system prompt",
  "criteria": { the improved criteria object }
}

Only include the JSON object in your response, no explanations.`;

  try {
    const response = await getAiResponse('prompt_engineer', improvementPrompt);
    try {
      const improvements = JSON.parse(response);
      if (!improvements.prompt || !improvements.criteria) {
        throw new Error('Invalid response format');
      }
      return {
        prompt: improvements.prompt,
        criteria: improvements.criteria
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response:', response);
      return {
        prompt: currentPrompt,
        criteria: currentCriteria
      };
    }
  } catch (error) {
    console.error('Error improving prompt:', error instanceof Error ? error.message : 'Unknown error');
    return {
      prompt: currentPrompt,
      criteria: currentCriteria
    };
  }
}

function updateSystemPromptFile(newPrompt: string, newCriteria: any) {
  const filePath = path.join(__dirname, '../appConfig/systemPrompt.ts');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Replace the systemPrompt content
  let updatedContent = fileContent.replace(
    /const systemPrompt = `[\s\S]*?`;/,
    `const systemPrompt = \`${newPrompt}\`;`
  );
  
  // Replace the criteria object
  updatedContent = updatedContent.replace(
    /const criteria = \{[\s\S]*?\};/,
    `const criteria = ${JSON.stringify(newCriteria, null, 2)};`
  );
  
  fs.writeFileSync(filePath, updatedContent);
  console.log('Updated systemPrompt.ts file');
}

async function chatLoop() {
  try {
    // Check if API key is set
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    // Set the model
    process.env.OPENAI_MODEL = 'gpt-4o-mini';

    const userId = 'test_user_123';
    let systemPrompt = process.env.SYSTEM_PROMPT || defaultSystemPrompt;
    let criteria = defaultCriteria;
    const conversationHistory: string[] = [];

    console.log('Chat started! Commands:');
    console.log('- "exit" to quit');
    console.log('- "restart" to clear context');
    console.log('- "update: [what to improve]" to improve the prompt and criteria');
    console.log('----------------------------------------');
    console.log('Current system prompt:', systemPrompt);
    console.log('Current criteria:', criteria);
    console.log('----------------------------------------');

    while (true) {
      const userInput = await new Promise<string>(resolve => {
        rl.question('You: ', resolve);
      });

      if (userInput.toLowerCase() === 'exit') {
        break;
      }

      if (userInput.toLowerCase() === 'restart') {
        clearContext(userId);
        resetStrikes(userId);
        conversationHistory.length = 0;
        console.log('Conversation context and strikes cleared!');
        continue;
      }

      if (userInput.toLowerCase().startsWith('update:')) {
        const improvementRequest = userInput.slice('update:'.length).trim();
        console.log('Analyzing conversation and improving prompt and criteria...');
        const improvements = await improvePrompt(systemPrompt, criteria, conversationHistory, improvementRequest);
        systemPrompt = improvements.prompt;
        criteria = improvements.criteria;
        process.env.SYSTEM_PROMPT = systemPrompt;
        updateSystemPromptFile(systemPrompt, criteria);
        console.log('System prompt and criteria improved and file updated:');
        console.log('New prompt:', systemPrompt);
        console.log('New criteria:', criteria);
        continue;
      }

      try {
        // Show current strikes before getting response
        const currentStrikes = getStrikes(userId);
        if (currentStrikes > 0) {
          console.log('\n[DEBUG] Current strikes:', currentStrikes);
        }

        const response = await getAiResponse(userId, userInput);
        
        // Show updated strikes after response
        const newStrikes = getStrikes(userId);
        if (newStrikes > currentStrikes) {
          console.log('\n[DEBUG] Strike added! Total strikes:', newStrikes);
        }

        console.log('\nAI:', response);
        console.log('----------------------------------------');
        
        // Add to conversation history
        conversationHistory.push(`User: ${userInput}`);
        conversationHistory.push(`AI: ${response}`);
        // Keep only last 10 exchanges
        if (conversationHistory.length > 20) {
          conversationHistory.splice(0, 2);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          console.error('Authentication failed. Please check your OPENAI_API_KEY');
        } else {
          console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }

    rl.close();
  } catch (error) {
    console.error('Test failed:', error instanceof Error ? error.message : 'Unknown error');
    rl.close();
  }
}

// Start the chat
chatLoop(); 