'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helper = require('../../helper');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        var routeMap, routers, method, requestPath, realTplPath, tplPath, commonSync, commonAsync, i, router, fileWithoutExt, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, route;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        routeMap = [{
                            test: '/', handler: function handler() {
                                this.dispatcher = _helper.util.dispatcherTypeCreator('dir', realTplPath, null);
                            }
                        }, {
                            test: '.' + config.extension, handler: function handler() {
                                this.dispatcher = _helper.util.dispatcherTypeCreator('sync', tplPath, commonSync);
                            }
                        }, {
                            test: '.json', handler: function handler() {
                                this.dispatcher = _helper.util.dispatcherTypeCreator('async', commonAsync, commonAsync);
                            }
                        }];
                        /**
                         * mode 1 拦截文件夹的路径
                         */

                        if (!(this.request.query.mode == 1 && this.request.path.endsWith('/'))) {
                            _context.next = 7;
                            break;
                        }

                        _helper.util.log('文件夹类型');
                        routeMap[0].handler.call(this);
                        _context.next = 6;
                        return next;

                    case 6:
                        return _context.abrupt('return', _context.sent);

                    case 7:

                        /**
                         * ① 拦截 router
                         * @type {[type]}
                         */
                        routers = config.routers;
                        method = this.request.method;
                        requestPath = this.request.path;


                        if (requestPath == '/') {
                            requestPath = '/index.html';
                        }
                        /**
                         * 路径统一绝对路径
                         */
                        realTplPath = _path2.default.join(config.viewRoot, this.request.path);
                        tplPath = _path2.default.join(config.viewRoot, requestPath);
                        commonSync = config.syncDataMatch(_helper.util.jsonPathResolve(requestPath));
                        commonAsync = config.asyncDataMatch(_helper.util.jsonPathResolve(requestPath));
                        i = 0;

                    case 16:
                        if (!(i < routers.length)) {
                            _context.next = 28;
                            break;
                        }

                        router = routers[i];

                        if (!(router.method.toUpperCase() == method.toUpperCase() && router.url == this.request.path)) {
                            _context.next = 25;
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
                        _context.next = 24;
                        return next;

                    case 24:
                        return _context.abrupt('return', _context.sent);

                    case 25:
                        i++;
                        _context.next = 16;
                        break;

                    case 28:

                        /**
                         * ② 未拦截到 router
                         */
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 31;
                        _iterator = routeMap[Symbol.iterator]();

                    case 33:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 43;
                            break;
                        }

                        route = _step.value;

                        if (!requestPath.endsWith(route.test)) {
                            _context.next = 40;
                            break;
                        }

                        route.handler.call(this);
                        _context.next = 39;
                        return next;

                    case 39:
                        return _context.abrupt('return', _context.sent);

                    case 40:
                        _iteratorNormalCompletion = true;
                        _context.next = 33;
                        break;

                    case 43:
                        _context.next = 49;
                        break;

                    case 45:
                        _context.prev = 45;
                        _context.t0 = _context['catch'](31);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 49:
                        _context.prev = 49;
                        _context.prev = 50;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 52:
                        _context.prev = 52;

                        if (!_didIteratorError) {
                            _context.next = 55;
                            break;
                        }

                        throw _iteratorError;

                    case 55:
                        return _context.finish(52);

                    case 56:
                        return _context.finish(49);

                    case 57:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[31, 45, 49, 57], [50,, 52, 56]]);
    });
};