const { errorLog } = require('./util');
const { lt } = require('semver');

exports.checkVersion = checkVersion;

function checkVersion({ version, versionLimit, notify = [] }) {
    if (lt(normalizeVersion(version), normalizeVersion(versionLimit))) {
        notify.forEach(errorLog);
        return false;
    }
    return true;
}

function normalizeVersion(version) {
    if (version.startsWith('v')) {
        return version.slice(1);
    }
    return version;
}
