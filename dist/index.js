"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = __importDefault(require("./appConfig/settings"));
const server_1 = require("./server");
const app = (0, server_1.createServer)();
app.listen(settings_1.default.port, () => console.log(`Server running on port ${settings_1.default.port}`));
