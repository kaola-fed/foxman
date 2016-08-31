'use strict';

var _index = require('./application/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./server/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./watcher/index');

var _index6 = _interopRequireDefault(_index5);

var _util = require('./util/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ower = void 0;

var Ower = function Ower(config) {
	_classCallCheck(this, Ower);

	var app = (0, _index2.default)();
	app.use(config.plugins);
	app.use(_index6.default, config);
	app.use(_index4.default, config);
	app.run();

	/** start server **/

	// new Server(config).startServer();

	/** start server **/
};

module.exports = function (config) {
	if (!ower) ower = new Ower(config);
	return ower;
};