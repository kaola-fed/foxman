'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _helper = require('../../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServerPlugin = function () {
    function ServerPlugin(options) {
        _classCallCheck(this, ServerPlugin);

        this.options = options;
    }

    _createClass(ServerPlugin, [{
        key: 'init',
        value: function init() {
            new _server2.default(this.options).createServer();
        }
    }]);

    return ServerPlugin;
}();

exports.default = ServerPlugin;