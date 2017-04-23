const Logger = require('chalklog');
const parrotSay = require('parrotsay-api');

function newline() {
    console.log('\n');
}

function say(text) {
    return parrotSay(text)
        .then(console.log)
        .catch(console.error);
}

function createLogger( scope ) {
    const logger = new Logger(scope);
    return {
        info(msg) {
            logger.blue(msg);
        },

        success(msg) {
            logger.green(msg);
        },

        warn(msg) {
            logger.yellow(msg);
        },

        error(msg) {
            logger.red(msg);
        }
    };
}

const defaultLogger = createLogger('foxman');

exports.createLogger = createLogger;
exports.info = defaultLogger.info;
exports.success = defaultLogger.success;
exports.error = defaultLogger.error;
exports.warn = defaultLogger.warn;
exports.newline = newline;
exports.say = say;
