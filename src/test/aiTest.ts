import { getAiResponse } from '../bot/chatService';
import { AxiosError } from 'axios';
import { clearContext } from '../bot/chatHistory';
import { getStrikes, resetStrikes } from '../bot/qualification/userModeration';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function manualTest() {
  try {
    const userId = 'test_user_123';
    
    console.log('🤖 Manual AI Test Chat');
    console.log('Type messages to test AI responses. Type "exit" to quit, "reset" to clear context and strikes.\n');

    const askQuestion = (): Promise<string> => {
      return new Promise((resolve) => {
        rl.question('You: ', (answer) => {
          resolve(answer);
        });
      });
    };

    while (true) {
      try {
        const userInput = await askQuestion();
        
        if (userInput.toLowerCase() === 'exit') {
          console.log('Goodbye! 👋');
          break;
        }
        
        if (userInput.toLowerCase() === 'reset') {
          clearContext(userId);
          resetStrikes(userId);
          console.log('✅ Context and strikes reset\n');
          continue;
        }

        console.log('🔄 Processing request...');
        const currentStrikes = getStrikes(userId);
        
        try {
          const response = await getAiResponse(userId, userInput);
          const newStrikes = getStrikes(userId);
          
          console.log(`AI: ${response}`);
        } catch (aiError) {
          console.error(`❌ AI Error:`, aiError instanceof Error ? aiError.message : 'Unknown error');
          if (aiError instanceof AxiosError) {
            console.error(`Status: ${aiError.response?.status}`);
            console.error(`Data:`, aiError.response?.data);
            
            // More specific error handling for tool call issues
            if (aiError.response?.data?.error?.message?.includes('tool_calls')) {
              console.error('\n🔧 This looks like a tool call handling issue.');
              console.error('The AI made a tool call but the response wasn\'t formatted correctly.');
            }
          }
          console.log();
        }
        
      } catch (error) {
        console.error(`❌ General Error:`, error instanceof Error ? error.message : 'Unknown error');
        console.log();
      }
    }

    rl.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
    rl.close();
    process.exit(1);
  }
}

manualTest(); 