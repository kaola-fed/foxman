import {errorLog} from './util';

export function checkVersion({
    version,
    versionLimit,
    notify
}) {
    if (isVersionUnder(version, versionLimit)) {
        if (notify === undefined) {
            notify = [`Expect foxman version higher than v${versionLimit} in current project!`];
        }
        notify.forEach(errorLog);
        errorLog('Please install latest version:');
        errorLog('$ npm i -g foxman');
        errorLog('And re-install all dependencies in current working directory');
        errorLog('for more release info, head to https://github.com/kaola-fed/foxman/releases ;-)');
        process.exit(1);
    }
}

function isVersionUnder(v1, v2) {
    const version1 = parseVersion(v1);
    const version2 = parseVersion(v2);
    const stages = ['alpha', 'beta', 'rc', 'stable'];
    const checklist = ['majorVersion', 'minorVersion', 'patchVersion', 'stage', 'fixVersion'];

    return checklist.some(function (item) {
        if (item === 'stage') {
            return stages.indexOf(version1[item]) < stages.indexOf(version2[item])
        }
        return version1[item] < version2[item];
    });
}

function parseVersion(str) {
    let [head = '', end = ''] = str.split('-');

    const headList = head.split('.');
    const endList = end.split('.');

    const majorVersion = headList[0];
    const minorVersion = headList[1];
    const patchVersion = headList[2];

    const stage = endList[0] || 'stable';
    const fixVersion = endList[1] || Math.max();

    return {
        majorVersion,
        minorVersion,
        patchVersion,
        stage,
        fixVersion
    };
}