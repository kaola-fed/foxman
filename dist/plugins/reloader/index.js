'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helper = require('../../helper');

var _reloader = require('./reloader');

var _reloader2 = _interopRequireDefault(_reloader);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import globule from 'globule';

/**
 * 监听插件
 */
var ReloadPlugin = function () {
  function ReloadPlugin(options) {
    _classCallCheck(this, ReloadPlugin);

    this.options = options;
  }

  _createClass(ReloadPlugin, [{
    key: 'init',
    value: function init() {
      var server = this.app.server;
      server.appendHtml("<script src='/resource/js/reload.js'></script>");

      this.reloader = new _reloader2.default(Object.assign({
        watcher: this.app.watcher,
        server: this.app.server
      }, this.options));
    }
  }]);

  return ReloadPlugin;
}();

exports.default = ReloadPlugin;