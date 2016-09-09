'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _helper = require('../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Application = function (_EventEmitter) {
    _inherits(Application, _EventEmitter);

    function Application() {
        _classCallCheck(this, Application);

        var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

        var __ready = '__ready';
        var __makeFile = '__makeFile';
        var __serverStart = '__serverStart';

        _this.beforeEventMap = {};
        _this.uid = _helper.util.createSystemId();
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
            this.config = config;
        }
    }, {
        key: 'addBeforeEvent',
        value: function addBeforeEvent(eventName, plugin) {
            if (!this.beforeEventMap[eventName]) this.beforeEventMap[eventName] = {};

            this.beforeEventMap[eventName][plugin.id] = plugin.name;
        }
    }, {
        key: 'removeBeforeEvent',
        value: function removeBeforeEvent(eventName, plugin) {
            if (!this.beforeEventMap[eventName] || !this.beforeEventMap[eventName][plugin.id]) {
                _helper.util.error(eventName + ' is not in our scope list.');
                return -1;
            }

            try {
                delete this.beforeEventMap[eventName][plugin.id];
            } catch (e) {}
        }
    }, {
        key: 'use',
        value: function use(plugin) {
            var _this2 = this;

            if (Array.isArray(plugin)) {
                return plugin.forEach(function (item) {
                    _this2.use(item);
                });
            }

            Object.assign(plugin, {
                app: this,
                // config: this.config, /** is it need**/
                name: plugin.name || plugin.constructor.name,
                id: this.uid(),
                on: function on(msg, fn) {
                    return _this2.on(msg, fn.bind(plugin));
                },
                emit: function emit(msg, event) {
                    return _this2.emit(msg, event);
                },
                before: function before(scope, fn) {
                    return _this2.before(plugin, scope, fn);
                },
                complete: function complete(event) {
                    return _this2.complete(plugin);
                }
            });
            plugin.init && plugin.init();

            this.bindLifeCycle(plugin);

            _helper.util.debugLog('plugin ' + (plugin.name || plugin.id) + ' is ready');
        }
    }, {
        key: 'before',
        value: function before(plugin, scope, fn) {
            if (!this.scopeMap[scope]) return;

            var prevScope = this.getPrevScope(scope);
            this.on(prevScope, fn.bind(plugin));
            this.addBeforeEvent(scope, plugin);
        }
    }, {
        key: 'complete',
        value: function complete(plugin) {
            var nextScope = this.getNextScope(this.scope);
            if (!nextScope) {
                _helper.util.error('can`t complete ,because no more scope');
                return;
            }

            var result = this.removeBeforeEvent(nextScope, plugin);
            if (result === -1) {
                _helper.util.debugLog('请检查是否在plugin中的 before.. 方法内重复调用 this.complete');
            }
            this.afterComplete(nextScope);
        }
    }, {
        key: 'bindLifeCycle',
        value: function bindLifeCycle(plugin) {
            this.scopeList.forEach(function (item, idx) {
                var upperEventName = _helper.util.firstUpperCase(item.slice(2));
                if (idx !== 0 && plugin['before' + upperEventName]) {
                    plugin.before(item, plugin['before' + upperEventName]);
                }
                if (plugin['on' + upperEventName]) {
                    plugin.on(item, plugin['on' + upperEventName]);
                }
            });
        }
    }, {
        key: 'run',
        value: function run() {
            var _this3 = this;

            setTimeout(function () {
                _this3.setScope(_this3.scopeMap['__ready']);
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
            return this.scopeList[this.scopeList.indexOf(scope) - 1];
        }
    }, {
        key: 'getNextScope',
        value: function getNextScope(scope) {
            return this.scopeList[this.scopeList.indexOf(scope) + 1];
        }
    }, {
        key: 'afterComplete',
        value: function afterComplete(msg) {
            var _this4 = this;

            var leaveItemIDs = Object.keys(this.beforeEventMap[msg] || {});
            var leaveItems = leaveItemIDs.map(function (id) {
                return _this4.beforeEventMap[msg][id].name;
            });

            var leaveItemsLen = leaveItems.length;
            if (leaveItemsLen <= 0) {
                this.nextScope();
            } else {
                _helper.util.debugLog('enter ' + msg + ' is wating [' + leaveItems.join(',') + '],checkout the plugin.complete');
            }
            return leaveItemsLen <= 0;
        }
    }, {
        key: 'nextScope',
        value: function nextScope() {
            var nextScope = this.getNextScope(this.scope);
            _helper.util.debugLog('now scope is ' + nextScope);
            this.setScope(nextScope);
        }
    }, {
        key: 'setScope',
        value: function setScope(scope) {
            this.scope = scope;
            this.emit(scope, { from: 'app' });
        }
    }]);

    return Application;
}(_events2.default);

exports.default = Application;