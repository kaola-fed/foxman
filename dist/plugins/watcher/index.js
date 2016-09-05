'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _foxmanApi = require('foxman-api');

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 监听插件
 */
var WatcherPlugin = function (_BasePlugin) {
  _inherits(WatcherPlugin, _BasePlugin);

  function WatcherPlugin(options) {
    _classCallCheck(this, WatcherPlugin);

    var _this = _possibleConstructorReturn(this, (WatcherPlugin.__proto__ || Object.getPrototypeOf(WatcherPlugin)).call(this, options));

    _this.options = options;
    _this.root = options.root;
    return _this;
  }

  _createClass(WatcherPlugin, [{
    key: 'init',
    value: function init() {
      this.watch(this.root);
    }
  }, {
    key: 'watch',
    value: function watch(root) {
      var app = this.app;
      app.watcher = new _watcher2.default(root);
      /**
       * file watcher api;
       * relative path is root Directory
       */
      // app.watcher.onChange('/**/*', function ( path, stats) {
      //   // debugLog(`watcher: ${path}`);
      // });
    }
  }]);

  return WatcherPlugin;
}(_foxmanApi.BasePlugin);

exports.default = WatcherPlugin;