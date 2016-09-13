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

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Nei 插件
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

      this.formatArgs();
      var doUpdate = this.app.config.argv.update || false;
      this.neiRoute = _path2.default.resolve(this.app.config.root, 'nei.route.js');

      try {
        require(this.config);
      } catch (e) {
        _helper.util.error('nei 配置文件不存在，请先配置项目的nei关联，并核对 config 中的 nei.config是否合法');
      }

      if (doUpdate) {
        return this.async(function (resolve) {
          _nei2.default.update().then(_this.recieveUpdate).then(function () {
            _this.updateRoutes(_this.routes);
          });
        });
      }

      try {
        this.routes = this.updateRoutes(require(this.config));
      } catch (e) {
        _helper.util.error('foxman 未找到格式化过的内 nei route，请先执行 foxman -u ');
      }
    }
  }, {
    key: 'formatArgs',
    value: function formatArgs() {
      var _this2 = this;

      ['config', 'mockTpl', 'mockApi'].forEach(function (item) {
        _this2[item] = _path2.default.resolve(_this2.app.root, _this2[item]);
      });
    }
  }, {
    key: 'recieveUpdate',
    value: function recieveUpdate(config) {
      // 更新
      try {
        delete require.cache[require.resolve(this.config)];
      } catch (e) {}

      var rules = require(this.config).routes;
      this.routes = this.formatRoutes(rules);
      return this.updateLocalFiles(this.routes);
    }
  }, {
    key: 'formatRoutes',
    value: function formatRoutes(rules) {
      var server = this.app.server;
      var routes = [];
      var neiRoute = this.neiRoute;

      for (var ruleName in rules) {
        if (rules.hasOwnProperty(ruleName)) {
          var filePath = void 0,
              id = void 0;
          var rule = rules[ruleName];

          var _ruleName$split = ruleName.split(' ');

          var _ruleName$split2 = _slicedToArray(_ruleName$split, 2);

          var method = _ruleName$split2[0];
          var url = _ruleName$split2[1];

          // nei url 默认都是不带 / ,检查是否有

          url = _helper.util.appendHeadBreak(url);

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
      _helper.fileUtil.writeFile(neiRoute, 'module.exports = ' + _util2.default.inspect(routes, { maxArrayLength: null }), function () {});
      return routes;
    }
  }, {
    key: 'updateLocalFiles',
    value: function updateLocalFiles() {
      var routes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];


      var server = this.app.server;

      var syncData = server.syncData;
      var asyncData = server.asyncData;


      var promises = routes.map(function (route) {
        return new Promise(function (resolve, reject) {
          var dataPath = void 0;
          if (route.sync) {
            dataPath = server.syncDataMatch(route.filePath);
          } else {
            dataPath = _path2.default.resolve(server.asyncData, _helper.util.jsonPathResolve(route.filePath));
          }

          _fs2.default.stat(dataPath, function (error, stat) {
            /**
             * 文件不存在或者文件内容为空
             */
            if (error) {
              _helper.util.log('make empty file: ' + dataPath);
              _helper.fileUtil.writeUnExistsFile(dataPath, "").then(resolve, reject);
              return 0;
            }
            resolve();
          });
        });
      });
      return new Promise(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        Promise.all(promises).then(function () {
          args[0](routes);
        }).catch(function (e) {
          _helper.util.error(e);
        });
      });
    }
  }, {
    key: 'updateRoutes',
    value: function updateRoutes(routes) {
      var _this3 = this;

      var promises = routes.map(function (route) {
        return new Promise(function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _fs2.default.stat(route.filePath, function (error, stat) {
            /**
             * 文件不存在或者文件内容为空
             */
            if (error || !stat.size) {
              // TODO url creater
              var dataPath = _this3.genNeiApiUrl(route);
              if (route.sync) {
                route.syncData = dataPath;
              } else {
                route.asyncData = dataPath;
              }
            }
            args[0]();
          });
        });
      });
      Promise.all(promises).then(function () {
        var server = _this3.app.server;
        server.routers = routes.concat(server.routers);
      });
    }
  }, {
    key: 'genNeiApiUrl',
    value: function genNeiApiUrl(route) {
      return _path2.default.resolve(route.sync ? this.mockTpl : this.mockApi, route.filePath + '.json');
    }
  }]);

  return NeiPlugin;
}();

exports.default = NeiPlugin;