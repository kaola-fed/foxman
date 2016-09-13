'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import Reloader from './reloader';


var _helper = require('../../helper');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 全局代理插件
 */
var ProxyPlugin = function () {
    function ProxyPlugin(options) {
        _classCallCheck(this, ProxyPlugin);

        Object.assign(this, options);
    }

    _createClass(ProxyPlugin, [{
        key: 'init',
        value: function init() {
            /**
             * 命令行选项
             */
            if (!this.proxyServer) {
                return false;
            }

            if (Object.keys(this.proxy).indexOf(this.proxyServer) == -1) {
                _helper.util.error('请核对配置文件，并设置正确的 proxyServerName ');
            }
            this.updateRoutes(this.proxy[this.proxyServer]);
        }
    }, {
        key: 'updateRoutes',
        value: function updateRoutes(resolve) {
            var routes = this.app.server.routers;

            routes.forEach(function (router) {
                var proxyUrl = resolve(router.url.replace(/^(\/)/, ''));

                if (router.sync) {
                    router.syncData = proxyUrl;
                } else {
                    router.asyncData = proxyUrl;
                }
            });
        }
    }]);

    return ProxyPlugin;
}();

exports.default = ProxyPlugin;