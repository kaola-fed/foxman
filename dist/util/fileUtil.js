'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
	if (!fileUtil) {
		fileUtil = new FileUtil();
	}
	return fileUtil;
};

var _fs = require('fs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fileUtil = void 0;

var FileUtil = function () {
	function FileUtil() {
		_classCallCheck(this, FileUtil);
	}

	_createClass(FileUtil, [{
		key: 'getFileByStream',
		value: function getFileByStream(path) {
			return (0, _fs.ReadStream)(path);
		}
	}, {
		key: 'getDirInfo',
		value: function getDirInfo(dir) {
			return new Promise(function (resolve, reject) {
				(0, _fs.readdir)(dir, function (err, files) {
					if (err) {
						return reject(err);
					}
					resolve(files);
				});
			});
		}
	}, {
		key: 'getFileStat',
		value: function getFileStat(file) {
			return new Promise(function (resolve, reject) {
				(0, _fs.lstat)(file, function (err, stat) {
					if (err) {
						return reject(err);
					}
					resolve(stat);
				});
			});
		}
	}, {
		key: 'getFileContent',
		value: function getFileContent(file) {
			return new Promise(function (resolve, reject) {
				(0, _fs.readFile)(file, function (err, data) {
					if (err) {
						return reject(err);
					}
					resolve(data);
				});
			});
		}
	}]);

	return FileUtil;
}();

;