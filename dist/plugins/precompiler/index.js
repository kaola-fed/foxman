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
 test: Array<String> or String
 exclude: Array<String> or String
 handler: (dest) => [
     Gulp插件,
     dest(String)
 ]
 */
var PreCompilerPlugin = function () {
    function PreCompilerPlugin(options) {
        _classCallCheck(this, PreCompilerPlugin);

        this.options = options;
    }

    _createClass(PreCompilerPlugin, [{
        key: 'init',
        value: function init() {
            this.watcher = this.app.watcher;
            this.mapCompiler(this.options.preCompilers);
        }
    }, {
        key: 'mapCompiler',
        value: function mapCompiler(preCompilers) {
            var _this = this;

            preCompilers.forEach(function (preCompiler) {
                _this.prepare(preCompiler);
            });
        }
    }, {
        key: 'prepare',
        value: function prepare(preCompiler) {
            var _this2 = this;

            var handler = preCompiler.handler;
            var root = this.options.root;

            var excludes = preCompiler.exclude || [];
            if (!Array.isArray(excludes)) excludes = [excludes];

            var excludeReg = new RegExp('(' + excludes.join(")||(") + ')', 'ig');

            var patterns = preCompiler.test;

            if (!Array.isArray(patterns)) {
                patterns = [patterns];
            };

            var files = [];
            patterns.forEach(function (pattern) {
                files = files.concat(_globule2.default.find(_path2.default.resolve(root, pattern)).map(function (filename) {
                    _helper.util.log('add ' + filename);
                    return {
                        pattern: _path2.default.resolve(root, pattern.replace(/\*+.*$/ig, '')),
                        filename: filename
                    };
                }));
            });
            files.forEach(function (file) {
                var watchList = [];
                var filename = file.filename;


                if (excludes.length > 0 && excludeReg.test(filename)) {
                    return false;
                }

                var compilerInstance = new _precompiler2.default({
                    root: root, file: file, handler: handler
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

            this.watcher.onChange(news, function (arg0, arg1) {
                _helper.util.log('changed: ' + compiler.file.filename);
                compiler.update();
            });
        }
    }]);

    return PreCompilerPlugin;
}();

exports.default = PreCompilerPlugin;