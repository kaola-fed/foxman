'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helper = require('../../helper');

var _precompiler = require('./precompiler');

var _precompiler2 = _interopRequireDefault(_precompiler);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _globule = require('globule');

var _globule2 = _interopRequireDefault(_globule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 监听插件
 */
var PreCompilerPlugin = function () {
    function PreCompilerPlugin(options) {
        _classCallCheck(this, PreCompilerPlugin);

        this.options = options;
    }

    _createClass(PreCompilerPlugin, [{
        key: 'init',
        value: function init() {
            this.mapCompiler(this.options.preCompilers);
        }
    }, {
        key: 'mapCompiler',
        value: function mapCompiler(preCompilers) {
            var _this = this;

            preCompilers.forEach(function (preCompiler) {
                _this.prepare(_this.app.watcher, preCompiler);
            });
        }
    }, {
        key: 'prepare',
        value: function prepare(watcher, preCompiler) {
            var _this2 = this;

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
                var compilerInstance = new _precompiler2.default({
                    root: root,
                    filename: filename,
                    handler: handler
                });
                compilerInstance.run();

                _this2.addWatch(watchList, filename, compilerInstance);
                compilerInstance.on('updateWatch', function (event) {
                    var dependencys = event;
                    var news = dependencys.filter(function (item) {
                        return watchList.indexOf(item) === -1;
                    });
                    if (!news.length) return;
                    _this2.addWatch(watchList, news, compilerInstance);
                    _helper.util.log((filename + ' \n      ' + news.join('\n      ')).replace(new RegExp(root, 'ig'), ''));
                });
            });
        }
    }, {
        key: 'addWatch',
        value: function addWatch(watchList, news, compiler) {
            var _this3 = this;

            if (Array.isArray(news)) {
                news.forEach(function (item) {
                    watchList.push(item);
                });
            } else {
                watchList.push(news);
            }
            this.app.watcher.onChange(news, function (arg0, arg1) {
                _helper.util.log(('changed: ' + compiler.filename).replace(new RegExp(_this3.options.root, 'ig'), ''));
                compiler.update();
            });
        }
    }]);

    return PreCompilerPlugin;
}();

exports.default = PreCompilerPlugin;