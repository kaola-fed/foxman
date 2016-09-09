'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (settings) {
    if (!renderUtil) {
        renderUtil = new RenderUtil(settings);
    }
    return renderUtil;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jarFile = _path2.default.join(global.__rootdir, 'lib', 'FMtoll.jar');

var renderUtil = void 0;

var RenderUtil = function () {
    function RenderUtil(settings) {
        _classCallCheck(this, RenderUtil);

        this.settings = Object.assign({
            encoding: 'utf-8',
            viewFolder: settings.viewFolder
        }, settings);
    }

    _createClass(RenderUtil, [{
        key: 'parse',
        value: function parse(p1, dataModel) {
            var settings = JSON.stringify(this.settings);
            dataModel = JSON.stringify(dataModel);

            var cmd = (0, _child_process.spawn)('java', ['-jar', jarFile, settings, p1, dataModel]);
            cmd.stderr.setEncoding('utf-8');

            return {
                stderr: cmd.stderr,
                stdout: cmd.stdout
            };
        }
    }]);

    return RenderUtil;
}();

;