const { util, DispatherTypes } = require('@foxman/helpers');
const httpProxy = require('http-proxy');
const proxyHandler = require('./proxyHandler');

/**
 * 全局代理插件
 */
class ProxyPlugin {
    name() {
        return 'proxy';
    }

    service() {
        return {};
    }

    constructor({ proxyServerName = '', proxyConfig = {} }) {
        this.$options = {};
        this.$options.enable = !!proxyServerName;
        const service = proxyConfig.service || {};

        if (this.$options.enable) {
            if (!proxyConfig.host) {
                util.error('To configure config proxy.host');
            }

            if (!~Object.keys(service).indexOf(proxyServerName)) {
                util.error(
                    'To check config, and input correct proxyServer name'
                );
            }
        }
        Object.assign(this, {
            proxyServerName,
            proxyConfig
        });
    }

    init({ service }) {
        const use = service('server.use');

        this.registerProxy({
            proxyConfig: this.proxyConfig,
            proxyServerName: this.proxyServerName,
            use,
            proxy: this._createProxyServer()
        });
    }

    _createProxyServer() {
        const proxyConfig = this.proxyConfig;
        const proxy = httpProxy.createProxyServer({});

        proxy.on('proxyReq', req => {
            req.setHeader('X-Special-Proxy-Header', 'foxman');
            req.setHeader('Host', proxyConfig.host);
        });

        proxy.on('end', (req, res, proxyRes) => {
            res.emit('proxyEnd', req, res, proxyRes);
        });

        return proxy;
    }

    registerProxy({ use, proxy, proxyConfig, proxyServerName }) {
        const service = proxyConfig.service[proxyServerName];

        use(
            () =>
                function*(next) {
                    const dispatcher = this.dispatcher || {};
                    const router = dispatcher.router || false;
                    const type = dispatcher.type;

                    if (type === DispatherTypes.DIR || !router) {
                        return yield next;
                    }

                    dispatcher.handler = ctx =>
                        proxyHandler.call(ctx, {
                            proxy,
                            service
                        });

                    yield next;
                }
        );

        util.log(`Proxying to remote server ${proxyServerName}`);
    }
}

module.exports = ProxyPlugin;
