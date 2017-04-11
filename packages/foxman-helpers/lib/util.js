const child_process = require('child_process');
const crypto = require('crypto');
const { readFile, writeFileSync } = require('./fileutil');
const Logger = require('chalklog');
const notifier = require('node-notifier');

const clog = new Logger('foxman');

function notify({ title, msg }) {
    notifier.notify({
        title: title,
        message: msg,
        sound: true,
        wait: true
    });
}

function isPromise(obj) {
    return obj && obj.value && obj.value.then;
}

function isGeneratorDone(obj) {
    return obj && obj.done;
}

function debugLog(msg) {
    if (process.env.NODE_ENV === 'development') {
        clog.blue(initialsCapitals(msg));
    }
}

function errorLog(msg) {
    clog.red(msg);
}

function error(msg) {
    msg = msg.stack || msg;

    const tips = [
        'Make sure you have the latest version of node.js and foxman.',
        'If you do, this is most likely a problem with the foxman.',
        'You could contact us(http://github.com/kaola-fed/foxman/issues)'
    ];
    tips.forEach(errorLog);

    console.log('\n');
    errorLog(msg);

    tips.unshift('\n');
    tips.unshift(msg);
    writeFileSync('foxman-debug.log', tips.join('\n'));
    process.exit(1);
}

function log(msg) {
    clog.green(initialsCapitals(msg));
}

function warnLog(msg) {
    msg = msg.stack || msg;
    clog.yellow(initialsCapitals(msg));
}

function createSystemId() {
    // uid
    let currentId = 0;
    return function getNext() {
        return ++currentId;
    };
}

function initialsCapitals(str) {
    return str.replace(/^\b(\w)(\w*)/, function($0, $1, $2) {
        return $1.toUpperCase() + $2;
    });
}

function jsSpawn(args) {
    let jsSpawn = child_process.spawn('node', args);
    jsSpawn.stderr.on('data', data => {
        clog.red(`err: ${data}`);
    });
    return {
        stdout: jsSpawn.stdout,
        stderr: jsSpawn.stderr
    };
}

function removeHeadBreak(str) {
    return str.replace(/^(\/|\\)/, '');
}

function removeSuffix(str, test) {
    if (test) {
        return str.replace(new RegExp('\.' + test + '$', 'ig'), '');
    }
    return str.replace(/\.[^\.]*$/, '');
}

function jsonPathResolve(url) {
    url = removeSuffix(url) + '.json';

    if (/\.[^\.]*$/.test(url)) {
        return removeHeadBreak(url);
    }
    return url;
}

function appendHeadBreak(str) {
    if (/^[\/\\]/.test(str)) {
        return str;
    }
    return '/' + str;
}

function JSONParse(jsonStr) {
    const result = new Function(`return ${jsonStr}`)();

    if (typeOf(result) === 'object') {
        return result;
    }

    return {};
}

function typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest('hex');
}

function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

function compressHtml(htmlstr) {
    if (typeof htmlstr !== 'string') {
        return htmlstr;
    }
    return htmlstr
        .replace(/[\r\n]|\s+(?=[<{])/g, '')
        .replace(/[}>]\s+/g, function(value) {
            return value.substr(0, 1);
        });
}

function jsonResolver(opt) {
    return new Promise(resolve => {
        let url = typeof opt == 'string' ? opt : opt.url;
        let json;
        readFile(url)
            .then(data => {
                try {
                    json = JSONParse(data);
                } catch (e) {
                    warnLog('Parsed failed:');
                    warnLog(e);
                    json = {};
                }
                resolve({ json });
            })
            .catch(() => {
                resolve({ json: {} });
            });
    });
}

function lowerCaseFirstLetter(str) {
    return str.replace(/^\b(\w)(\w*)/, function($0, $1, $2) {
        return $1.toLowerCase() + $2;
    });
}

function values(map = {}) {
    return Object.keys(map).map(k => map[k]);
}

function addDataExt(filePath) {
    if (~filePath.indexOf('.json')) {
        return filePath;
    }
    return filePath + '.json';
}

module.exports = {
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
    entries,
    compressHtml,
    jsonResolver,
    values,
    notify,
    addDataExt
};
