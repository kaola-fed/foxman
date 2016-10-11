/**
 * Created by hzxujunyu on 2016/8/15.
 */
import child_process from 'child_process';
import 'colors';
import http from 'http';
import https from 'https';
import url from 'url';
import path from 'path';

export function debugLog(msg) {
    if (process.env.NODE_ENV === 'development') {
        console.log('[DEBUG]'.blue + ' ' + msg);
    }
}

export function error(msg) {
    console.log('[E]'.red + ' ' + msg);
    process.exit(1);
}

export function log(msg) {
    console.log('[I]'.green + ' ' + msg);
}

export function warnLog(msg) {
    console.log('[W]'.yellow + ' ' + msg);
}

export function createSystemId() { // uid
    let currentId = 0;
    return function getNext() {
        return ++currentId;
    }
}

export function initialsCapitals(str) {
    return str.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
        return $1.toUpperCase() + $2;
    });
}

export function initialsLower(str) {
    return str.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
        return $1.toLowerCase() + $2;
    });
}

export function exec(exe, success, failed) {
    child_process.exec(exe, (error, stdout, stderr) => {
        if (error) error(`exec error: ${error}`);

        if (!stderr) success(stdout);
        else failed(stderr);
    });
}

export function jsSpawn(args) {
    let jsSpawn = child_process.spawn('node', args);
    jsSpawn.stderr.on('data', (data) => {
        console.log(`err: ${data}`);
    });
    return {
        stdout: jsSpawn.stdout,
        stderr: jsSpawn.stderr
    }
}

export function removeHeadBreak(str) {
    return str.replace(/^(\/|\\)/, '');
}

export function removeSuffix(str) {
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
    return '/' + str
}

export function bufferConcat(...bufs) {
    const sizes = bufs.map((buf) => {
        return buf.length;
    });
    let total = sizes.reduce((pre, crt) => {
        return pre + crt;
    });

    return Buffer.concat(bufs, total);
}

export function dispatcherTypeCreator(type, path, dataPath, handler) {
    return {
        type,
        path,
        dataPath,
        handler
    }
}

export function request(options) {

    let urlInfo = url.parse(options.url);
    delete options.url;

    options = Object.assign({}, urlInfo, options);
    return new Promise((resolve, reject) => {
        const requestBody = options.requestBody;

        delete options.requestBody;

        let protocolMap = {
            http: http,
            https: https
        };
        let protocolHandler = protocolMap[urlInfo.protocol.slice(0, -1)];

        let req = protocolHandler.request(options, (res) => {
            res.body = Buffer.alloc(0);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                res.body = bufferConcat(res.body, Buffer.from(chunk));
            });
            res.on('end', () => {
                resolve(res);
            });
        });

        req.on('error', (e) => {
            reject();
            console.log(`problem with request: ${e.message}`);
        });

        req.write(requestBody);

        req.end();
    })
}
export function typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

export function throttle(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}

export function replaceCommet(str) {
    return str.replace( /(\/\*(.*)?\*\/)|(\/\/(.*)?((\n)|(\r)|(\r\n)))/g, '');
}

export default {
    debugLog,
    error,
    warnLog,
    log,
    createSystemId,
    initialsLower,
    initialsCapitals,
    exec,
    jsSpawn,
    jsonPathResolve,
    removeHeadBreak,
    removeSuffix,
    appendHeadBreak,
    bufferConcat,
    dispatcherTypeCreator,
    request,
    throttle,
    replaceCommet
};
