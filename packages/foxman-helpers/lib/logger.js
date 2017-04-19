const Logger = require('chalklog');
const printer = new Logger('foxman');
const {upperCaseFirstLetter} = require('./string');

function debugLog(msg) {
    if (process.env.NODE_ENV === 'development') {
        printer.blue(upperCaseFirstLetter(msg));
    }
    return 0;
}

function errorLog(msg) {
    printer.red(msg);
    return 0;
}

function error(msg) {
    msg = msg.stack || msg;

    const tips = [
        'Make sure you have the latest version of node.js and foxman.',
        'If you do, this is most likely a problem with the foxman.',
        'You could contact us(http://github.com/kaola-fed/foxman/issues)'
    ];
    tips.forEach(errorLog);

    console.log('\n');
    errorLog(msg);

    tips.unshift('\n');
    tips.unshift(msg);
    // writeFileSync('foxman-debug.log', tips.join('\n'));
    process.exit(1);
}

function log(msg) {
    printer.green(upperCaseFirstLetter(msg));
    return 0;
}

function warnLog(msg) {
    msg = msg.stack || msg;
    printer.yellow(upperCaseFirstLetter(msg));
}

exports.print = printer;
exports.debugLog = debugLog;
exports.error = error;
exports.log = log;
exports.errorLog = errorLog;
exports.warnLog = warnLog;