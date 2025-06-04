export declare const AI_TOOLS: ({
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            userId: {
                type: string;
                description: string;
            };
            count: {
                type: string;
                description: string;
            };
            reason: {
                type: string;
                description: string;
            };
            times?: undefined;
            field?: undefined;
            value?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            userId: {
                type: string;
                description: string;
            };
            count?: undefined;
            reason?: undefined;
            times?: undefined;
            field?: undefined;
            value?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            userId: {
                type: string;
                description: string;
            };
            times: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            count?: undefined;
            reason?: undefined;
            field?: undefined;
            value?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            userId: {
                type: string;
                description: string;
            };
            field: {
                type: string;
                enum: string[];
                description: string;
            };
            value: {
                type: string;
                description: string;
            };
            count?: undefined;
            reason?: undefined;
            times?: undefined;
        };
        required: string[];
    };
})[];
export declare function executeTool(toolName: string, params: any): Promise<any>;
