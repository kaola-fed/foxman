import {errorLog} from './util';
import compareVersions from 'compare-versions';

export function checkVersion({
    version,
    versionLimit,
    notify = []
}) {
    if (compareVersions(version, versionLimit) === -1) {
        notify.forEach(errorLog);
        process.exit(1);
    }
}