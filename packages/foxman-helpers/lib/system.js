const child_process = require('child_process');
const { lt } = require('semver');
const { errorLog, printer } = require('./logger');
const notifier = require('node-notifier');

function notify({ title, msg }) {
    notifier.notify({
        title: title,
        message: msg,
        sound: true,
        wait: true
    });
    return 0;
}

function checkVersion({ version, versionLimit, notify = [] }) {
    if (lt(version, versionLimit)) {
        notify.forEach(errorLog);
        return false;
    }
    return true;
}

function createSystemId() {
    // uid
    let currentId = 0;
    return function getNext() {
        return currentId++;
    };
}

function jsSpawn(args) {
    let jsSpawn = child_process.spawn('node', args);
    jsSpawn.stderr.on('data', data => {
        printer.red(`err: ${data}`);
    });
    return {
        stdout: jsSpawn.stdout,
        stderr: jsSpawn.stderr
    };
}

exports.notify = notify;
exports.jsSpawn = jsSpawn;
exports.checkVersion = checkVersion;
exports.createSystemId = createSystemId;
