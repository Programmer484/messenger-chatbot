export declare const APP_CONFIG: {
    server: {
        port: number;
        requestTimeout: number;
        environment: string;
    };
    credentials: {
        pageAccessToken: string | undefined;
        verifyToken: string | undefined;
        openaiApiKey: string | undefined;
    };
    logging: {
        level: "DEBUG" | "INFO" | "WARN" | "ERROR";
        enabledCategories: string[];
        availableCategories: readonly ["USER_DATA", "STRIKES", "QUALIFICATION", "GENERAL"];
    };
    development: {
        enableDebugLogs: boolean;
        mockExternalCalls: boolean;
    };
};
