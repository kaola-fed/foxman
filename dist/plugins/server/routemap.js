'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var fileDispatcher = function fileDispatcher(config) {
    var routeMap = new Map();
    routeMap.set('/', function (_ref) {
        var dirPath = _ref.dirPath;

        this.dispatcher = _helper.util.dispatcherTypeCreator('dir', dirPath, null);
    });

    routeMap.set('.' + config.extension, function (_ref2) {
        var commonTplPath = _ref2.commonTplPath;
        var commonSync = _ref2.commonSync;

        this.dispatcher = _helper.util.dispatcherTypeCreator('sync', commonTplPath, commonSync);
    });

    routeMap.set('.json', function (_ref3) {
        var commonAsync = _ref3.commonAsync;

        this.dispatcher = _helper.util.dispatcherTypeCreator('async', commonAsync, commonAsync);
    });
    return routeMap;
};

exports.default = function (config) {
    var routeMap = fileDispatcher(config);
    return regeneratorRuntime.mark(function _callee(next) {
        var dirPath, routers, method, requestPath, requestInfo, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, router, tplPath, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step2$value, route, handler;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(this.request.query.mode == 1 && this.request.path.endsWith('/'))) {
                            _context.next = 6;
                            break;
                        }

                        dirPath = _path2.default.join(config.viewRoot, this.request.path);

                        routeMap.get('/').call(this, { dirPath: dirPath });
                        _context.next = 5;
                        return next;

                    case 5:
                        return _context.abrupt('return', _context.sent);

                    case 6:

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
                        requestInfo = {};
                        /**
                         * computedTplPath 与 tplPath 的区别是 在 请求url为'/'的时候
                         * 前者为 '.../tpl/',
                         * 后者为 '.../tpl/index.html'
                         * @type {[string]}
                         */

                        requestInfo.commonTplPath = _path2.default.join(config.viewRoot, this.request.path);

                        /**
                         * 根据用户定义的规则和url,生成通用的同步数据路径
                         * @type {[string]}
                         */
                        requestInfo.commonSync = config.syncDataMatch(_helper.util.jsonPathResolve(requestPath));

                        /**
                         * 根据用户定义的规则和url,生成通用的异步数据路径
                         * @type {[string]}
                         */
                        requestInfo.commonAsync = config.asyncDataMatch(_helper.util.jsonPathResolve(requestPath));

                        /**
                         * 遍历路由表,并给请求对象处理,生成 this.dispatcher
                         */
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 17;
                        _iterator = routers[Symbol.iterator]();

                    case 19:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 31;
                            break;
                        }

                        router = _step.value;

                        if (!(router.method.toUpperCase() == method.toUpperCase() && router.url == this.request.path)) {
                            _context.next = 28;
                            break;
                        }

                        tplPath = _path2.default.join(config.viewRoot, _helper.util.removeSuffix(router.filePath) + '.' + config.extension);
                        /**
                         * 同步接口
                         * 可能插件会生成一个 syncData ,若已生成则用插件的
                         * 即: 插件对于响应,有更高的权限
                         */

                        if (router.sync) {
                            this.dispatcher = _helper.util.dispatcherTypeCreator('sync', tplPath, router.syncData || requestInfo.commonSync);
                        } else {
                            /**
                             * 如果插件已生成了 asyncData 属性,则用插件的
                             * 即: 插件对于响应,有更高的权限
                             */
                            this.dispatcher = _helper.util.dispatcherTypeCreator('async', requestInfo.commonAsync, router.asyncData || requestInfo.commonAsync);
                        }
                        _helper.util.log(router.method + ' ' + router.url);
                        _context.next = 27;
                        return next;

                    case 27:
                        return _context.abrupt('return', _context.sent);

                    case 28:
                        _iteratorNormalCompletion = true;
                        _context.next = 19;
                        break;

                    case 31:
                        _context.next = 37;
                        break;

                    case 33:
                        _context.prev = 33;
                        _context.t0 = _context['catch'](17);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 37:
                        _context.prev = 37;
                        _context.prev = 38;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 40:
                        _context.prev = 40;

                        if (!_didIteratorError) {
                            _context.next = 43;
                            break;
                        }

                        throw _iteratorError;

                    case 43:
                        return _context.finish(40);

                    case 44:
                        return _context.finish(37);

                    case 45:

                        /**
                         * ② 未拦截到 router
                         */
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 48;
                        _iterator2 = routeMap[Symbol.iterator]();

                    case 50:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 62;
                            break;
                        }

                        _step2$value = _slicedToArray(_step2.value, 2);
                        route = _step2$value[0];
                        handler = _step2$value[1];

                        if (!requestPath.endsWith(route)) {
                            _context.next = 59;
                            break;
                        }

                        handler.call(this, requestInfo);
                        _context.next = 58;
                        return next;

                    case 58:
                        return _context.abrupt('return', _context.sent);

                    case 59:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 50;
                        break;

                    case 62:
                        _context.next = 68;
                        break;

                    case 64:
                        _context.prev = 64;
                        _context.t1 = _context['catch'](48);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t1;

                    case 68:
                        _context.prev = 68;
                        _context.prev = 69;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 71:
                        _context.prev = 71;

                        if (!_didIteratorError2) {
                            _context.next = 74;
                            break;
                        }

                        throw _iteratorError2;

                    case 74:
                        return _context.finish(71);

                    case 75:
                        return _context.finish(68);

                    case 76:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[17, 33, 37, 45], [38,, 40, 44], [48, 64, 68, 76], [69,, 71, 75]]);
    });
};