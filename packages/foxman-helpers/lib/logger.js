const Logger = require('chalklog');
const printer = new Logger('foxman');
const parrotSay = require('parrotsay-api');
// const PrettyError = require('pretty-error');
// const prettyError = new PrettyError();

function newline() {
    console.log('\n');
}
function info(msg) {
    printer.blue(msg);
}

function success(msg) {
    printer.green(msg);
}

function warn(msg) {
    printer.yellow(msg);
}

function error(msg) {
    printer.red(msg);
}

function say(text) {
    return parrotSay(text)
        .then(console.log)
        .catch(console.error);
}

exports.info = info;
exports.success = success;
exports.error = error;
exports.warn = warn;
exports.say = say;
exports.newline = newline;
