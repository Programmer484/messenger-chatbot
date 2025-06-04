"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const appConfig_1 = require("../appConfig");
const logLevels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};
const logMethods = {
    DEBUG: console.log,
    INFO: console.log,
    WARN: console.warn,
    ERROR: console.error
};
function shouldLog(level, category) {
    return logLevels[level] >= logLevels[appConfig_1.APP_CONFIG.logging.level] &&
        appConfig_1.APP_CONFIG.logging.enabledCategories.includes(category);
}
function createLogFunction(level) {
    return (message, category = 'GENERAL') => {
        if (shouldLog(level, category)) {
            logMethods[level](`[${level}:${category}] ${message}`);
        }
    };
}
exports.logger = {
    debug: createLogFunction('DEBUG'),
    info: createLogFunction('INFO'),
    warn: createLogFunction('WARN'),
    error: createLogFunction('ERROR')
};
