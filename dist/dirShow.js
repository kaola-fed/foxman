'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dirShow = void 0;

var DirShow = function () {
	function DirShow() {
		_classCallCheck(this, DirShow);
	}

	_createClass(DirShow, [{
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
		key: 'getFileData',
		value: function getFileData(file) {
			return new Promise(function (resolve, reject) {
				(0, _fs.readFile)(files, function (err, data) {
					if (err) {
						return reject(err);
					}
					resolve(data);
				});
			});
		}
	}]);

	return DirShow;
}();

exports.default = function () {
	if (!dirShow) {
		dirShow = new DirShow();
	}
	return dirShow;
}();