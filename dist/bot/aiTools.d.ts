export interface AITool {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
    };
}
export declare const AI_TOOLS: AITool[];
export declare function executeTool(toolName: string, params: any): Promise<any>;
