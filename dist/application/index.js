'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = function () {
	if (!app) {
		app = new Application();
	}
	return app;
};

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _foxmanApi = require('foxman-api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var app = void 0;

var Application = function (_EventEmitter) {
	_inherits(Application, _EventEmitter);

	function Application() {
		_classCallCheck(this, Application);

		var __ready = '__ready';
		var __makeFile = '__makeFile';
		var __serverStart = '__serverStart';

		var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

		_this.beforeEventMap = {};
		_this.getNextId = _foxmanApi.util.createSystemId();

		_this.scopeMap = {
			__ready: __ready,
			__makeFile: __makeFile,
			__serverStart: __serverStart
		};
		_this.scopeList = Object.keys(_this.scopeMap);
		return _this;
	}

	_createClass(Application, [{
		key: 'setConfig',
		value: function setConfig(config) {
			app.config = config;
		}
	}, {
		key: 'addBeforeEvent',
		value: function addBeforeEvent(eventName, plugin, fn) {
			if (!app.beforeEventMap[eventName]) app.beforeEventMap[eventName] = {};

			app.beforeEventMap[eventName][plugin.id] = {
				name: plugin.name,
				fn: fn
			};
		}
	}, {
		key: 'removeBeforeEvent',
		value: function removeBeforeEvent(eventName, plugin) {

			if (!app.beforeEventMap[eventName] || !app.beforeEventMap[eventName][plugin.id]) {
				_foxmanApi.util.error(eventName + ' is not in our scope list.');
				return -1;
			}
			try {
				delete app.beforeEventMap[eventName][plugin.id];
			} catch (err) {
				app.beforeEventMap[eventName][plugin.id] = null;
			}
		}
	}, {
		key: 'use',
		value: function use(Plugins, options) {
			var plugin = void 0;
			if (Array.isArray(Plugins) && !options) {
				Plugins.forEach(function (Plugin) {
					if (Array.isArray(Plugin)) {
						Plugin = Object.assign({}, {
							class: Plugin[0],
							options: Plugin[1]
						});
					}
					app.use(Plugin.class, Plugin.options);
				});
				return;
			}

			plugin = new Plugins(options);
			Object.assign(plugin, {
				app: app,
				config: app.config,
				name: plugin.name || plugin.constructor.name,
				id: app.getNextId(),

				on: function on(msg, fn) {
					app.on(msg, fn.bind(plugin));
				},
				emit: function emit(msg, event) {
					app.call(msg, event);
				},
				before: function before(scope, fn) {
					if (!app.scopeMap[scope]) return;
					var prevScope = app.getPrevScope(scope);
					this.on(prevScope, fn);
					app.addBeforeEvent(scope, this, fn);
				},
				complete: function complete(event) {
					var nextScope = app.getNextScope(app.scope);
					if (!nextScope) {
						_foxmanApi.util.error('can`t complete ,because no more scope');
						return;
					}
					var result = app.removeBeforeEvent(nextScope, this);

					if (result === -1) {
						_foxmanApi.util.warnLog('请检查是否在plugin中的 before.. 方法内重复调用 this.complete');
					}
					app.afterComplete(nextScope);
				}
			});
			plugin.init && plugin.init();

			plugin.bindLifeCircle = function () {
				app.scopeList.forEach(function (item, idx) {
					var upperEventName = _foxmanApi.util.firstUpperCase(item.slice(2));
					if (idx !== 0 && plugin['before' + upperEventName]) {
						plugin.before(item, plugin['before' + upperEventName]);
					}
					if (plugin['on' + upperEventName]) {
						plugin.on(item, plugin['on' + upperEventName]);
					}
				});
			};
			plugin.bindLifeCircle();

			_foxmanApi.util.debugLog('plugin ' + (plugin.name || plugin.id) + ' is ready');
		}
	}, {
		key: 'run',
		value: function run() {
			setTimeout(function () {
				app.setScope(app.scopeMap['__ready']);
			}, 1000);
		}
	}, {
		key: 'on',
		value: function on(msg, fn) {
			_get(Application.prototype.__proto__ || Object.getPrototypeOf(Application.prototype), 'on', this).call(this, msg, fn);
		}
	}, {
		key: 'emit',
		value: function emit(msg, event) {
			_get(Application.prototype.__proto__ || Object.getPrototypeOf(Application.prototype), 'emit', this).call(this, msg, event);
		}
	}, {
		key: 'getPrevScope',
		value: function getPrevScope(scope) {
			return app.scopeList[app.scopeList.indexOf(scope) - 1];
		}
	}, {
		key: 'getNextScope',
		value: function getNextScope(scope) {
			return app.scopeList[app.scopeList.indexOf(scope) + 1];
		}
	}, {
		key: 'afterComplete',
		value: function afterComplete(msg) {
			var leaveItemIDs = Object.keys(app.beforeEventMap[msg] || {});
			var leaveItems = leaveItemIDs.map(function (id) {
				return app.beforeEventMap[msg][id].name;
			});
			var leaveItemsLen = leaveItems.length;
			if (leaveItemsLen <= 0) {
				app.nextScope();
			} else {
				_foxmanApi.util.debugLog('enter ' + msg + ' is wating [' + leaveItems.join(',') + '],checkout the plugin.complete');
			}
			return leaveItemsLen <= 0;
		}
	}, {
		key: 'nextScope',
		value: function nextScope() {
			var nextScope = app.getNextScope(app.scope);
			_foxmanApi.util.debugLog('now scope is ' + nextScope);
			app.setScope(nextScope);
		}
	}, {
		key: 'setScope',
		value: function setScope(scope) {
			app.scope = scope;
			app.emit(scope, new _foxmanApi.Event(scope, 'app'));
		}
	}]);

	return Application;
}(_events2.default);