/**
 * Created by june on 2017/3/16.
 */
const log = console.log;

const error = (msg) => {
    const e = 'error'.red;
    msg = msg.stack || msg;
    log(e, msg);
};

const wrong = (msg) => {
    const e = 'error'.red;
    msg = msg.stack || msg;
    log(e, msg);
    process.exit(1);
};

exports.log = log;

exports.error = error;

exports.wrong = wrong;