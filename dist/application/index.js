'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
	if (!app) {
		app = new Application();
	}
	return app;
};

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _foxmanApi = require('foxman-api');

var _util = require('../util/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = void 0;

var Application = function () {
	function Application() {
		_classCallCheck(this, Application);

		this.eventEmitter = new _events2.default();
		this.beforeEventMap = {};
		this.current = 0;
		this.states = _foxmanApi.STATES; //['ready', 'create', 'startServer', 'serverBuild'];
	}

	_createClass(Application, [{
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
				on: function on(msg, fn) {
					app.on.call(plugin, msg, fn.bind(plugin));
				},
				emit: app.emit,
				before: function before(msg, fn) {
					app.before.call(plugin, msg, fn.bind(plugin));
				},
				complete: app.complete
			});

			plugin.app = app;

			plugin.name = plugin.name || plugin.constructor.name;
			plugin.id = app.current++;

			plugin.bindLifeCircle = function () {
				app.states.forEach(function (item, idx) {
					var upperEventName = (0, _util.firstUpperCase)(item);

					if (idx !== 0 && plugin['before' + upperEventName]) {
						plugin.before(item, plugin['before' + upperEventName]);
					}
					if (plugin['on' + upperEventName]) {
						plugin.on(item, plugin['on' + upperEventName]);
					}
				});
			};
			plugin.bindLifeCircle();

			(0, _util.debugLog)('插件 ' + (plugin.name || plugin.id) + ' 装载完毕');
		}
	}, {
		key: 'run',
		value: function run() {
			setTimeout(function () {
				app.setState(app.states[0]);
			}, 1000);
		}
	}, {
		key: 'on',
		value: function on(msg, fn) {
			app.eventEmitter.on(msg, fn);
		}
	}, {
		key: 'before',
		value: function before(state, fn) {
			if (!~app.states.indexOf(state)) return;

			var prevState = app.states[app.states.indexOf(state) - 1];
			app.eventEmitter.on(prevState, fn);
			app.addBeforeEvent(state, this, fn);
		}
	}, {
		key: 'emit',
		value: function emit(msg, event) {
			app.eventEmitter.emit(msg, event);
		}
	}, {
		key: 'complete',
		value: function complete(event) {
			var nextState = app.states[app.states.indexOf(app.state) + 1];
			if (!nextState) {
				(0, _util.error)('can`t complete ,because no more state');
				return;
			}
			app.removeBeforeEvent(nextState, this);
			app.afterComplete(nextState);
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
				app.nextState();
			} else {
				(0, _util.debugLog)('进入 ' + msg + ' 阶段还需要插件 [' + leaveItems.join(',') + '] 准备完毕');
			}
			return leaveItemsLen <= 0;
		}
	}, {
		key: 'nextState',
		value: function nextState() {
			var nextState = app.states[app.states.indexOf(app.state) + 1];
			(0, _util.debugLog)('进入 ' + nextState + ' 阶段');
			app.setState(nextState);
		}
	}, {
		key: 'setState',
		value: function setState(state) {
			app.state = state;
			app.emit(state, new _foxmanApi.Event(state, 'app'));
		}
	}]);

	return Application;
}();