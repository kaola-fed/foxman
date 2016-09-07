'use strict';

var _index = require('./application/index');

var _index2 = _interopRequireDefault(_index);

var _server = require('./plugins/server/');

var _server2 = _interopRequireDefault(_server);

var _watcher = require('./plugins/watcher/');

var _watcher2 = _interopRequireDefault(_watcher);

var _precompiler = require('./plugins/precompiler/');

var _precompiler2 = _interopRequireDefault(_precompiler);

var _foxmanApi = require('foxman-api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ower = void 0;

var Ower = function Ower(config) {
    _classCallCheck(this, Ower);

    var app = (0, _index2.default)();
    var root = config.root;
    /**
     * __setConfig
     */
    app.setConfig(config);

    /**
     * 内置组件
     */
    app.use(new _watcher2.default(Object.assign(config.watch, {
        root: root
    })));
    app.use(new _server2.default(Object.assign(config.server, {
        root: root
    }))); /** main **/
    app.use(new _precompiler2.default({
        preCompilers: config.preCompilers,
        root: root
    })); /** main **/

    /**
     * __loadPlugins
     */
    app.use(config.plugins);

    /**
     * __ready
     */
    app.run();

    /** start server **/

    /** start server **/
};

module.exports = function (config) {
    if (!ower) ower = new Ower(config);
    return ower;
};