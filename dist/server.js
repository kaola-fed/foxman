'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _path = require('path');

var _koaServe = require('koa-serve');

var _koaServe2 = _interopRequireDefault(_koaServe);

var _renderUtil = require('./renderUtil');

var _renderUtil2 = _interopRequireDefault(_renderUtil);

var _koaEjs = require('koa-ejs');

var _koaEjs2 = _interopRequireDefault(_koaEjs);

var _dispatcher = require('./dispatcher');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
	function Server(config) {
		_classCallCheck(this, Server);

		this.app = (0, _koa2.default)();

		var _config = Object.assign({}, {
			port: '3000',
			ftlDir: (0, _path.join)(global.__rootdirname, 'test', 'ftl'),
			mockFtlDir: (0, _path.join)(global.__rootdirname, 'test', 'mock', 'fakeData'),
			mockJsonDir: (0, _path.join)(global.__rootdirname, 'test', 'mock', 'json'),
			staticParentDir: (0, _path.join)(global.__rootdirname, 'test')
		});

		Object.assign(_config, config);
		Object.assign(this, _config);

		(0, _renderUtil2.default)({
			viewFolder: this.ftlDir
		});

		this.setRender();
		this.buildResource();
		this.dispatch();
	}

	_createClass(Server, [{
		key: 'setRender',
		value: function setRender() {
			(0, _koaEjs2.default)(this.app, {
				root: (0, _path.join)(global.__rootdirname, 'views'),
				layout: 'template',
				viewExt: 'html',
				cache: false,
				debug: true
			});
		}
	}, {
		key: 'buildResource',
		value: function buildResource() {
			this.app.use((0, _koaServe2.default)('static', this.staticParentDir));
		}
	}, {
		key: 'dispatch',
		value: function dispatch() {
			var context = this;

			this.app.use(regeneratorRuntime.mark(function _callee() {
				var url, path, routeMap, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, route;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								url = this.req.url;
								path = (0, _path.join)(context.ftlDir, url);
								routeMap = {
									'/': _dispatcher.dirDispatcher,
									'.ftl': _dispatcher.ftlDispatcher,
									'.json': _dispatcher.jsonDispatcher
								};
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 6;
								_iterator = Object.keys(routeMap)[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context.next = 17;
									break;
								}

								route = _step.value;

								if (!url.endsWith(route)) {
									_context.next = 14;
									break;
								}

								_context.next = 13;
								return routeMap[route](url, path, context, this);

							case 13:
								return _context.abrupt('return');

							case 14:
								_iteratorNormalCompletion = true;
								_context.next = 8;
								break;

							case 17:
								_context.next = 23;
								break;

							case 19:
								_context.prev = 19;
								_context.t0 = _context['catch'](6);
								_didIteratorError = true;
								_iteratorError = _context.t0;

							case 23:
								_context.prev = 23;
								_context.prev = 24;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 26:
								_context.prev = 26;

								if (!_didIteratorError) {
									_context.next = 29;
									break;
								}

								throw _iteratorError;

							case 29:
								return _context.finish(26);

							case 30:
								return _context.finish(23);

							case 31:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[6, 19, 23, 31], [24,, 26, 30]]);
			}));
		}
	}, {
		key: 'createServer',
		value: function createServer() {
			this.app.listen(this.port);
			console.log('freemarker-server is run on port ' + this.port + '~ ');
		}
	}]);

	return Server;
}();

new Server({}).createServer();