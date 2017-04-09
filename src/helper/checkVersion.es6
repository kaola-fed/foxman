import {errorLog} from './util';
import {lt} from 'semver';

export function checkVersion({
    version,
    versionLimit,
    notify = []
}) {
    if (lt(version, versionLimit)) {
        notify.forEach(errorLog);
        process.exit(1);
    }
}