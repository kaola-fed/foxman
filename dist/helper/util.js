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

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function debugLog(msg) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[D] ' + msg);
  }
} /**
   * Created by hzxujunyu on 2016/8/15.
   */
function error(msg) {
  console.log('[E] ' + msg);
  process.exit(1);
}

function log(msg) {
  console.log('[I] ' + msg);
}

function warnLog(msg) {
  console.log('[W] ' + msg);
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

exports.default = {
  debugLog: debugLog,
  error: error,
  warnLog: warnLog,
  log: log,
  createSystemId: createSystemId,
  firstUpperCase: firstUpperCase,
  exec: exec,
  jsSpawn: jsSpawn
};