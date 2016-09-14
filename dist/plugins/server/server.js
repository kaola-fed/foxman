'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaServe = require('koa-serve');

var _koaServe2 = _interopRequireDefault(_koaServe);

var _render = require('../../helper/render');

var _render2 = _interopRequireDefault(_render);

var _koaEjs = require('koa-ejs');

var _koaEjs2 = _interopRequireDefault(_koaEjs);

var _dispatcher = require('./dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _routemap = require('./routemap');

var _routemap2 = _interopRequireDefault(_routemap);

var _helper = require('../../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
  function Server(config) {
    var _this = this;

    _classCallCheck(this, Server);

    this.app = (0, _koa2.default)();
    Object.assign(this, config);

    this.formatArgs();

    if (!this.syncDataMatch) {
      this.syncDataMatch = function (url) {
        return _path2.default.resolve(_this.syncData, url);
      };
    }

    if (!this.asyncDataMatch) {
      this.asyncDataMatch = function (url) {
        return _path2.default.join(_this.asyncData, url);
      };
    }

    this.setRender();
    this.setStaticHandler();
    this.delayInit();
  }

  _createClass(Server, [{
    key: 'formatArgs',
    value: function formatArgs() {
      var _this2 = this;

      ['syncData', 'viewRoot', 'asyncData'].forEach(function (item) {
        _this2[item] = _path2.default.resolve(_this2.root, _this2[item]);
      });

      this.static.forEach(function (item, idx) {
        _this2.static[idx] = _path2.default.resolve(_this2.root, item);
      });
    }
  }, {
    key: 'delayInit',
    value: function delayInit() {
      var app = this.app;
      app.use((0, _routemap2.default)(this));
      app.use((0, _dispatcher2.default)(this));
    }
  }, {
    key: 'setRender',
    value: function setRender() {
      if (this.tplConfig) {
        Object.assign(this, this.tplConfig);
      }

      this.renderUtil = this.renderUtil || _render2.default;
      this.extension = this.extension || 'ftl';

      this.renderUtil({ viewFolder: this.viewRoot });

      (0, _koaEjs2.default)(this.app, {
        root: _path2.default.join(global.__rootdir, 'views'),
        layout: 'template',
        viewExt: 'html',
        cache: process.env.NODE_ENV !== "development",
        debug: true
      });
    }
  }, {
    key: 'setStaticHandler',
    value: function setStaticHandler() {
      var _this3 = this;

      var rootdir = void 0;
      var dir = void 0;
      if (this.static && !Array.isArray(this.static)) this.static = [this.static];

      this.static.forEach(function (item) {
        dir = /[^(\\\/)]*$/.exec(item);
        if (!dir || !dir[0]) return;
        rootdir = item.replace(/[^(\\\/)]*$/, '');

        _this3.app.use((0, _koaServe2.default)(dir[0], rootdir));
      });
      this.app.use((0, _koaServe2.default)('resource', global.__rootdir));
    }
  }, {
    key: 'appendHtml',
    value: function appendHtml(html) {
      var extension = this.extension;
      this.app.use(regeneratorRuntime.mark(function _callee(next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (/text\/html/ig.test(this.type)) {
                  this.body = this.body + html;
                }
                _context.next = 3;
                return next;

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: 'createServer',
    value: function createServer() {
      var port = this.port || 3000;
      this.serverApp = _http2.default.createServer(this.app.callback()).listen(port);
      _helper.util.log('server is running on ' + port);
    }
  }]);

  return Server;
}();

exports.default = Server;