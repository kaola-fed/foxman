'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _helper = require('../../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
    function Server(config) {
        _classCallCheck(this, Server);

        console.log(config);
        this.app = (0, _koa2.default)();
        this.config = config;

        (0, _render2.default)({
            viewFolder: config.viewRoot
        });

        this.buildResource(config.static);
        this.setRender();
        this.dispatch();
    }

    _createClass(Server, [{
        key: 'setRender',
        value: function setRender() {
            (0, _koaEjs2.default)(this.app, {
                root: _path2.default.join(global.__rootdir, 'views'),
                layout: 'template',
                viewExt: 'html',
                cache: process.env.NODE_ENV !== "development",
                debug: true
            });
        }
    }, {
        key: 'buildResource',
        value: function buildResource() {
            var _this = this;

            var staticDirs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            var rootdir = void 0;
            var dir = void 0;
            staticDirs.forEach(function (item) {
                dir = /[^(\\||\/)]*$/ig.exec(item);
                if (!dir || !dir[0]) return;
                rootdir = item.replace(dir[0], '');
                _this.app.use((0, _koaServe2.default)(dir[0], rootdir));
            });

            this.app.use((0, _koaServe2.default)('resource', __dirname));
        }
    }, {
        key: 'dispatch',
        value: function dispatch() {
            var context = this;

            this.app.use(regeneratorRuntime.mark(function _callee() {
                var url, routeMap, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, route;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                url = this.req.url;
                                routeMap = {
                                    '/': _dispatcher.dirDispatcher,
                                    '.ftl': _dispatcher.ftlDispatcher,
                                    '.json': _dispatcher.jsonDispatcher
                                };
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 5;
                                _iterator = Object.keys(routeMap)[Symbol.iterator]();

                            case 7:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 16;
                                    break;
                                }

                                route = _step.value;

                                if (!url.endsWith(route)) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.next = 12;
                                return routeMap[route](url, context.config, this);

                            case 12:
                                return _context.abrupt('return');

                            case 13:
                                _iteratorNormalCompletion = true;
                                _context.next = 7;
                                break;

                            case 16:
                                _context.next = 22;
                                break;

                            case 18:
                                _context.prev = 18;
                                _context.t0 = _context['catch'](5);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 22:
                                _context.prev = 22;
                                _context.prev = 23;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 25:
                                _context.prev = 25;

                                if (!_didIteratorError) {
                                    _context.next = 28;
                                    break;
                                }

                                throw _iteratorError;

                            case 28:
                                return _context.finish(25);

                            case 29:
                                return _context.finish(22);

                            case 30:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[5, 18, 22, 30], [23,, 25, 29]]);
            }));
        }
    }, {
        key: 'createServer',
        value: function createServer() {
            this.config.port = this.config.port || 3000;
            this.app.listen(this.config.port);
            _helper.util.log('freemarker-server is run on port ' + this.config.port + '~ ');
        }
    }]);

    return Server;
}();

exports.default = Server;