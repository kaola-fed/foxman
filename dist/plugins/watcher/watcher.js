'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    if (!watcher) watcher = new (Function.prototype.bind.apply(Watcher, [null].concat(args)))();
    return watcher;
};

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _path = require('path');

var _helper = require('../../helper');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _anymatch = require('anymatch');

var _anymatch2 = _interopRequireDefault(_anymatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var watcher = void 0;

var Watcher = function () {
    function Watcher() {
        _classCallCheck(this, Watcher);

        this.root = arguments.length <= 0 ? undefined : arguments[0];
        this.watcher = _chokidar2.default.watch(this.root, {
            ignored: /node_modules/,
            persistent: true
        });
        // this.watcher.setMaxListeners(0);
    }

    _createClass(Watcher, [{
        key: 'removeWatch',
        value: function removeWatch(files) {
            this.watcher.unwatch(files);
        }
    }, {
        key: 'onChange',
        value: function onChange() {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args[0] = Array.isArray(args[0]) ? args[0].map(function (path) {
                return (0, _path.resolve)(_this.root, path);
            }) : (0, _path.resolve)(this.root, args[0]);

            var matcher = (0, _anymatch2.default)(args[0]);
            this.watcher.on('all', function (event, path) {
                if (['add', 'change', 'unlink'].indexOf(event) && matcher(path)) {
                    args[1](path);
                }
            });
        }
    }]);

    return Watcher;
}();

;