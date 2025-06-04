export declare const BOT_CONFIG: {
    userData: {
        validFields: {
            readonly move_in_date: "Move-in date";
            readonly current_renting_status: "Current renting status";
            readonly number_of_people: "Number of people";
            readonly relationship: "Relationship between occupants";
            readonly job_title_primary: "Job title (primary applicant)";
            readonly job_title_secondary: "Job title (secondary applicant)";
            readonly name: "Applicant name";
            readonly pets: "Pet status";
            readonly smoking: "Smoking status";
            readonly drugs: "Drug use status";
        };
        requiredFields: readonly ["move_in_date", "current_renting_status", "number_of_people", "relationship", "job_title_primary"];
    };
    responses: {
        blockedUser: string;
        noResponse: string;
    };
    chat: {
        maxMessages: number;
        maxTokens: number;
        temperature: number;
    };
    moderation: {
        strikeLimit: number;
        blockDuration: number;
    };
    openai: {
        model: string;
        maxRetries: number;
        retryDelay: number;
    };
    messenger: {
        apiVersion: string;
        maxRetries: number;
        retryDelay: number;
    };
};
export type UserDataField = keyof typeof BOT_CONFIG.userData.validFields;
