/**
 * Created by hzxujunyu on 2016/8/15.
 */
import child_process from 'child_process';
import crypto from 'crypto';
import {readFile, writeFileSync} from './fileutil';
import Logger from 'chalklog';
import notifier from 'node-notifier';
import path from 'path';

const clog = new Logger('foxman');

export function notify({
    title,
    msg
}) {
    notifier.notify({
        'title': title,
        'message': msg,
        'sound': true, 
        'wait': true
    });
}

export function isPromise(obj) {
    return (obj && obj.value && obj.value.then);
}

export function isGeneratorDone(obj) {
    return obj && obj.done;
}

export function debugLog(msg) {
    if (process.env.NODE_ENV === 'development') {
        clog.blue(initialsCapitals(msg));
    }
}

export function errorLog(msg) {
    clog.red(msg);
}

export function error(msg) {
    msg = msg.stack || msg;

    const tips = [
        'Make sure you have the latest version of node.js and foxman.',
        'If you do, this is most likely a problem with the foxman.',
        'You could contact us(http://github.com/kaola-fed/foxman/issues)',
    ];
    tips.forEach(errorLog);

    console.log('\n');
    errorLog(msg);

    tips.unshift('\n');
    tips.unshift(msg);
    writeFileSync('foxman-debug.log', tips.join('\n'));
    process.exit(1);
}

export function log(msg) {
    clog.green(initialsCapitals(msg));
}

export function warnLog(msg) {
    msg = msg.stack || msg;
    clog.yellow(initialsCapitals(msg));
}

export function createSystemId() { // uid
    let currentId = 0;
    return function getNext() {
        return ++currentId;
    };
}

export function initialsCapitals(str) {
    return str.replace(/^\b(\w)(\w*)/, function ($0, $1, $2) {
        return $1.toUpperCase() + $2;
    });
}

export function jsSpawn(args) {
    let jsSpawn = child_process.spawn('node', args);
    jsSpawn.stderr.on('data', (data) => {
        clog.red(`err: ${data}`);
    });
    return {
        stdout: jsSpawn.stdout,
        stderr: jsSpawn.stderr
    };
}

export function removeHeadBreak(str) {
    return str.replace(/^(\/|\\)/, '');
}

export function removeSuffix(str, test) {
    if (test) {
        return str.replace(new RegExp('\.' + test + '$', 'ig'), '');
    }
    return str.replace(/\.[^\.]*$/, '');
}

export function jsonPathResolve(url) {
    url = removeSuffix(url) + '.json';

    if (/\.[^\.]*$/.test(url)) {
        return removeHeadBreak(url);
    }
    return url;
}

export function appendHeadBreak(str) {
    if (/^[\/\\]/.test(str)) {
        return str;
    }
    return '/' + str;
}

export function JSONParse(jsonStr) {
    const result = new Function(`return ${jsonStr}`)();

    if (typeOf(result) === 'object') {
        return result;
    }

    return {};
}

export function typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

export function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest('hex');
}

export function matchArgs(func) {
    const argList = func.toString().match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m);
    return (argList && argList[1]) ? (argList[1].replace(/ /g, '').split(',')) : [];
}
export function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

export function compressHtml(htmlstr) {
    if (typeof htmlstr !== 'string') {
        return htmlstr;
    }
    return htmlstr.replace(/[\r\n]|\s+(?=[<{])/g, '').replace(/[}>]\s+/g, function (value) {
        return value.substr(0, 1);
    });
}

export function jsonResolver(opt) {
    return new Promise(resolve => {
        let url = (typeof opt == 'string') ? opt : opt.url;
        let json;
        readFile(url).then(data => {
            try {
                json = JSONParse(data);
            } catch (e) {
                warnLog('Parsed failed:');
                warnLog(e);
                json = {};
            }
            resolve({json});
        }).catch(() => {
            resolve({json: {}});
        });
    });
}

export function lowerCaseFirstLetter(str) {
    return str.replace(/^\b(\w)(\w*)/, function ($0, $1, $2) {
        return $1.toLowerCase() + $2;
    });
}

export function values(map = {}) {
    return Object.keys(map).map(k => map[k]);
}

export function addDataExt(filePath) {
    if (~filePath.indexOf('.json')) {
        return filePath;
    }
    return filePath + '.json';
}



export default {
    debugLog,
    error,
    warnLog,
    log,
    typeOf,
    createSystemId,
    initialsCapitals,
    lowerCaseFirstLetter,
    jsSpawn,
    jsonPathResolve,
    removeHeadBreak,
    removeSuffix,
    appendHeadBreak,
    sha1,
    JSONParse,
    isPromise,
    isGeneratorDone,
    matchArgs,
    entries,
    compressHtml,
    jsonResolver,
    values,
    notify,
    addDataExt
};
