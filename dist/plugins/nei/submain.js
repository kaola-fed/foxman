'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _main = require('nei/main');

var _main2 = _interopRequireDefault(_main);

var _path2 = require('nei/lib/util/path');

var _path3 = _interopRequireDefault(_path2);

var _builder = require('nei/lib/nei/builder');

var _builder2 = _interopRequireDefault(_builder);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subMain = _main2.default;

Object.assign(subMain, _events2.default.prototype);

subMain.build = function (arg, action, args) {
    var _this = this;

    this.args = args;
    this.config = {
        action: action
    };
    var cwd = process.cwd() + '/';
    this.config.outputRoot = _path3.default.normalize(_path3.default.absolute((this.args.output || './') + '/', cwd));
    this.checkConfig();
    var loadedHandler = function loadedHandler(ds) {
        _this.config.pid = ds.project.id;
        _this.ds = ds;
        _this.fillArgs();
        // 合并完参数后, 需要重新 format 一下, 并且此时需要取默认值
        _this.args = arg.format(_this.config.action, _this.args, true);
        _this.config.neiConfigRoot = _this.config.outputRoot + 'nei.' + _this.config.pid + '.' + _this.args.key + '/';
        new _builder2.default({
            config: _this.config,
            args: _this.args,
            ds: _this.ds
        });
        _this.emit('updateend', _this.config);
    };
    this.loadData(loadedHandler);
};

exports.default = subMain;