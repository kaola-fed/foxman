'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _path = require('path');

var _koaServe = require('koa-serve');

var _koaServe2 = _interopRequireDefault(_koaServe);

var _fileUtil = require('./fileUtil');

var _fileUtil2 = _interopRequireDefault(_fileUtil);

var _renderUtil = require('./renderUtil');

var _renderUtil2 = _interopRequireDefault(_renderUtil);

var _koaEjs = require('koa-ejs');

var _koaEjs2 = _interopRequireDefault(_koaEjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
	function Server(config) {
		_classCallCheck(this, Server);

		this.app = (0, _koa2.default)();

		this.staticParentDir = config.staticDir || (0, _path.join)(global.__rootdirname, 'test');
		this.ftlDir = config.staticDir || (0, _path.join)(global.__rootdirname, 'test', 'ftl');
		this.mockFtlDir = config.staticDir || (0, _path.join)(global.__rootdirname, 'test', 'mock', 'fakeData');
		this.mockJsonDir = config.staticDir || (0, _path.join)(global.__rootdirname, 'test', 'mock', 'json');

		this.renderUtil = (0, _renderUtil2.default)({
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
			var ctx = this;
			this.app.use(regeneratorRuntime.mark(function _callee2() {
				var _this = this;

				var url, path, dataModelName, dataPath, dataModel, content, target, file, readstream;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								url = this.req.url;
								path = (0, _path.join)(ctx.ftlDir, url);

								if (!url.endsWith('/')) {
									_context2.next = 4;
									break;
								}

								return _context2.delegateYield(regeneratorRuntime.mark(function _callee() {
									var files, promises, result, fileList;
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													_context.next = 2;
													return (0, _fileUtil2.default)().getDirInfo(path);

												case 2:
													files = _context.sent;
													promises = files.map(function (file) {
														return (0, _fileUtil2.default)().getFileStat((0, _path.join)(path, file));
													});
													_context.next = 6;
													return Promise.all(promises);

												case 6:
													result = _context.sent;
													fileList = result.map(function (item, idx) {
														return Object.assign(item, {
															name: files[idx],
															isFile: item.isFile(),
															url: [url, files[idx], item.isFile() ? '' : '/'].join('')
														});
													});
													_context.next = 10;
													return _this.render('dir', { fileList: fileList });

												case 10:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, _this);
								})(), 't0', 4);

							case 4:
								if (!url.endsWith('.ftl')) {
									_context2.next = 14;
									break;
								}

								dataModelName = [url.replace(/.ftl$/, ''), '.json'].join('');
								dataPath = (0, _path.join)(ctx.mockFtlDir, dataModelName);
								dataModel = require(dataPath);
								_context2.next = 10;
								return (0, _fileUtil2.default)().getFileContent(path);

							case 10:
								content = _context2.sent;
								target = (0, _renderUtil2.default)().parser(content, url, dataModel);

								this.type = 'text/html; charset=utf-8';
								this.body = target.stdout;

							case 14:

								if (url.endsWith('.json')) {
									file = (0, _path.join)(ctx.mockJsonDir, url);
									readstream = (0, _fileUtil2.default)().getFileByStream(file);


									this.type = 'application/json; charset=utf-8';
									this.body = readstream;
								}

							case 15:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));
		}
	}, {
		key: 'createServer',
		value: function createServer() {
			var port = arguments.length <= 0 || arguments[0] === undefined ? 3000 : arguments[0];

			this.app.listen(port);
			console.log('freemarker-server is run on port ' + port + '~ ');
		}
	}]);

	return Server;
}();

new Server({}).createServer();