const Logger = require('chalklog');
const parrotSay = require('parrotsay-api');

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
            logger.yellow(msg.stack || msg);
        },

        error(msg) {
            logger.red(msg.stack || msg);
        },

        newline() {
            console.log('\n');
        },

        say(text) {
            return parrotSay(text)
                .then(console.log)
                .catch(console.error);
        }
    };
}

const defaultLogger = createLogger('foxman');

Object.assign( exports, defaultLogger, { createLogger } );
