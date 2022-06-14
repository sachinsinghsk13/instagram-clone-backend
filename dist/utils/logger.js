"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModuleLogger = void 0;
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const dateformat_1 = __importDefault(require("dateformat"));
let myFomatter = winston_1.format.printf((options) => {
    return `[${options.level}]\t[${options.label}]\t${(0, dateformat_1.default)(new Date(options.timestamp))}\t${options.message}`;
});
function createModuleLogger(moduleName) {
    return (0, winston_1.createLogger)({
        transports: [
            new winston_1.transports.File({
                filename: path_1.default.join('./', process.env.LOGGER_DIR || 'logs', process.env.LOG_FILENAME || 'instagram_clone.log'),
                format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.label({ label: moduleName }), myFomatter)
            }),
            new winston_1.transports.Console({
                level: 'debug',
                format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.label({ label: moduleName }), winston_1.format.prettyPrint(), winston_1.format.splat(), winston_1.format.simple(), myFomatter)
            })
        ]
    });
}
exports.createModuleLogger = createModuleLogger;
//# sourceMappingURL=logger.js.map