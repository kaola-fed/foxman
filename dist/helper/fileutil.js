'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getFileByStream = getFileByStream;
exports.getDirInfo = getDirInfo;
exports.getFileStat = getFileStat;
exports.readFile = readFile;
exports.writeFile = writeFile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFileByStream(path) {
	return _fs2.default.ReadStream(path);
} /**
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

exports.default = {
	getFileByStream: getFileByStream,
	getDirInfo: getDirInfo,
	getFileStat: getFileStat,
	readFile: readFile,
	writeFile: writeFile
};