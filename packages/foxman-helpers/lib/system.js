const child_process = require('child_process');
const { lt } = require('semver');
const notifier = require('node-notifier');
const {logger} = require('./logger');

function notify({ title, msg }) {
    notifier.notify({
        title: title,
        message: msg,
        sound: true,
        wait: true
    });
    return 0;
}

function checkVersion({ version, versionMin }) {
    return !lt(version, versionMin);
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
        logger.error(`err: ${data}`);
    });
    return {
        stdout: jsSpawn.stdout,
        stderr: jsSpawn.stderr
    };
}

function exit() {
    process.exit(1);
}

exports.notify = notify;
exports.jsSpawn = jsSpawn;
exports.checkVersion = checkVersion;
exports.createSystemId = createSystemId;
exports.exit = exit;
