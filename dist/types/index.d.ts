export interface WebhookQuery {
    'hub.mode'?: string;
    'hub.verify_token'?: string;
    'hub.challenge'?: string;
}
export interface WebhookBody {
    object: string;
    entry: Array<{
        messaging: Array<{
            sender: {
                id: string;
            };
            message?: {
                text: string;
            };
            postback?: {
                payload: string;
            };
        }>;
    }>;
}
export interface Message {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string | null;
    tool_calls?: {
        id: string;
        type: 'function';
        function: {
            name: string;
            arguments: string;
        };
    }[];
    tool_call_id?: string;
    name?: string;
}
