import { Message } from '../types';
import { AITool } from './aiTools';
export declare function chatCompletion(messages: Message[], tools?: AITool[]): Promise<Message>;
