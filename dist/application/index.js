'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if (!app) {
		app = new _application2.default();
	}
	return app;
};

var _application = require('./application');

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = void 0;