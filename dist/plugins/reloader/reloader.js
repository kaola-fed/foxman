'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ws = require('ws');

var _helper = require('../../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Reloader = function (_EventEmitter) {
  _inherits(Reloader, _EventEmitter);

  function Reloader(options) {
    _classCallCheck(this, Reloader);

    var _this = _possibleConstructorReturn(this, (Reloader.__proto__ || Object.getPrototypeOf(Reloader)).call(this));

    Object.assign(_this, options);
    _this.bindChange();
    _this.buildWebSocket();
    return _this;
  }

  _createClass(Reloader, [{
    key: 'bindChange',
    value: function bindChange() {
      var _this2 = this;

      var server = this.server;
      var watcher = this.watcher;

      var reloadResources = [_path2.default.resolve(server.viewRoot, '**', '*.' + server.extension), _path2.default.resolve(server.syncData, '**', '*'), _path2.default.resolve(server.asyncData, '**', '*')];

      reloadResources.concat(server.static.map(function (item) {
        return [_path2.default.resolve(item, '**', '*.js'), _path2.default.resolve(item, '**', '*.css')];
      }));

      this.watcher.onChange(reloadResources, function (arg0, arg1) {
        _this2.reload(arg0);
      });
    }
  }, {
    key: 'buildWebSocket',
    value: function buildWebSocket() {
      var _this3 = this;

      var serverApp = this.server.serverApp;
      this.wss = new _ws.Server({
        server: serverApp
      });

      this.wss.on('connection', function (ws) {
        ws.on('message', function (message) {
          console.log('received: %s', message);
        });
      });

      this.wss.broadcast = function (data) {
        _this3.wss.clients.forEach(function each(client) {
          client.send(data, function (error) {
            if (error) {
              console.log(error);
            }
          });
        });
      };
    }
  }, {
    key: 'reload',
    value: function reload() {
      this.wss.broadcast(_path2.default.basename(arguments.length <= 0 ? undefined : arguments[0]));
    }
  }]);

  return Reloader;
}(_events2.default);

exports.default = Reloader;