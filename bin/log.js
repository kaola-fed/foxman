/**
 * Created by june on 2017/3/16.
 */
const Logger = require('chalklog');
const clog = new Logger('foxman');

const error = (msg) => {
    clog.red( msg);
};

const wrong = (msg) => {
    msg = msg.stack || msg;
    clog.red( msg);
    process.exit(1);
};

exports.log = console.log;

exports.error = error;

exports.wrong = wrong;