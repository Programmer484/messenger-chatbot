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

        const currentStrikes = getStrikes(userId);
        const response = await getAiResponse(userId, userInput);
        const newStrikes = getStrikes(userId);
        
        console.log(`AI: ${response}`);
        console.log(`Strikes: ${currentStrikes} → ${newStrikes}\n`);
        
      } catch (error) {
        console.error(`❌ Error:`, error instanceof Error ? error.message : 'Unknown error');
        if (error instanceof AxiosError) {
          console.error(`Status: ${error.response?.status}, Data:`, error.response?.data);
        }
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