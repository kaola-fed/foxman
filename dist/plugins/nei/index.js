'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nei = require('./nei');

var _nei2 = _interopRequireDefault(_nei);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helper = require('../../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import neiHandle from 'nei/lib/server/nei';

/**
 * 监听插件
 */
var NeiPlugin = function () {
  function NeiPlugin(options) {
    _classCallCheck(this, NeiPlugin);

    this.options = options;
    Object.assign(this, options);
  }

  _createClass(NeiPlugin, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.updateLocalFiles(this.formatRoutes(require(this.neiConfigRoot).routes));
      return;

      _nei2.default.update().then(function (config) {
        _this.formatRoutes(require(_this.neiConfigRoot).routes);
      });
    }
  }, {
    key: 'formatRoutes',
    value: function formatRoutes(rules) {
      var routes = [];
      for (var ruleName in rules) {
        if (rules.hasOwnProperty(ruleName)) {
          var filePath = void 0,
              id = void 0;
          var rule = rules[ruleName];

          var _ruleName$split = ruleName.split(' ');

          var _ruleName$split2 = _slicedToArray(_ruleName$split, 2);

          var method = _ruleName$split2[0];
          var url = _ruleName$split2[1];

          var sync = rule.hasOwnProperty('list');

          if (sync) {
            filePath = rule.list[0].path;
            id = rule.list[0].id;
          } else {
            filePath = rule.path;
            id = rule.id;
          }

          routes.push({
            method: method, url: url,
            sync: sync, filePath: filePath, id: id
          });
        }
      }

      return routes;
    }
  }, {
    key: 'updateLocalFiles',
    value: function updateLocalFiles() {
      var routes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var server = this.app.server;
      var syncData = server.syncData;
      var asyncData = server.asyncData;


      return routes.forEach(function (route) {
        var dataPath = void 0;
        if (route.sync) {
          dataPath = server.syncDataMatch(route.filePath);
        } else {
          dataPath = _path2.default.resolve(server.asyncData, _helper.util.jsonPathResolve(route.filePath));
        }
        _fs2.default.stat(dataPath, function (error, stat) {
          if (error) {
            _helper.util.log('make empty file: ' + dataPath);
            _helper.fileUtil.writeUnExistsFile(dataPath, "");
          }
        });
      });
    }
  }]);

  return NeiPlugin;
}();

exports.default = NeiPlugin;