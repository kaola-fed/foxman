const { errorLog } = require('./util');
const { lt } = require('semver');

exports.checkVersion = checkVersion;

function checkVersion({ version, versionLimit, notify = [] }) {
    if (lt(version, versionLimit)) {
        notify.forEach(errorLog);
        process.exit(1);
    }
    return true;
}
