'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helper = require('../../helper');

var _preCompiler = require('./preCompiler');

var _preCompiler2 = _interopRequireDefault(_preCompiler);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _globule = require('globule');

var _globule2 = _interopRequireDefault(_globule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 监听插件
 */
var PreCompilerPlugin = function (_BasePlugin) {
    _inherits(PreCompilerPlugin, _BasePlugin);

    function PreCompilerPlugin() {
        _classCallCheck(this, PreCompilerPlugin);

        return _possibleConstructorReturn(this, (PreCompilerPlugin.__proto__ || Object.getPrototypeOf(PreCompilerPlugin)).apply(this, arguments));
    }

    _createClass(PreCompilerPlugin, [{
        key: 'init',
        value: function init() {
            this.mapCompiler(this.options.preCompilers);
        }
    }, {
        key: 'mapCompiler',
        value: function mapCompiler(preCompilers) {
            var _this2 = this;

            preCompilers.forEach(function (preCompiler) {
                _this2.prepare(_this2.app.watcher, preCompiler);
            });
        }
    }, {
        key: 'prepare',
        value: function prepare(watcher, preCompiler) {
            var _this3 = this;

            var handler = preCompiler.handler;
            var root = this.options.root;
            var patterns = preCompiler.test;
            if (!Array.isArray(patterns)) {
                patterns = [patterns];
            };

            var files = [];
            patterns.forEach(function (pattern) {
                files = files.concat(_globule2.default.find(_path2.default.resolve(root, pattern)));
            });
            files.forEach(function (filename) {
                var watchList = [];
                var compilerInstance = new _preCompiler2.default({
                    root: root,
                    filename: filename,
                    handler: handler
                });
                compilerInstance.run();

                _this3.addWatch(watchList, filename, compilerInstance);
                compilerInstance.on('updateWatch', function (event) {
                    var dependencys = event;
                    var news = dependencys.filter(function (item) {
                        return watchList.indexOf(item) === -1;
                    });
                    if (!news.length) return;
                    _this3.addWatch(watchList, news, compilerInstance);
                    _helper.util.log(filename + ' watching \n|-> ' + news.join('\n|->'));
                });
            });
        }
    }, {
        key: 'addWatch',
        value: function addWatch(watchList, news, compiler) {
            if (Array.isArray(news)) {
                news.forEach(function (item) {
                    watchList.push(item);
                });
            } else {
                watchList.push(news);
            }
            this.app.watcher.onChange(news, function (arg0, arg1) {
                _helper.util.log('发生变化:' + compiler.filename);
                compiler.update();
            });
        }
    }]);

    return PreCompilerPlugin;
}(_helper.BasePlugin);

exports.default = PreCompilerPlugin;