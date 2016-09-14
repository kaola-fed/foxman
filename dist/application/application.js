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
            var _this2 = this;

            if (Array.isArray(plugin)) return plugin.forEach(this.use.bind(this));
            this.plugins.push(Object.assign(plugin, {
                app: this,
                name: plugin.constructor.name,
                id: this.uid(),
                async: function async() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    return _this2.async.apply(plugin, args);
                }
            }));
            _helper.util.debugLog('plugin ' + (plugin.name || plugin.id) + ' is loaded');
        }
    }, {
        key: 'async',
        value: function async(fn) {
            var pending = new Promise(function (resolve) {
                return fn(resolve);
            });

            if (this.pendings) {
                return this.pendings.push(pending);
            }
            this.pendings = [pending];
        }
    }, {
        key: 'excute',
        value: function excute() {
            return regeneratorRuntime.mark(function _callee() {
                var plugins, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, plugin;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                plugins = this.plugins;
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 4;
                                _iterator = plugins[Symbol.iterator]();

                            case 6:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 15;
                                    break;
                                }

                                plugin = _step.value;

                                plugin.init && plugin.init();

                                if (!plugin.pendings) {
                                    _context.next = 12;
                                    break;
                                }

                                _context.next = 12;
                                return Promise.all(plugin.pendings);

                            case 12:
                                _iteratorNormalCompletion = true;
                                _context.next = 6;
                                break;

                            case 15:
                                _context.next = 21;
                                break;

                            case 17:
                                _context.prev = 17;
                                _context.t0 = _context['catch'](4);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 21:
                                _context.prev = 21;
                                _context.prev = 22;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 24:
                                _context.prev = 24;

                                if (!_didIteratorError) {
                                    _context.next = 27;
                                    break;
                                }

                                throw _iteratorError;

                            case 27:
                                return _context.finish(24);

                            case 28:
                                return _context.finish(21);

                            case 29:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[4, 17, 21, 29], [22,, 24, 28]]);
            });
        }
    }, {
        key: 'run',
        value: function run() {
            var pipeline = this.excute().call(this);
            var final = {};
            while (!final.done) {
                final = pipeline.next();
            }
        }
    }]);

    return Application;
}(_events2.default);

exports.default = Application;