import { UserDataField } from '../config/botConfig';
export declare function setUserData(userId: string, field: UserDataField, value: string): boolean;
export declare function getUserData(userId: string, field?: UserDataField): any;
