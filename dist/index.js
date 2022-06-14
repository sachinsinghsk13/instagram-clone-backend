"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("./utils/logger");
// -----------------------
dotenv_1.default.config();
const logger = (0, logger_1.createModuleLogger)('InstagramCloneApp');
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.json({ message: 'working' });
});
const port = process.env.SERVER_PORT || 8080;
app.listen(port, () => {
    logger.info(`Node server started listening on port ${port}`);
});
//# sourceMappingURL=index.js.map