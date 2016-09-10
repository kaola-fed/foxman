'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helper = require('../../helper');

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 监听插件
 */
var WatcherPlugin = function () {
    function WatcherPlugin(options) {
        _classCallCheck(this, WatcherPlugin);

        this.options = options;
        this.root = options.root;
    }

    _createClass(WatcherPlugin, [{
        key: 'init',
        value: function init() {
            this.app.watcher = new _watcher2.default(this.root);
        }
    }]);

    return WatcherPlugin;
}();

exports.default = WatcherPlugin;