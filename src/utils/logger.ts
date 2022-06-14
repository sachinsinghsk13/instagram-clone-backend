import { createLogger, format, transports } from "winston";
import path from 'path';
import dateformat from "dateformat";
let myFomatter = format.printf((options) => {
    return `[${options.level}]\t[${options.label}]\t${dateformat(new Date(options.timestamp))}\t${options.message}`;
});

export function createModuleLogger(moduleName: string) {
    return createLogger({
        transports: [
            new transports.File({
                filename: path.join('./', process.env.LOGGER_DIR || 'logs', process.env.LOG_FILENAME || 'instagram_clone.log'),
                format: format.combine(
                    format.timestamp(),
                    format.label({ label: moduleName }),
                    myFomatter,
                )
            }),
            new transports.Console({
                level: 'debug',
                format: format.combine(
                    format.timestamp(),
                    format.label({ label: moduleName }),
                    format.prettyPrint(),
                    format.splat(),
                    format.simple(),
                    myFomatter
                )
            })
        ]
    });
}