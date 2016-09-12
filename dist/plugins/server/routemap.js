'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('../../helper');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 全局中间件,会将具体的页面转换成需要的资源
 * 1.同步
 * {
 *  path,syncData
 * }
 * 2.异步
 * {
 *  asyncData
 * }
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
exports.default = function (config) {

  return regeneratorRuntime.mark(function _callee(next) {
    var _routeMap;

    var routers, method, requestPath, routeMap, realTplPath, tplPath, commonSync, commonAsync, i, router, fileWithoutExt, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, route;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            /**
             * ① 拦截 router
             * @type {[type]}
             */
            routers = config.routers;
            method = this.request.method;
            requestPath = this.request.path;
            routeMap = (_routeMap = {
              '/': function _() {
                this.dispatcher = _helper.util.dispatcherTypeCreator('dir', realTplPath, null);
              }
            }, _defineProperty(_routeMap, '.' + config.extension, function undefined() {
              this.dispatcher = _helper.util.dispatcherTypeCreator('sync', tplPath, commonSync);
            }), _defineProperty(_routeMap, '.json', function json() {
              this.dispatcher = _helper.util.dispatcherTypeCreator('async', commonAsync, commonAsync);
            }), _routeMap);


            if (requestPath == '/') {
              requestPath = '/index.html';
            }

            /**
             * 路径统一绝对路径
             */
            realTplPath = _path2.default.join(config.viewRoot, this.request.path);
            tplPath = _path2.default.join(config.viewRoot, requestPath);
            commonSync = config.syncDataMatch(requestPath.replace(/^(\/||\\)/, '').replace(/\.[^.]*$/, '')); // arg[0] = viewName;

            commonAsync = config.asyncDataMatch(_helper.util.jsonPathResolve(requestPath));

            /**
             * mode 1 拦截文件夹的路径
             */

            if (!(this.request.query.mode == 1 && this.request.path.endsWith('/'))) {
              _context.next = 15;
              break;
            }

            _helper.util.log('文件夹类型');
            routeMap['/'].call(this);
            _context.next = 14;
            return next;

          case 14:
            return _context.abrupt('return', _context.sent);

          case 15:

            /**
              */
            console.log(tplPath);
            console.log(commonSync);
            console.log(commonAsync);

            i = 0;

          case 19:
            if (!(i < routers.length)) {
              _context.next = 32;
              break;
            }

            router = routers[i];

            if (!(router.method.toUpperCase() == method.toUpperCase() && router.url == this.request.path)) {
              _context.next = 29;
              break;
            }

            fileWithoutExt = _helper.util.removeSuffix(router.filePath);
            /**
             * 同步接口
             * 可能插件会生成一个 syncData ,若已生成则用插件的
             * 即: 插件对于响应,有更高的权限
             */

            if (router.sync) {
              this.dispatcher = _helper.util.dispatcherTypeCreator('sync', _path2.default.join(config.viewRoot, fileWithoutExt + '.' + config.extension), router.syncData || commonSync);
            } else {
              /**
               * 如果插件已生成了 asyncData 属性,则用插件的
               * 即: 插件对于响应,有更高的权限
               */
              this.dispatcher = _helper.util.dispatcherTypeCreator('async', commonAsync, router.asyncData || commonAsync);
            }
            _helper.util.log('请求url:' + router.url);

            console.log(this.dispatcher);
            _context.next = 28;
            return next;

          case 28:
            return _context.abrupt('return', _context.sent);

          case 29:
            i++;
            _context.next = 19;
            break;

          case 32:

            /**
             * ② 未拦截到 router
             */

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 35;
            _iterator = Object.keys(routeMap)[Symbol.iterator]();

          case 37:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 47;
              break;
            }

            route = _step.value;

            if (!requestPath.endsWith(route)) {
              _context.next = 44;
              break;
            }

            routeMap[route].call(this);
            _context.next = 43;
            return next;

          case 43:
            return _context.abrupt('return', _context.sent);

          case 44:
            _iteratorNormalCompletion = true;
            _context.next = 37;
            break;

          case 47:
            _context.next = 53;
            break;

          case 49:
            _context.prev = 49;
            _context.t0 = _context['catch'](35);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 53:
            _context.prev = 53;
            _context.prev = 54;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 56:
            _context.prev = 56;

            if (!_didIteratorError) {
              _context.next = 59;
              break;
            }

            throw _iteratorError;

          case 59:
            return _context.finish(56);

          case 60:
            return _context.finish(53);

          case 61:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[35, 49, 53, 61], [54,, 56, 60]]);
  });
};