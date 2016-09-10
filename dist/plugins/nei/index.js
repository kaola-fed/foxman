'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nei = require('./nei');

var _nei2 = _interopRequireDefault(_nei);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nei3 = require('nei/lib/server/nei');

var _nei4 = _interopRequireDefault(_nei3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 监听插件
 */
var NeiPlugin = function () {
  function NeiPlugin(options) {
    _classCallCheck(this, NeiPlugin);

    this.options = options;
  }

  _createClass(NeiPlugin, [{
    key: 'init',
    value: function init() {
      var _this = this;

      _nei2.default.update().then(function (config) {
        var neiConfigRoot = config.neiConfigRoot;
        _this.formatRoutes(require(neiConfigRoot + '/server.config.js'));
      });
    }
  }, {
    key: 'formatRoutes',
    value: function formatRoutes(rules) {
      rules = _nei4.default.getRoutes(rules);
      console.log(rules);
      console.log('fine');
    }
  }]);

  return NeiPlugin;
}();

exports.default = NeiPlugin;