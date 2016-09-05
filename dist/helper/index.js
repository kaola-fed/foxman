'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _nei = require('nei');

var _nei2 = _interopRequireDefault(_nei);

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _foxmanApi = require('foxman-api');

var _foxmanApi2 = _interopRequireDefault(_foxmanApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NeiApp = _path2.default.join(global.__rootdir, './node_modules/nei/bin/nei.js');

function build(config) {
	return new Promise(function (resolve, reject) {
		if (!config.neiPid) {
			var _ret = function () {
				var success = void 0,
				    build = _foxmanApi2.default.jsSpawn([NeiApp, 'build', config.pid]);

				build.stdout.on('data', function (data) {
					_foxmanApi2.default.log('nei: ' + data.toString('utf-8'));
					if (/success/.test(data)) success = true;
				});
				build.stdout.on('end', function () {
					if (success) {
						/**
       * 更新配置文件
       */
						var FOXMAN_CFG = (0, _fs.readFileSync)(config.configPath, 'utf-8');
						var cfg = FOXMAN_CFG.replace(/\}[^\}]*$/, '\n,neiPid: ' + config.pid + '};');
						(0, _fs.writeFileSync)(config.configPath, cfg);
						resolve();
					}
				});
				return {
					v: void 0
				};
			}();

			if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
		}
		resolve();
		_foxmanApi2.default.log('nei配置已存在，你可能需要的是 nei update');
	});
}

function update(config) {
	return new Promise(function (resolve, reject) {
		if (config.neiPid) {
			var _ret2 = function () {
				var success = void 0,
				    update = jsSpawn([NeiApp, 'update']);

				update.stdout.on('data', function (data) {
					_foxmanApi2.default.log('nei: ' + data.toString('utf-8'));
					if (/success/.test(data)) success = true;
				});
				update.stdout.on('end', function () {
					if (success) {
						resolve();
					}
				});
				return {
					v: void 0
				};
			}();

			if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
		}

		_foxmanApi2.default.log('nei pid未配置，你可能需要的是 nei update');
	});
}

function next() {
	_foxmanApi2.default.log('start server');
}

module.exports = function (config, next) {
	if (config.pid) {
		build(config).then(next);
	} else if (config.update) {
		update(config).then(next);
	} else {
		next();
	}
};