'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getFileByStream = getFileByStream;
exports.getDirInfo = getDirInfo;
exports.getFileStat = getFileStat;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.writeUnExistsFile = writeUnExistsFile;
exports.jsonResover = jsonResover;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 通用文件系统处理
 *
 * import {getFileByStream,...} from 'fileUtil'
 * or
 *
 * import fileUtil from 'fileUtil'
 * then
 * 	fileUtil.getFileByStream
 *  ...
 */

function getFileByStream(path) {
	return _fs2.default.ReadStream(path);
}

function getDirInfo(dir) {
	return new Promise(function (resolve, reject) {
		_fs2.default.readdir(dir, function (err, files) {
			if (err) {
				return reject(err);
			}
			resolve(files);
		});
	});
}
function getFileStat(file) {
	return new Promise(function (resolve, reject) {
		_fs2.default.lstat(file, function (err, stat) {
			if (err) {
				return reject(err);
			}
			resolve(stat);
		});
	});
}

function readFile(file) {
	return new Promise(function (resolve, reject) {
		_fs2.default.readFile(file, 'utf-8', function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
}

function writeFile(filename, text) {
	return new Promise(function (resolve, reject) {
		_fs2.default.writeFile(filename, text, function (err) {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
}

function writeUnExistsFile(file, text) {
	var needCreateStack = [file];

	return new Promise(function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var search = function search() {
			file = _path2.default.resolve(file, '../');
			_fs2.default.stat(file, function (err) {
				if (err) {
					needCreateStack.push(file);
					search();
				} else {
					create();
				}
			});
		};
		var create = function create() {
			var _writeFile;

			var file = needCreateStack.pop();
			if (needCreateStack.length != 0) {
				return _fs2.default.mkdir(file, create);
			}
			(_writeFile = writeFile(file, text)).then.apply(_writeFile, args);
		};

		search();
	});
}

function jsonResover(url) {
	// console.log(url);
	// console.log(/^http/g.test(url));
	return new Promise(function (resolve, reject) {
		if (/^http/g.test(url)) {
			_util2.default.log('waiting for request');
			_util2.default.request({ url: url }).then(function (htmlBuf) {
				var json = void 0;
				try {
					json = JSON.parse(htmlBuf.toString('utf-8'));
				} catch (e) {
					json = {};
				}
				resolve(json);
			});
			return;
		}

		resolve(require(url));
	});
}

exports.default = {
	getFileByStream: getFileByStream,
	getDirInfo: getDirInfo,
	getFileStat: getFileStat,
	readFile: readFile,
	writeFile: writeFile,
	writeUnExistsFile: writeUnExistsFile,
	jsonResover: jsonResover
};