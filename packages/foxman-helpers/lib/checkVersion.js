const { errorLog } = require('./util');
const { lt } = require('semver');

exports.checkVersion = checkVersion;

function checkVersion({ version, versionLimit, notify = [] }) {
    if (lt(ensureVersion(version), ensureVersion(versionLimit))) {
        notify.forEach(errorLog);
        return false;
    }
    return true;
}


function ensureVersion(version) {
    if (version.startsWith('v')) {
        return version.slice(1);
    }
    return version;
}