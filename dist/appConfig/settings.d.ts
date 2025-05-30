interface AppSettings {
    port: number;
    pageAccessToken: string | undefined;
    verifyToken: string | undefined;
}
declare const settings: AppSettings;
export default settings;
