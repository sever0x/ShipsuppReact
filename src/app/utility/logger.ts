import { DEV_MODE } from "constants/config";

type LogLevel = 'log' | 'info' | 'warn' | 'error';

const devLogger = (level: LogLevel = 'log') =>
    (...args: any[]) => {
        if (DEV_MODE) {
            const timestamp = new Date().toISOString();
            const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

            switch (level) {
                case 'info':
                    console.info(prefix, ...args);
                    break;
                case 'warn':
                    console.warn(prefix, ...args);
                    break;
                case 'error':
                    console.error(prefix, ...args);
                    break;
                default:
                    console.log(prefix, ...args);
            }
        }
    };

export const log = devLogger('log');
export const info = devLogger('info');
export const warn = devLogger('warn');
export const error = devLogger('error');

export default {
    log,
    info,
    warn,
    error
};