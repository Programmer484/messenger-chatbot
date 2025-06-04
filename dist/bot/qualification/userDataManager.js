"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserData = setUserData;
exports.getUserData = getUserData;
const botConfig_1 = require("../config/botConfig");
const logger_1 = require("../../utils/logger");
// User data storage (using Map for in-memory storage)
const userDataStorage = new Map();
// Set user data for a specific field
function setUserData(userId, field, value) {
    logger_1.logger.debug(`Setting ${field} for user ${userId}: ${value}`, 'USER_DATA');
    if (!botConfig_1.BOT_CONFIG.userData.validFields[field]) {
        throw new Error(`Invalid field: ${field}. Valid fields: ${Object.keys(botConfig_1.BOT_CONFIG.userData.validFields).join(', ')}`);
    }
    const existing = userDataStorage.get(userId) || {};
    userDataStorage.set(userId, {
        ...existing,
        [field]: value
    });
    return true;
}
function getUserData(userId, field) {
    const userData = userDataStorage.get(userId);
    if (!userData) {
        return field ? null : {};
    }
    if (field) {
        return userData[field] || null;
    }
    return userData;
}
