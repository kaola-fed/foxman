'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

        _this.uid = _helper.util.createSystemId();
        _this.plugins = [];
        return _this;
    }

    _createClass(Application, [{
        key: 'setConfig',
        value: function setConfig(config) {
            this.config = config;
        }
    }, {
        key: 'use',
        value: function use(plugin) {
            if (Array.isArray(plugin)) return plugin.forEach(this.use.bind(this));
            this.plugins.push(Object.assign(plugin, {
                app: this,
                name: plugin.constructor.name,
                id: this.uid()
            }));
            _helper.util.debugLog('plugin ' + (plugin.name || plugin.id) + ' is loaded');
        }
        // before(plugin ,scope, fn){
        //   if (!this.scopeMap[scope]) return;
        //
        //   const prevScope = this.getPrevScope(scope);
        //   this.on(prevScope, fn.bind(plugin));
        //   this.addBeforeEvent(scope, plugin);
        // }
        // complete(plugin){
        //   const nextScope = this.getNextScope(this.scope);
        //   if (!nextScope) {
        //       util.error('can`t complete ,because no more scope');
        //       return;
        //   }
        //
        //   const result = this.removeBeforeEvent(nextScope, plugin);
        //   if (result === -1) {
        //       util.debugLog('请检查是否在plugin中的 before.. 方法内重复调用 this.complete')
        //   }
        //   this.afterComplete(nextScope);
        // }

    }, {
        key: 'run',
        value: function run() {
            this.plugins.forEach(function (plugin) {
                plugin.init && plugin.init();
            });
        }
    }]);

    return Application;
}(_events2.default);

exports.default = Application;