const { typeOf } = require('./typer');
const Logger = require('chalklog');
const printer = new Logger('foxman');
const PrettyError = require('pretty-error');
const prettyError = new PrettyError();

function ln() {
    console.log('\n');
}
function info(msg) {
    printer.blue(msg);
}

function success(msg) {
    printer.green(msg);
}

function warn(msg) {
    if (typeOf(msg) !== 'string') {
        return warn(prettyError.render(msg));
    }
    printer.yellow(msg);
}

function error(msg) {
    if (typeOf(msg) !== 'string') {
        return error(prettyError.render(msg));
    }
    printer.red(msg);
}

exports.info = info;
exports.success = success;
exports.error = error;
exports.warn = warn;
exports.ln = ln;
