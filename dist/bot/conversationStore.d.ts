import { Message } from '../types';
export declare function getContext(userId: string): Message[];
export declare function updateContext(userId: string, messages: Message[]): void;
export declare function clearContext(userId: string): void;
