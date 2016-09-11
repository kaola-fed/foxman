'use strict';

var _index = require('./application/index');

var _index2 = _interopRequireDefault(_index);

var _server = require('./plugins/server/');

var _server2 = _interopRequireDefault(_server);

var _watcher = require('./plugins/watcher/');

var _watcher2 = _interopRequireDefault(_watcher);

var _precompiler = require('./plugins/precompiler/');

var _precompiler2 = _interopRequireDefault(_precompiler);

var _reloader = require('./plugins/reloader');

var _reloader2 = _interopRequireDefault(_reloader);

var _nei = require('./plugins/nei');

var _nei2 = _interopRequireDefault(_nei);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var owner = void 0;

var Owner = function Owner(config) {
    _classCallCheck(this, Owner);

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
    })));

    app.use(new _precompiler2.default({
        preCompilers: config.preCompilers,
        root: root
    })); /** main **/

    app.use(new _reloader2.default({})); /** reloader **/

    app.use(new _nei2.default({
        neiConfigRoot: _path2.default.resolve(process.cwd(), 'nei.11169.4af51152079f243c6dc28ce87908919e', 'server.config.js')
    }));
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
    if (!owner) owner = new Owner(config);
    return owner;
};