'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugLog = debugLog;
exports.error = error;
exports.log = log;
exports.warnLog = warnLog;
exports.createSystemId = createSystemId;
exports.firstUpperCase = firstUpperCase;
exports.exec = exec;
exports.jsSpawn = jsSpawn;
exports.removeHeadBreak = removeHeadBreak;
exports.removeSuffix = removeSuffix;
exports.jsonPathResolve = jsonPathResolve;
exports.appendHeadBreak = appendHeadBreak;
exports.bufferConcat = bufferConcat;
exports.dispatcherTypeCreator = dispatcherTypeCreator;
exports.request = request;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

require('colors');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by hzxujunyu on 2016/8/15.
 */
function debugLog(msg) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[D]'.blue + ' ' + msg);
  }
}

function error(msg) {
  console.log('[E]'.red + ' ' + msg);
  process.exit(1);
}

function log(msg) {
  console.log('[I]'.green + ' ' + msg);
}

function warnLog(msg) {
  console.log('[W]'.yellow + ' ' + msg);
}

function createSystemId() {
  // uid
  var currentId = 0;
  return function getNext() {
    return ++currentId;
  };
}

function firstUpperCase(str) {
  return str.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
    return $1.toUpperCase() + $2;
  });
}

function exec(exe, success, failed) {
  _child_process2.default.exec(exe, function (error, stdout, stderr) {
    if (error) error('exec error: ' + error);

    if (!stderr) success(stdout);else failed(stderr);
  });
}

function jsSpawn(args) {
  var jsSpawn = _child_process2.default.spawn('node', args);
  jsSpawn.stderr.on('data', function (data) {
    console.log('err: ' + data);
  });
  return {
    stdout: jsSpawn.stdout,
    stderr: jsSpawn.stderr
  };
}

function removeHeadBreak(str) {
  return str.replace(/^(\/||\\)/, '');
}

function removeSuffix(str) {
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

function bufferConcat() {
  for (var _len = arguments.length, bufs = Array(_len), _key = 0; _key < _len; _key++) {
    bufs[_key] = arguments[_key];
  }

  var total = bufs.reduce(function (pre, crt) {
    return (Array.isArray(pre) ? pre.length : pre) + crt.length;
  });
  return Buffer.concat(bufs, total);
};

function dispatcherTypeCreator(type, path, dataPath) {
  return {
    type: type,
    path: path,
    dataPath: dataPath
  };
}

function request(options) {

  var urlInfo = _url2.default.parse(options.url);
  options = Object.assign({
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, urlInfo);

  return new Promise(function (resolve, reject) {
    var req = _http2.default.request(options, function (res) {
      var htmlBuf = Buffer.alloc(0);

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        htmlBuf = bufferConcat(htmlBuf, Buffer.from(chunk));
      });
      res.on('end', function () {
        resolve(htmlBuf);
      });
    });

    req.on('error', function (e) {
      reject();
      console.log('problem with request: ' + e.message);
    });
    req.end();
  });
}

exports.default = {
  debugLog: debugLog,
  error: error,
  warnLog: warnLog,
  log: log,
  createSystemId: createSystemId,
  firstUpperCase: firstUpperCase,
  exec: exec,
  jsSpawn: jsSpawn,
  jsonPathResolve: jsonPathResolve,
  removeHeadBreak: removeHeadBreak,
  removeSuffix: removeSuffix,
  appendHeadBreak: appendHeadBreak,
  bufferConcat: bufferConcat,
  dispatcherTypeCreator: dispatcherTypeCreator,
  request: request
};