const os = require('os');
const Logger = require('chalklog');
const parrotSay = require('parrotsay-api');

function createLogger(scope) {
    const logger = new Logger(scope);
    return {
        info(msg) {
            logger.blue(msg);
        },

        success(msg) {
            logger.green(msg);
        },

        warn(msg) {
            if (Array.isArray(msg)) {
                return msg.forEach(m => logger.warn(m));
            }
            logger.yellow(msg.stack || msg);
        },

        error(msg) {
            if (Array.isArray(msg)) {
                return msg.forEach(m => logger.red(m));
            }
            logger.red(msg.stack || msg);
        },

        newline() {
            console.log('\n');
        },

        say(text) {
            if (os.platform() === 'win32') {
                console.log(text);
            } else {
                parrotSay(text).then(console.log).catch(console.error);
            }
        }
    };
}

const defaultLogger = createLogger('🦊');

Object.assign(exports, defaultLogger, { createLogger });
