'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('../../helper');

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

    var routers, method, requestPath, commonSync, commonAsync, i, router, fileWithoutExt, routeMap, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, route;

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

            if (requestPath === '/' && this.request.query.mode != 1) {
              requestPath = '/index.html';
            }

            commonSync = config.syncDataMatch(requestPath.replace(/^(\/||\\)/, '').replace(/\.[^.]*$/, ''));
            commonAsync = _helper.util.jsonPathResolve(requestPath);

            console.log(routers);
            i = 0;

          case 8:
            if (!(i < routers.length)) {
              _context.next = 20;
              break;
            }

            router = routers[i];

            if (!(router.method.toUpperCase() == method.toUpperCase() && router.url == requestPath)) {
              _context.next = 17;
              break;
            }

            fileWithoutExt = _helper.util.removeSuffix(router.filePath);
            /**
             * 同步接口
             * 可能插件会生成一个 syncData ,若已生成则用插件的
             * 即: 插件对于响应,有更高的权限
             */

            if (router.sync) {

              this.dispatcher = _helper.util.dispatcherTypeCreator('sync', fileWithoutExt + '.' + config.extension, router.syncData || commonSync);
            } else {
              /**
               * 如果插件已生成了 asyncData 属性,则用插件的
               * 即: 插件对于响应,有更高的权限
               */
              this.dispatcher = _helper.util.dispatcherTypeCreator('async', commonAsync, router.asyncData || commonAsync);
            }
            _helper.util.log('请求url:' + router.url);
            _context.next = 16;
            return next;

          case 16:
            return _context.abrupt('return', _context.sent);

          case 17:
            i++;
            _context.next = 8;
            break;

          case 20:
            /**
             * ② 未拦截到 router
             */
            routeMap = (_routeMap = {
              '/': function _() {
                this.dispatcher = _helper.util.dispatcherTypeCreator('dir', requestPath, null);
              }
            }, _defineProperty(_routeMap, '.' + config.extension, function undefined() {
              this.dispatcher = _helper.util.dispatcherTypeCreator('sync', requestPath, commonSync);
            }), _defineProperty(_routeMap, '.json', function json() {
              this.dispatcher = _helper.util.dispatcherTypeCreator('async', commonAsync, commonAsync);
            }), _routeMap);
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 24;
            _iterator = Object.keys(routeMap)[Symbol.iterator]();

          case 26:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 36;
              break;
            }

            route = _step.value;

            if (!requestPath.endsWith(route)) {
              _context.next = 33;
              break;
            }

            routeMap[route].call(this);
            _context.next = 32;
            return next;

          case 32:
            return _context.abrupt('return', _context.sent);

          case 33:
            _iteratorNormalCompletion = true;
            _context.next = 26;
            break;

          case 36:
            _context.next = 42;
            break;

          case 38:
            _context.prev = 38;
            _context.t0 = _context['catch'](24);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 42:
            _context.prev = 42;
            _context.prev = 43;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 45:
            _context.prev = 45;

            if (!_didIteratorError) {
              _context.next = 48;
              break;
            }

            throw _iteratorError;

          case 48:
            return _context.finish(45);

          case 49:
            return _context.finish(42);

          case 50:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[24, 38, 42, 50], [43,, 45, 49]]);
  });
};